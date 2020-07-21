// user/pages/signContract/signContract.js
const { ruleNumber, showBusy, showSuccess, showModel, previewFile } = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    vcodeButtonText: "发送验证码",
    vcodeButtonDisabled: false,
    error: ''
  },
  customData: {
    code: 0,
    phone: '',
    contractResId: '',
    accountResId: '',
    second: 60,
    taskId: 0,
    parentsName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Object.assign(this.customData, options);
    this.getContract();
  },

  sendVcode() {
    this.setData({
      vcodeButtonDisabled: true
    });

    wx.cloud.callFunction({
        name: "sendVcode",
        data: {
          accountResId: this.customData.accountResId,
          contractResId: this.customData.contractResId
        }
      }
    ).then(() => {
      this.getVcodeTimer();
    })
},
codeInputChange(e) {
  this.customData.code = e.detail.value;
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
    showBusy("正在授权合同");
    wx.cloud.callFunction({
      name: "getContract",
      data: {taskId: this.customData.taskId}
    }).then(res => {
      this.customData.contractResId = res.result;
    })
    .catch(error => {
      this.setData({
        error
      });
    })
    .finally(wx.hideToast);
  }
})