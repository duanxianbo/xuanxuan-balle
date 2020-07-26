// user/pages/signContract/signContract.js
const { showBusy, showModel } = require('../../../utils/util');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    contractResId: '',
    accountResId: '',
    imageData: '',
    dialogShow: false
  },
  customData: {
    phone: '',
    second: 60
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Object.assign(this.customData, {
      phone: options.phone
    });

    this.setData({
      accountResId: options.accountResId,
      contractResId: options.contractResId
    })
  },
  onDrawnChanged(event) {
    this.setData({
      imageData: event.detail,
      dialogShow: true
    })
  },
  signContract(imageData) {
    return wx.cloud.callFunction({
      name: "signContract",
      data: {
        contractResId: this.data.contractResId,
        accountResId: this.data.accountResId,
        imageData
      }
    }).catch(error => {
      throw new Error("签署错误");
    })
  },

  onVcodeChecked() {
    showBusy("合同签署中")

      this.signContract(this.data.imageData)
      .then(() => {
        const eventChannel = this.getOpenerEventChannel();
        return wx.navigateBack()
          .then(() => {
            eventChannel.emit('contractSigned', {});
          });
      })
      .catch(error => {
        showModel("签署错误", error.message);
      })
      .finally(wx.hideToast)
  }
})