// pages/login/login1.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: [],
    name:[],
    xueshi:[],
    isChecked: false,
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    openId: '',
    user:'',


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('user='+options.user);
    console.log('pwd='+options.pwd);
    console.log('openId=' + options.openId);
    this.setData({
      user:options.user,
      openId:options.openId

    })


    var that = this
    wx.request({
      // url: 'https://rv647fej.qcloud.la/weapp/lesson',
      url: 'https://104724433.xuanxuanballe.club/weapp/lesson',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var tab = res.data.data.msg
        // console.log(tab)
        that.setData({
          tab: tab
        }) 
        var index = -1;

        for (var i in tab) {
          if (options.user == tab[i].user && options.pwd ==tab[i].password || options.openId==tab[i].openId) {
            console.log(i)
            index=i
          }
        }

        if(index !=-1){
          var name=[];
          name.push(tab[index].name)  
          that.setData({
            name:name
          })  
          var xueshi = [];
          xueshi.push(tab[index].class)
          that.setData({
            xueshi: xueshi
          })

          console.log(xueshi)


        }else{
          wx.showModal({
          title: '账号或密码错误',
          content:'请重新输入',
          showCancel:false,
            success: function (res) {
              if (res.cancel) {
                //点击取消,默认隐藏弹框
              } else {
                //点击确定
               wx.navigateBack({
                
               })
              }
            },
            fail: function (res) { },//接口调用失败的回调函数
            complete: function (res) { },//接口调用结束的回调函数（

      });
 
        }

      }
    })




  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
 
  },


  serviceSelection() {
    this.setData({
      isChecked: true
    })
    console.log(this.data.isChecked)
    wx.showToast({
      title: '获取成功',
      icon: 'succes',
      duration: 1000,
      mask: true
    })
  },


  bindGetUserInfo: function () {
    var that = this
    if (this.data.logged) return

    util.showBusy('正在登录')

    const session = qcloud.Session.get()

    if (session) {
      qcloud.loginWithCode({
        success: res => {
          this.setData({ userInfo: res, logged: true })
          util.showSuccess('登录成功')
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
            url: 'https://104724433.xuanxuanballe.club/weapp/openId_add',
            // url: 'https://rv647fej.qcloud.la/weapp/form',
            method: "POST",
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
              //  'Content-Type': 'application/json'
            },

            data: { user: this.data.user, openId: this.data.openId },

            success: function (res) {
              console.log(res)
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

          wx.request({
            url: 'https://104724433.xuanxuanballe.club/weapp/openId_add',
            // url: 'https://rv647fej.qcloud.la/weapp/form',
            method: "POST",
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
              //  'Content-Type': 'application/json'
            },

            data: { user: this.data.user, openId: this.data.openId },

            success: function (res) {
              console.log(res)
            }
          })


        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    }
  },







  Back: function () {
    console.log("Back")
    // wx.navigateTo({
    //   url: '../index/index',
    // })
    wx.navigateBack({
      
    })
  },


  card: function () {
    wx.navigateTo({
      url: '/pages/card/card?openId='+this.data.openId,
    })
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