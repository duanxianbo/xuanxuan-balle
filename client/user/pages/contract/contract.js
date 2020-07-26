// client/pages/contact/contact.js
const { ruleNumber, showBusy, showSuccess, previewFile, showModel } = require('../../../utils/util');
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contractResId: '',
    dialogShow: false,
    confirmed: false,
    options: {},
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
      name: 'parentsIdCard',
      rules: { required: true, message: '请填写身份证' },
    }, {
      name: 'classNumber',
      rules: [{ required: true, message: '请填写课时' }, { validator: ruleNumber("课时") }],
    }, {
      name: 'totalPrice',
      rules: [{ required: true, message: "请填写总价格" }, { validator: ruleNumber("总价格") }]
    },
    {
      name: "phone",
      rules: [{ required: true, message: '请填写手机' }, { mobile: true, message: '手机格式不对' }]
    }, {
      name: "email",
      rules: [{ required: true, message: "请填写邮箱" }, { email: true, message: "邮箱格式不对" }]
    }]
  },
  customData: {
    fileID: '',
    taskId: 0,
    accountResId: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options
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
      this.generateContract();
    });

  },
  formInputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      confirmed: false,
      [`formData.${field}`]: e.detail.value
    })
  },

  previewContract() {
    previewFile("下载合同", "预览失败", this.customData.fileID);
  },
  generateContract() {
    showBusy("生成合同")
    this.openAccount()
      .then(() => {
        return this.contractPdf();
      })
      .then(() => {
        this.setData({
          confirmed: true
        });
      })
      .catch((error) => {
        this.setData({
          confirmed: false
        });
        showModel("生成错误", error.message)
      })
      .finally(wx.hideToast);
  },
  openAccount() {
    return wx.cloud.callFunction({
      name: "openClientAccount",
      data: this.data.formData
    }).then(res => {
      this.customData.accountResId = res.result;
    }).catch((error) => {
      throw new Error("请验证身份信息")
    });
  },
  contractPdf() {
    return wx.cloud.callFunction({
      name: 'addContract',
      data: { ...this.data.formData, accountResId: this.customData.accountResId }
    }).then((res) => {
      Object.assign(this.customData, {
        fileID: res.result.fileID,
        taskId: res.result.taskId
      });

    }).catch((error) => {
      throw new Error("添加合同失败")
    });
  },
  onVcodeChecked() {
    wx.navigateTo({
      url: `/user/pages/signContract/signContract?contractResId=${this.data.contractResId}&accountResId=${this.customData.accountResId}&phone=${this.data.formData.phone}`,
      events: {
        contractSigned: () => {
          showBusy('合同存档中')
          return Promise.all([
            this.submitForm(), this.updateContract()])
            .then(() => {
              showSuccess("合同已存档")
              wx.navigateBack();
            }).catch((error) => {
              showModel("存档错误", error.message);
            }).finally(wx.hideToast);
        }
      }
    })
  },
  showVcodeDialog() {
    showBusy("获取合同")

    return wx.cloud.callFunction({
      name: "getContract",
      data: { taskId: this.customData.taskId }
    })
    .then((res) => {
      this.setData({
        contractResId: res.result,
        dialogShow: true
      })
    })
    .catch(error => {
      showModel("获取错误", "获取合同失败");
    })
    .finally(wx.hideToast)
  },
  //保存
  submitForm(e) {
    db.collection('contracts').add({
      data: { ...this.data.formData, user: this.data.options.user, fileID: this.customData.fileID, contractResId: this.data.contractResId, accountResId: this.customData.accountResId }
    }).catch((error) => {
      throw new Error("保存合同失败")
    });
  },
  updateContract() {
    return wx.cloud.callFunction({
      name: "updateContract",
      data: {
        parentsName: this.data.formData.parentsName,
        contractResId: this.data.contractResId
      }
    }).catch((error) => {
      throw new Error("更新合同失败")
    });
  }
})