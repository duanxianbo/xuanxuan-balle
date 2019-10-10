// pages/pay/pay_single.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    txtOrderCode: '',
    openId:'',
    userInfo:[],
    mct_name:'',
    mct_id:'',
    name:'',
    phone:'',
    flag:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.name)
    this.setData({
      mct_name:options.name,
        txtOrderCode:options.price
    })
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  pay: function () {
    var ordercode = this.data.txtOrderCode;
    var openId=this.data.userInfo.openId;
    var that=this

    if(this.data.flag==true){
      if(this.data.name.length!=0 && this.data.phone.length!=0){
    wx.login({
      success: function (res) {
        console.log(res)
        console.log(that.data.userInfo.openId)
        console.log(that.data.mct_id)
        console.log(ordercode)

        var myDate=new Date();
        var today = myDate.toDateString()

        if (res.code) {
          wx.request({
            url: 'https://104724433.xuanxuanballe.club/weapp/wxpay',
            data: {
              openId: that.data.userInfo.openId,
              mct_id:that.data.mct_id,
              price: ordercode
            },
            method: 'POST',
            success: function (res) {
              console.log(res.data)
              wx.requestPayment({
                timeStamp: res.data.paysign2.timeStamp,
                nonceStr: res.data.paysign2.nonceStr,
                package: res.data.paysign2.package,
                signType: res.data.paysign2.signType,
                paySign: res.data.paysign2.sign,


            
                success: function (res) {
                  // success
                  console.log(res);
                  console.log(that.data.mct_id)
                  wx.request({
                    url: 'https://104724433.xuanxuanballe.club/weapp/order_single',
                    // url: 'https://rv647fej.qcloud.la/weapp/form',
                    method: "POST",
                    header: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                      //  'Content-Type': 'application/json'
                    },

                    
                    data: { openId: that.data.userInfo.openId, mct_id: that.data.mct_id, price: that.data.txtOrderCode,mct_name:that.data.mct_name,time:today,name:that.data.name,phone:that.data.phone},

                    success: function (res) {
                      console.log(res)
                    }
                  })

                  wx.showModal({
                    title: '支付成功',
                    content: '请前往我的订单查看',
                  })

                },
                fail: function (res) {
                  // fail
                  console.log(res);
                },
                complete: function (res) {
                  // complete
                  console.log(res);
                }
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
      }else{
        wx.showModal({
          title: '请输入用户信息',
          content: '请输入姓名和预约电话',
        })
      }

    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'loading',
      })
    }
         
  
  },



  // 获取授权用户信息
  btn_sub: function (res) {
    var that = this
    if (this.data.logged) return

    util.showBusy('正在登录')

    const session = qcloud.Session.get()

    if (session) {
      qcloud.loginWithCode({
        success: res => {
          this.setData({ userInfo: res, logged: true ,flag:true})
          util.showSuccess('登录成功')
          console.log(this.data)
          var myDate = new Date()
          var mct_id=res.openId + myDate.getTime().toString()
          var mct_id2=mct_id.substring(mct_id.length - 32)
          console.log(mct_id2)
          this.setData({
            mct_id:mct_id2
          })


        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    } else {
      qcloud.login({
        success: res => {
          this.setData({ userInfo: res, logged: true,flag:true })
          util.showSuccess('登录成功')
          console.log(this.data.userInfo)
          this.setData({
            openId: this.data.userInfo.openId
          })
          console.log(this.data.openId)
          var list = JSON.stringify(this.data.userInfo);

        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    }

  },

changeName:function(e){
  console.log(e.detail.value)
  this.setData({
    name:e.detail.value
  })
},

  changePhone: function (e) {
    console.log(e.detail.value)
    this.setData({
      phone: e.detail.value
    })
  },


  formSubmit: function (e) {

    var that = this;
    var formData = e.detail.value;
    var sex;
    var access_token;
    console.log(formData);

    console.log(e.detail.formId)
    console.log(e.detail.value.username)
   
  },

  formReset: function () {
    console.log('form发生了reset事件');
    this.modalTap2();
  },




  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})