// pages/vip/vip.js
var app = getApp();

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')



Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    tag: '点击登录',
    userInfo: [],
    logged: false,
    trigger: false,
    name: '',
    image: "/pages/images/logo.png",
 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  toClass: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },


  toCard: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/card/card'
    });
  },




  // 获取授权用户信息
  btn_sub: function (res) {
    var that = this
    if (this.data.logged){
      wx.navigateTo({
        url: '/pages/card/card0?openId=' + this.data.openId + '&image=' + this.data.image + '&name=' + this.data.name,
      });
    } else{
    
    util.showBusy('正在登录')

    const session = qcloud.Session.get()

    if (session) {
      qcloud.loginWithCode({
        success: res => {
          
          this.setData({ userInfo: res, logged: true })
          util.showSuccess('登录成功')
          console.log(this.data.userInfo)
          this.setData({
            image: this.data.userInfo.avatarUrl,
            name: this.data.userInfo.nickName,
            openId: this.data.userInfo.openId,
            trigger: true,
          })
          console.log(this.data.openId)
          console.log(app.globalData.openId)

          wx.navigateTo({
            url: '/pages/card/card0?openId=' + this.data.openId + '&image=' + this.data.image + '&name='+this.data.name,
          });

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

          wx.navigateTo({
            url: '/pages/card/card0?openId=' + this.data.openId + '&image=' + this.data.image + '&name=' + this.data.name,
          });


        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    }
    }

  },







  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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