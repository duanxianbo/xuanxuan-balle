
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    txtOrderCode: '',
    openId: '',
    flag: false,
    mem_flag: true,
    userInfo: [],
    mct_name: '',
    mct_id: "",
    name:'',
    phone:'',
    time:'',
    mct_id2: "",
    tab: [],
    hidden: true,           // loading动画是否显示
    tipShow: false,         // 判断是否还有更多数据
    page: 0,                // 当前分页
    nextPage: "",           // 分页信息
    user: [],
    us: "",                 // 用户分享的ID，之前为了做分享统计什么的，现在没卵用
    lists: { goodsImg: 'http://img5.imgtn.bdimg.com/it/u=85405917,2332675820&fm=11&gp=0.jpg', goodsTitle: '测试1' },
    groupSize: 1,
    SumGroup: '',
  },

  onReady: function () {

  },

  onLoad: function (options) {
    var that = this
    this.setData({
      mct_id: options.mct_id,
      mct_name: options.mct_name,
      time:options.time,
      name:options.name,
      phone:options.phone,
    })
    this.setData({
      txtOrderCode: options.price
    })


  },

  toPurchase: function () {
    wx.switchTab({
      url: '/pages/mine/mine',
    })
  },


})



