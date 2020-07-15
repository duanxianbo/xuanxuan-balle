
var app = getApp();

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    flag:false,
    userInfo:[],
    contractInfo: {}
  },
  onLoad: function (options) {

  },

  mineContract:function(){
    let that = this
    wx.request({
      url: 'https://104724433.xuanxuanballe.club/weapp/contract_show',
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      data:{
        user: that.data.userInfo.nickName
      },
      success: function (res) {
        console.log(res)

        if(res.data.code < 0){
          util.showModel("查询失败", "请先登录")
        } else{
          var contractInfo = res.data.data.msg
          console.log(contractInfo)
          if (contractInfo.length){
            util.showModel('您已签署合同',"合同信息会尽快发送至您的邮箱")
          }else{
            wx.navigateTo({
              url: '/user/pages/contract/contract?user=' + that.data.userInfo.nickName
            })
            that.setData({
              contractInfo: contractInfo
            })
  
          }  
        }
      }

    })
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
      url: '/user/pages/group/group?openId='+this.data.userInfo.openId
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
      url: '/user/pages/order/order?openId=' + this.data.userInfo.openId
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
      url: '/user/pages/yearCard/yearCard?openId=' + this.data.userInfo.openId
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