const { showBusy, showModel} = require('../../../utils/util');

// user/components/sendVcode/sendVcode.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    accountResId: String,
    contractResId: String,
    show: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    code: "",
    sendVcodeButtonText:  '获取验证码',
    sendVcodeButtonDisabled: false,
    second: 60
  },
  /**
   * 组件的方法列表
   */
  methods: {
    codeInputChange(e) {
      this.setData({
        code: e.detail.value
      });
    },

    checkVcode() {
   
      showBusy("验证中")
      return wx.cloud.callFunction({
        name: "checkVcode",
        data: {
          accountResId: this.properties.accountResId,
          contractResId: this.properties.contractResId,
          code: this.data.code
        }
      })
      .then(() => {
        this.triggerEvent("vcodechecked", true);
      })
        .catch((error) => {
          showModel('验证错误', "验证码不正确");
        });
    },
    sendVcode() {
      this.setData({
        sendVcodeButtonText: "正在发送",
        sendVcodeButtonDisabled: true
      });
      showBusy("发送验证码")
      wx.cloud.callFunction({
        name: "sendVcode",
        data: {
          accountResId: this.properties.accountResId,
          contractResId: this.properties.contractResId
        }
      }
      ).then(() => {
        this.getVcodeTimer();
      }).catch(error => {
        showModel("发送错误", "验证码发送错误");
        this.setData({
          sendVcodeButtonText: "获取验证码",
          sendVcodeButtonDisabled: false
        });
      }).finally(wx.hideToast)
    },
    getVcodeTimer() {
      const promise = new Promise((resolve) => {
        const setTimer = setInterval(
          () => {
            const second = this.data.second-1;
            this.setData({
              second,
              sendVcodeButtonText: second + '秒',
              sendVcodeButtonDisabled: true
            })
            if (second <= 0) {
              this.setData({
                second: 60,
                sendVcodeButtonText: "获取验证码",
                sendVcodeButtonDisabled: false
              });
              resolve(setTimer)
            }
          }, 1000)
      })
      promise.then((setTimer) => {
        clearInterval(setTimer)
      })
    }
  }
})
