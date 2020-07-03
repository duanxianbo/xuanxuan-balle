//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var vPush = require('/vpush-pro-sdk/vpush.pro.js');

App({
  globalData: { 
    openId: '', //自定义
  },
  vPush: new vPush('wx158a051ad1abcd07'),
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl);
        wx.cloud.init({

          traceUser: true,
    
      });
    },

    onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }
  
})

