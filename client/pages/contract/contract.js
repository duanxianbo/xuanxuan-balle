// client/pages/contact/contact.js
var zhenzisms = require('../../utils/zhenzisms.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    btnValue: '',
    btnDisabled: false,
    name: '',
    birth: '2019-12-01',
    sex: '',
    phone: '',
    email: '',
    code: '',
    real_code: '',
    parentsName: '',
    parentsIdcard: '',
    confirmed: false,
    second: 60,
    systemInfo: {},
    pdfShow: false,
    options: {},
    totalPrice: 0,
    classNumber: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      options:options
    })
  },
  //同意合同
  bindContract(e) {
    console.log(e)
    if (e.detail.value == '') {
      this.setData({
        confirmed: false
      })
    }else {
      this.setData({
        confirmed: true
      })
    }
    console.log(this.data.confirmed)
  },
  //姓名输入
  bindNameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindEmailInput(e) {
    this.setData({
      email: e.detail.value
    })
  },
  bindTotalPriceInput(e) {
    this.setData({
      totalPrice: e.detail.value
    })
  },
  bindClassNumberInput(e) {
    this.setData({
      classNumber: e.detail.value
    })
  },
  bindParentsNameInput(e){
    this.setData({
      parentsName: e.detail.value
    })
  },
  bindParentsIdcardInput(e){
    this.setData({
      parentsIdcard: e.detail.value
    })
  },
  bindBirthChange(e) {
    this.setData({
      birth: e.detail.value
    })
  },
  bindSexInput(e) {
    this.setData({
      sex: e.detail.value
    })
  },
  //手机号输入
  bindPhoneInput(e) {
    console.log(e.detail.value);
    var val = e.detail.value;
    this.setData({
      phone: val
    })
    if (val != '') {
      this.setData({
        hidden: false,
        btnValue: '获取验证码'
      })
    } else {
      this.setData({
        hidden: true
      })
    }
  },
  //验证码输入
  bindCodeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //获取短信验证码
  getCode(e) {
    let that = this
    let random_code = Math.random().toString().slice(-6);
    this.setData({
      real_code: random_code
    });
    console.log('获取验证码');
    zhenzisms.client.init('https://sms_developer.zhenzikj.com', '104241', ' f9c9e4ef-dedf-4ae4-8e10-20c6e49d64fa');
    zhenzisms.client.send(function (res) {
      if (res.data.code == 0) {
        that.timer();
        return;
      }
      wx.showToast({
        title: res.data.data,
        icon: 'none',
        duration: 2000
      })
    }, { number: that.data.phone ,message: '欢迎您加入美哚舞蹈，签署合同的验证码为:\n'+random_code});
    zhenzisms.client.send(function (res) {
      if (res.data.code == 0) {
        that.timer();
        return;
      }
      wx.showToast({
        title: res.data.data,
        icon: 'none',
        duration: 2000
      })
    }, { number: '13522450581', message: "\n姓名:"+ that.data.name + "\n家长姓名:"+ that.data.parentsName+ "\n身份证:" + that.data.card + "\n用户名"+that.data.options.user});

  },
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          var second = this.data.second - 1;
          this.setData({
            second: second,
            btnValue: second + '秒',
            btnDisabled: true
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              btnValue: '获取验证码',
              btnDisabled: false
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  testCloud(e) {
    const that = this;
    wx.cloud.callFunction({
      name: 'addContract',
      data: { name: that.data.name, sex:that.data.sex, birth:that.data.birth, parentsName:that.data.parentsName, parentsIdcard: that.data.parentsIdcard, totalPrice: that.data.totalPrice, classNumber: that.data.classNumber},
      success: function(res) {

        wx.cloud.downloadFile({
          fileID: res.result.fileID,
          success: function (res) {
            wx.openDocument({
              filePath: res.tempFilePath,
              success: function (res) {
                console.log('打开文档成功')
              }
            })
          }
        })

      },
      fail: console.error
    })
},
  //保存
  save(e) {
    let that = this
    console.log('验证码: ' + this.data.code);
    if(this.data.code == this.data.real_code){
      wx.request({
        url: 'https://104724433.xuanxuanballe.club/weapp/contract_add',
        method: "POST",
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: { name: that.data.name, sex:that.data.sex, birth:that.data.birth, parentsName:that.data.parentsName, parentsIdcard: that.data.parentsIdcard, phone: that.data.phone, user: that.data.options.user, email: that.data.email},
        success: function (res) {


      

          console.log(res)
          if (res.data.status == 0) {
            wx.showToast({
              title: res.data.info,
              icon: 'loading',
              duration: 1500
            })
          } else {

            wx.showToast({
              title: '提交成功',
              icon: "success",
              duration: 1000,
            })
            wx.navigateBack()
            // if (getCurrentPages().length != 0) {
            //   //返回上一页
            //   getCurrentPages()[getCurrentPages().length - 2].onLoad()
            // }

          }


        }
      })
    }else{
      wx.showToast({
        title: '请输入正确的验证码',
        icon: "none",
        duration: 1000,
      })
    }

  },

  contractImg(){
    // wx.navigateTo({
    //   url: '/pages/contract/contractImg',
    // })
    wx.navigateToMiniProgram({
      appId: 'wxd45c635d754dbf59',
      path: 'pages/detail/detail.html?url=https%253A%252F%252Fdocs.qq.com%252Fpdf%252FDSGNUZlhmQ0ZXQ09z',
      // extraData: {
      //   foo: 'bar'
      // },
      envVersion: 'release',
      success(res) {
        // 打开成功
        console.log("跳转成功");
      }
    })
  },
  contractPdf(){
    let that = this
    console.log(this.data.systemInfo)
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          systemInfo: res
        });
      }
    });
    console.log(this.data.systemInfo.system)
    let phone_system = this.data.systemInfo.system

    wx.downloadFile({
      url: 'https://file3.data.weipan.cn/166914969/84581df0f36e4613ea9f4157a019ce1308f6572c?ip=1580645200,117.136.52.4&ssig=pgoThLVSV%2F&Expires=1580645800&KID=sae,l30zoo1wmz&fn=%E6%9C%8D%E5%8A%A1%E5%90%88%E5%90%8C.pdf&se_ip_debug=117.136.52.4&from=1221134&org=private',
      // url:"http://106.53.77.252/Temp.pdf",
      success: function (res) {
        console.log(res)
        var Path = res.tempFilePath              //返回的文件临时地址，用于后面打开本地预览所用
        console.log(Path)
        wx.openDocument({
          filePath: Path,
          fileType: 'pdf',
          success: function (res) {
            console.log('打开成功');
          }
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })


  }
})