
var app = getApp();

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    flag:false,
    userInfo:[],
  },
  onLoad: function (options) {

  },
  onShow: function () {

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
          this.setData({ userInfo: res, logged: true, flag: true })
          util.showSuccess('登录成功')
          console.log(this.data.userInfo)

        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    } else {
      qcloud.login({
        success: res => {
          this.setData({ userInfo: res, logged: true, flag: true })
          util.showSuccess('登录成功')
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    }

  },






  mineGroup: function (e) {
    if(this.data.flag==true){
    wx.navigateTo({
      url: '/pages/mine/group?openId='+this.data.userInfo.openId
    })
    }else{
      wx.showModal({
        title: '用户未登录',
        content: '请点击登录',
      })
    }
  },
  mineOrder: function (e) {
    if (this.data.flag == true) {
    wx.navigateTo({
      url: '/pages/mine/order?openId=' + this.data.userInfo.openId
    })
    } else {
      wx.showModal({
        title: '用户未登录',
        content: '请点击登录',
      })
    }
  },
  mineYearCard: function (e) {
    if (this.data.flag == true) {
    wx.navigateTo({
      url: '/pages/mine/yearCard?openId=' + this.data.userInfo.openId
    })
    }else{
      wx.showModal({
        title: '用户未登录',
        content: '请点击登录',
      })
    }
  },
  showAddress: function (e) {
    // console.log(e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '/pages/mine/address/list/list'
    })
  },
  showFlow: function (e) {
    wx.navigateTo({
      url: '/pages/mine/flow/flow'
    })
  },
  showService: function (e) {
    wx.navigateTo({
      url: '/pages/mine/service/service'
    })
  }
})