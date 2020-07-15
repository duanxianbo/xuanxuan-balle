// client/pages/contact/contact.js
const zhenzisms = require('../../../utils/zhenzisms.js');
const { ruleNumber, showBusy, showSuccess, showModel, previewFile } = require('../../../utils/util');
const db = wx.cloud.database();

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
      rules: [{ required: true, message: '请填写课时' }, { validator: ruleNumber("课时") }],
    }, {
      name: 'totalPrice',
      rules: [{ required: true, message: "请填写总价格" }, { validator: ruleNumber("总价格") }]
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
  codeValidator: function (_rule, value) {
    if (value !== this.data.real_code) {
      return '请输入正确的验证码';
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options,
      ['rules[8].rules']: [...this.data.rules[8].rules, { validator: this.codeValidator }]
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



      this.contractPdf();


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
    let random_code = /*Math.random().toString().slice(-6)*/12345;
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

      showModel("验证码发送失败", res.data.data);
    }, { number: that.data.formData.phone, message: '欢迎您加入美哚舞蹈，签署合同的验证码为:\n' + random_code });
    zhenzisms.client.send(function (res) {
      if (res.data.code == 0) {
        return;
      }

      showModel("验证码发送失败", res.data.data);
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
    previewFile("下载合同", "预览失败", this.custumData.fileID);
  },
  contractPdf() {
    showBusy("生成合同");
    return wx.cloud.callFunction({
      name: 'addContract',
      data: this.data.formData
    }).then((res) => {
      this.custumData.fileID = res.result.fileID;
      this.setData({
        confirmed: true
      });

    }).catch((error) => {
      showModel("合同生成失败", error);
    }).finally(wx.hideToast);
  },
  //保存
  submitForm(e) {
    const { code, ...infos } = this.data.formData;
    showBusy("合同保存中");

    db.collection('contracts').add({
      data: { ...infos, user: this.data.options.user, fileID: this.custumData.fileID }
    }).then(() => {

      showSuccess("合同已存档");
      wx.navigateBack();


    }).catch((error) => {
      showModel("合同存档失败", error);
    }).finally(wx.hideToast);

  },
})