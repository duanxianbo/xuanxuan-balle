var app = getApp();
Page({
  data: {
    // text:"这是一个页面"
    array: [],
    formId:'',
    toast1Hidden: true,
    date: '2019-01-01',
    birth:'2000-01-01',
    modalHidden: true,
    modalHidden2: true,
    notice_str: '',
    formId:'',
    access_tokn:'',
    index: 0
  },
  toast1Change: function (e) {
    this.setData({ toast1Hidden: true });
  },
  //弹出确认框
  modalTap: function (e) {
    this.setData({
      modalHidden: false
    })
  },
  confirm_one: function (e) {
    console.log(e);
    this.setData({
      modalHidden: true,
      toast1Hidden: false,
      notice_str: '提交成功'
    });
  },
  cancel_one: function (e) {
    console.log(e);
    this.setData({
      modalHidden: true,
      toast1Hidden: false,
      notice_str: '取消成功'
    });
  },
  //弹出提示框
  modalTap2: function (e) {
    this.setData({
      modalHidden2: false
    })
  },
  modalChange2: function (e) {
    this.setData({
      modalHidden2: true
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindBirthChange: function (e) {
    this.setData({
      birth: e.detail.value
    })
  },


  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var arr1 = new Array(101);
    arr1[0]="请选择您的年龄"
    for (var i = 1; i < arr1.length; i++) {
      arr1[i] = i;
    }
    this.setData({
      array:arr1
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  formSubmit: function (e) {

    var that = this;
    var formData = e.detail.value;
    var sex;
    var access_token;
    console.log(formData);

console.log(e.detail.formId)
this.setData({
  formId:e.detail.formId
})


if(e.detail.value.gender==1){
  sex="男"
}else{
  sex="女"
}

    if (e.detail.value.username.length == 0 || e.detail.value.smallName.length == 0 || e.detail.value.phone.length == 0 ||sex.length==0){
  wx.showModal({
    title:"信息输入不全",
    content:"请输入完整的预约信息",
  })
}else{
    wx.request({
      url: 'https://104724433.xuanxuanballe.club/weapp/form',
      // url: 'https://rv647fej.qcloud.la/weapp/form',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
        //  'Content-Type': 'application/json'
      },
      //data: {name:e.detail.value.username,sex:e.detail.value.gender,age:e.detail.value.age,date:e.detail.value.date},
      data: { name: e.detail.value.username, smallName: e.detail.value.smallName, phone: e.detail.value.phone, date: e.detail.value.date,birth:e.detail.value.birth,sex:sex},
      success: function (res) {
        if(res.data.status==0){
          wx.showToast({
            title:res.data.info,
            icon:'loading',
            duration:1500
          })
        }else{
          wx.showToast({
            title: '提交成功',
            icon:"success",
            duration:1000
          })

          // wx.request({
          //   url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + 'wx158a051ad1abcd07' + '&secret=' + '1fa8cb44303127b78a5a0d78f9c84ad4',
          //   data: {},
          //   header: {
          //     'content-type': 'application/json'
          //   },
          //   success: function (res) {
          //     console.log(res.data.access_token)
          //     that.setData({
          //       access_token: res.data.access_token
          //     })

              console.log('[*] 用户反馈，开始通知管理员。。');
              wx.request({
                url: 'https://wx158a051ad1abcd07.mssnn.cn/v2/api/vpush?id=1',
                method: 'POST',
                dataType: 'json',
                header: {
                  'Content-Type': "application/json",
                  // "X-Parse-Application-Id": "guren_cloud_vpush"
                },
                data: {
                  "secret": "8374e-54f6f-a5b97-54895",
                  "path": "pages/schedule/schedule",
                  // 这里填写管理员的openId
                  "openId": "oBiQ-5SYHZHELA6GqipjDy2GiQDo",
                  "data": [
                    e.detail.value.username, 
                    e.detail.value.age, 
                     e.detail.value.phone,
                    e.detail.value.date, 
                    sex,]
                },
                success: function (res) {
                  console.log(res)
                }
              })


              // wx.request({
              //   url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + that.data.access_token,
              //   data: {
              // //  "touser": 'oBiQ-5U7MRFe6wRTt5ij35A3RNkA',
              //     // "touser": 'oBiQ-5SYHZHELA6GqipjDy2GiQDo',
              //    "touser": 'oBiQ-5c8f7BapgKK8TrpQe81Ym5U',
              //     "template_id": '6rApjpAaxg7bLVVfTJ-LPuSepzFC_6QEPVFrl16gKxo',
              //     "form_id": that.data.formId,
              //     "page": "/pages/schedule/schedule",
              //     "data": {
              //       "keyword1": { "value": e.detail.value.username, "color": "#173177" },
              //       "keyword2": { "value": e.detail.value.age, "color": "#173177" },
              //       "keyword3": { "value": e.detail.value.phone, "color": "#173177" },
              //       "keyword4": { "value": e.detail.value.date, "color": "#173177" },
              //       "keyword5": { "value": sex, "color": "#173177" },
              //     }
              //   },
              //   method: "POST",
              //   header: {
              //     'content-type': 'application/json'
              //   },
              //   success: function (res) {
              //     console.log(res)
              //   }
              // })
            // }
          // })

        }
        console.log(res)
      }
    })
}

  },
  formReset: function () {
    console.log('form发生了reset事件');
    this.modalTap2();
  }
})
