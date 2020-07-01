// pages/login/login.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var app=getApp();

Page({
  data: {
    phone: '',
    password: '',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    openId: '',
    tab:[]
  },



  bindGetUserInfo: function () {
    var that = this
    if (this.data.logged) return

    // util.showBusy('正在登录')

    const session = qcloud.Session.get()

    if (session) {
      qcloud.loginWithCode({
        success: res => {
          this.setData({ userInfo: res, logged: true })
          // util.showSuccess('登录成功')
          console.log(this.data.userInfo)
          this.setData({
            openId: this.data.userInfo.openId
          })
          app.globalData.openId = this.data.userInfo.openId;
          console.log(this.data.openId)
          console.log(app.globalData.openId)
          var list = JSON.stringify(this.data.userInfo);
          // console.log(list)

          wx.request({
            // url: 'https://rv647fej.qcloud.la/weapp/lesson',
            url: 'https://104724433.xuanxuanballe.club/weapp/lesson',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              var tab = res.data.data.msg
          
              that.setData({
                tab: tab
              })
        
              var flag=false
              for(var element in tab){
                // console.log(tab[element].openId)
                if(that.data.openId==tab[element].openId){
                  flag=true
                  break
                }
              }
              console.log(flag)

              if(flag==false){
                wx.showModal({
                  title: '警告',
                  content: '用户未经授权或从未登陆过,请联系管理员',
                })
              } else{
                wx.navigateTo({
                  url: '../login/login1?openId='+that.data.openId,
                })
              }

            }
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
          this.setData({ userInfo: res, logged: true })
          util.showSuccess('登录成功')
          console.log(this.data.userInfo)
          this.setData({
            openId: this.data.userInfo.openId
          })
          console.log(this.data.openId)
          var list = JSON.stringify(this.data.userInfo);
          // console.log(list)

        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    }

  },



  // 获取输入账号
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录
  login: function () {

    if (this.data.phone == 'xuanxuan2018' && this.data.password == 'xuanxuan2018') {
      wx.navigateTo({
        url: '/pages/login/login2',
      })
    } else if( this.data.phone == 'yearcard' && this.data.password == 'meiduo2019'){
          wx.navigateTo({
            url: '/pages/login/yearCard',
          })
    } else if (this.data.phone == 'groupbuy' && this.data.password == 'meiduo2019'){
          wx.navigateTo({
            url: '/pages/login/groupBuy',
          })
    } else if (this.data.phone == 'picture' && this.data.password == 'meiduo2019') {
      wx.navigateTo({
        url: '/pages/login/image',
      })
    } else if (this.data.phone == 'video' && this.data.password == 'meiduo2019') {
      wx.navigateTo({
        url: '/pages/login/video',
      })
    } else if (this.data.phone == 'videocard' && this.data.password == 'meiduo2019') {
      wx.navigateTo({
        url: '/pages/login/video_card',
      })
    } else if (this.data.phone == 'aboutme' && this.data.password == 'meiduo2019') {
      wx.navigateTo({
        url: '/pages/login/aboutMe',
      })
    }  else if (this.data.phone.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '请输入用户',
        icon: 'loading',
        duration: 2000
      })
    } else {
      // 这里修改成跳转的页面
      wx.showToast({
        title: '尝试登陆',
        icon: 'loading',
        duration: 3000
      })
      
      var phone=this.data.phone;
      var password=this.data.password;

      console.log(phone);
      console.log(password);
      wx.navigateTo({
        url: '/pages/login/login1?user='+phone+'&pwd='+password,
      })

    }
  }
})