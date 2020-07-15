// client/pages/contact/contact.js
var zhenzisms = require('../../../utils/zhenzisms.js');
const {ruleNumber} = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    btnValue: '',
    btnDisabled: false,
    real_code: '',
    confirmed: false,
    second: 60,
    options: {},
    loading: false,
    sexItems: [
      {
        value: "男",
        checked: false
      },
      {
        value: "女",
        checked: false
      }
    ],
    formData: {
      birth: "1994-01-01"
    },
    rules: [{
      name: 'name',
      rules: { required: true, message: '请填写姓名' },
    }, {
      name: 'sex',
      rules: { required: true, message: '请勾选性别' },
    }, {
      name: 'birth',
      rules: { required: true, message: '请填写生日' },
    }, {
      name: 'parentsName',
      rules: [{ required: true, message: '请填写父母姓名' }],
    }, {
      name: 'parentsIdcard',
      rules: { required: true, message: '请填写身份证' },
    }, {
      name: 'classNumber',
      rules: [{ required: true, message: '请填写课时' }, {validator: ruleNumber("课时")}],
    }, {
      name: 'totalPrice',
      rules: [{ required: true, message: "请填写总价格" }, {validator: ruleNumber("总价格")}]
    }, {
      name: "phone",
      rules: [{ required: true, message: '请填写手机' }, { mobile: true, message: '手机格式不对' }]
    }, {
      name: "code",
      rules: [{ required: true, message: "请填写验证码" }]
    }, {
      name: "email",
      rules: [{ required: true, message: "请填写邮箱" }, { email: true, message: "邮箱格式不对" }]
    }]
  },
 custumData: {
  fileID: '',
 },
 codeValidator: function(_rule, value) {
    if (value!== this.data.real_code) {
      return '请输入正确的验证码';
    }
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options,
      ['rules[8].rules']:  [...this.data.rules[8].rules, {validator: this.codeValidator}]
    });
  },
  //同意合同
  bindContract(e) {
    const currentValue = e.detail.value[0];

    if (currentValue === undefined) {
      this.setData({
        confirmed: false
      })
      return;
    }

    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })
        }
        this.setData({
          confirmed: false
        })
        return;
      }

      
      this.contractPdf(() => {
        this.setData({
          confirmed: true
        });
      });
   
    });

  },

  formInputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      confirmed: false,
      [`formData.${field}`]: e.detail.value
    })
  },
  //手机号输入
  bindPhoneInput(e) {

    var val = e.detail.value;
    this.setData({
      confirmed: false,
      "formData.phone": val
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
  //获取短信验证码
  getCode(e) {
    let that = this
    let random_code = Math.random().toString().slice(-6);
    this.setData({
      real_code: `${random_code}`
    });
    console.log('获取验证码');
    zhenzisms.client.init('https://sms_developer.zhenzikj.com', '104241', ' f9c9e4ef-dedf-4ae4-8e10-20c6e49d64fa');
    zhenzisms.client.send(function (res) {
      if (res.data.code == 0) {
        that.timer();
        return;
      }
      this.setData({
        error: res.data.data
      })
    }, { number: that.data.formData.phone, message: '欢迎您加入美哚舞蹈，签署合同的验证码为:\n' + random_code });
    zhenzisms.client.send(function (res) {
      if (res.data.code == 0) {
        return;
      }

      this.setData({
        error: res.data.data
      })
    }, { number: '13522450581', message: "\n姓名:" + that.data.formData.name + "\n家长姓名:" + that.data.formData.parentsName + "\n身份证:" + that.data.formData.parentsIdcard + "\n用户名" + that.data.options.user });

  },
  timer: function () {
    let promise = new Promise((resolve) => {
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
  previewContract() {
    wx.showLoading({icon: 'loading', duration: 10000});
    wx.cloud.downloadFile({
      fileID: this.custumData.fileID,
      success: (downloadRes) => {
        wx.openDocument({
          filePath: downloadRes.tempFilePath,
          success: wx.hideLoading,
          error: (error) => {
            this.setData({
              error
            })
          }
        })
      }
    })
  },
  contractPdf(callback) {
    wx.showLoading({icon: 'loading', duration: 10000});
    wx.cloud.callFunction({
      name: 'addContract',
      data: this.data.formData,
      success: (res) => {
        this.custumData.fileID = res.result.fileID;
        wx.hideLoading();
        callback();
      },
      fail: (error) => {
        wx.hideLoading();
        this.setData({
          error
        })
      }
    })
  },
  //保存
  submitForm(e) {
      const { code, ...infos } = this.data.formData;
      wx.showLoading({icon: 'loading', duration: 10000});
        wx.request({
          url: 'https://104724433.xuanxuanballe.club/weapp/contract_add',
          method: "POST",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: { ...infos, user: this.data.options.user, fileID: this.custumData.fileID },
          success: (res) => {
            wx.hideLoading();
            if (res.data.code === -1) {
              this.setData({
                error: res.data.error
              })
            } else {
              wx.navigateBack()
            }
          }
        })

  },
})