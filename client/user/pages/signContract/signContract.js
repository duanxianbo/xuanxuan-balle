// user/pages/signContract/signContract.js
const { ruleNumber, showBusy, showSuccess, showModel, previewFile } = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    vcodeButtonText: "发送验证码",
    vcodeButtonDisabled: false,
    error: '',
    ready: false,
    code: ''
  },
  customData: {
    context: null,
    isButtonDown : false,
    arrx : [],
    arry : [],
    arrz : [],
    canvasw : 0,
    canvash : 0,
    phone: '',
    contractResId: '',
    accountResId: '',
    second: 60,
    taskId: 0,
    parentsName: ''
  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  canvasStart: function (event){
    this.customData.isButtonDown = true;
    this.customData.arrz.push(0);
    this.customData.arrx.push(event.changedTouches[0].x);
    this.customData.arry.push(event.changedTouches[0].y);
    //context.moveTo(event.changedTouches[0].x, event.changedTouches[0].y);
   
  },
  canvasMove: function (event) {
    if (this.customData.isButtonDown) {
      this.customData.arrz.push(1);
      this.customData.arrx.push(event.changedTouches[0].x);
      this.customData.arry.push(event.changedTouches[0].y);
    };
 
    const context = this.customData.context;

    for (let i = 0; i < this.customData.arrx.length; i++) {
      if (this.customData.arrz[i] == 0) {
       context.moveTo(this.customData.arrx[i], this.customData.arry[i])
      } else {
        context.lineTo(this.customData.arrx[i], this.customData.arry[i])
      };
    };

  
    context.clearRect(0, 0, this.customData.canvasw, this.customData.canvash);

    context.setStrokeStyle('#000000');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');
    context.stroke();
    
    context.draw(false);

    if (!this.data.ready) {
      this.setData({
        ready: true
      })
    }
  },
  cleardraw: function () {
    //清除画布
    this.customData.arrx = [];
    this.customData.arry = [];
    this.customData.arrz = [];
    this.customData.context.clearRect(0, 0, this.customData.canvasw, this.customData.canvash);
    this.customData.context.draw(true);
    this.setData({
      ready: false
    });
  },
  canvasEnd: function (event) {
    this.customData.isButtonDown = false; 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Object.assign(this.customData, options);

    wx.getSystemInfo({
      success:  (res) => {
        this.customData.canvasw = res.windowWidth;//设备宽度
        this.customData.canvash = res.windowHeight;
     
             // 使用 wx.createContext 获取绘图上下文 context
        const context = wx.createCanvasContext('canvas');
        context.beginPath() 
        context.setStrokeStyle('#000000');
        context.setLineWidth(4);
        context.setLineCap('round');
        context.setLineJoin('round');

        this.customData.context = context;

      }
    });

    this.getContract();
  },

  signContract(imageData) {
    return wx.cloud.callFunction({
      name: "signContract",
      data: {
        contractResId: this.customData.contractResId, 
        accountResId: this.customData.accountResId,
        imageData
      }
    }).catch(error => {
      throw new Error("签署错误");
    })
  },
  getImageData() {
    return wx.canvasToTempFilePath({
      canvasId: "canvas"
    }).then(res => {
      return wx.getFileSystemManager().readFile({
        filePath: res.tempFilePath, //选择图片返回的相对路径
        encoding: 'base64', //编码格式
      })
    }).then((res) => {
      return res.data;
    })
    .catch(error => {
      throw new Error("签名生成错误");
    });
  },
  checkVcode() {
    return wx.cloud.callFunction({
      name: "checkVcode",
      data: {
        accountResId: this.customData.accountResId, 
        contractResId: this.customData.contractResId,
        code: this.data.code
      }
    })
    .catch((error) => {
      throw new Error("验证码输入错误");
    });
  },
  sendVcode() {
    this.setData({
      vcodeButtonDisabled: true
    });
    showBusy("发送验证码")
    wx.cloud.callFunction({
        name: "sendVcode",
        data: {
          accountResId: this.customData.accountResId,
          contractResId: this.customData.contractResId
        }
      }
    ).then(() => {
      this.getVcodeTimer();
    }).catch(error => {
      wx.hideToast();
      this.setData({
        error: "发送验证码错误"
      })
    })
},
confirmContract() {
  showBusy("合同签署中")
  this.checkVcode()
  .then(() => {
    return this.getImageData();
  })
  .then((imageData) => {
   return this.signContract(imageData);
  })
  .then(() => {
    return this.updateContract();
  })
  .then(() => {
    wx.navigateBack();
  })
  .catch(error => {
    this.setData({
      error: error.message
    })
  })
  .finally(wx.hideToast)
},
updateContract() {
  return wx.cloud.callFunction({
    name: "updateContract",
    data: {
      parentsName: this.customData.parentsName,
      contractResId: this.customData.contractResId
    }
  })
  .catch(error=> {
    throw new Error("上传合同失败")
  })
},
codeInputChange(e) {
  this.setData({
    code: e.detail.value
  });
},
getVcodeTimer() {
  const promise = new Promise((resolve) => {
    const setTimer = setInterval(
      () => {
        this.customData.second--;
        this.setData({
          vcodeButtonText: this.customData.second + '秒',
          vcodeButtonDisabled: true
        })
        if (this.customData.second <= 0) {
          this.customData.second = 60;
          this.setData({
            vcodeButtonText: '获取验证码',
            vcodeButtonDisabled: false
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
  getContract() {
    showBusy("获取合同");
    wx.cloud.callFunction({
      name: "getContract",
      data: {taskId: this.customData.taskId}
    }).then(res => {
      this.customData.contractResId = res.result;
    })
    .catch(error => {
      this.setData({
        error: "获取合同错误"
      });
    })
    .finally(wx.hideToast);
  }
})