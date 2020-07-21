// client/pages/contact/contact.js
const { ruleNumber, showBusy, showSuccess, showModel, previewFile } = require('../../../utils/util');
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogShow: false,
    dialogButtons: [{text: '取消'}],
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
    }, {
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
  tapDialogButton(e) {
    this.setData({
        dialogShow: false
    })
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
      showModel("合同生成失败", "请核对个人信息");
    })
    .finally(wx.hideToast);
  },
  openAccount() {
    return wx.cloud.callFunction({
      name: "openClientAccount",
      data: this.data.formData
    }).then(res=> {
      this.customData.accountResId = res.result;
    })
  },
  contractPdf() {
    return wx.cloud.callFunction({
      name: 'addContract',
      data: {...this.data.formData, accountResId: this.customData.accountResId}
    }).then((res) => {
      Object.assign(this.customData, {
        fileID: res.result.fileID,
        taskId:  res.result.taskId
      });

    });
  },

  signContract() {
    wx.navigateTo({
      url: `/user/pages/signContract/signContract?taskId=${this.customData.taskId}&accountResId=${this.customData.accountResId}&parentsName=${this.data.formData.parentsName}&phone=${this.data.formData.phone}`
    })
  },

  //保存
  submitForm(e) {
    showBusy("合同保存中");
    db.collection('contracts').add({
      data: { ...this.data.formData, user: this.data.options.user, fileID: this.customData.fileID }
    }).then(() => {

      showSuccess("合同已存档");
      wx.navigateBack();


    }).catch((error) => {
      showModel("合同存档失败", error);
    }).finally(wx.hideToast);

  },
})