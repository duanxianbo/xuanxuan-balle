var app = getApp();
var qcloud = require('../../vendor/wafer2-client-sdk/index')
// var config = require('../../config')
// var util = require('../../utils/util.js')
// var server = require('../../utils/server');
Page({
  data: {
    userInfo: {},
    logged: false,
    shopId:'',
    goods: [],
    goods_id:[],
    cart: {
      count: 0,
      total: 0,
      list: {}
    },
    showCartDetail: false
  },

  onLoad: function (options) {

    var that = this;

    wx.request({
      url: 'https://104724433.xuanxuanballe.club/weapp/group_buy',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log('test')
        var shops = res.data.data.msg
        console.log('shops=',shops)

        var goods=[]
        var goods_id=[]
        for(var i in shops){
            goods.push({ name: shops[i].name, price: shops[i].price, price2: shops[i].price2, group_num: shops[i].group_num, descrp: shops[i].descrp,image:shops[i].image})
          
        }
  
        that.setData({
          goods_id:goods_id,
          goods: goods
        })
      }
    })


  },
  onShow: function () {
  },
 
toPay:function(e){
  var id = e.currentTarget.dataset.id
  console.log("test")
  console.log(id)
  console.log(this.data.goods[id])
  wx.navigateTo({
    url: '/pages/pay/pay_single?price='+this.data.goods[id].price+"&name="+this.data.goods[id].name,
  })
},

toGroupBuy:function(e){
  var id = e.currentTarget.dataset.id
  var name = e.currentTarget.dataset.name
  var number = e.currentTarget.dataset.number
  console.log(id)
  console.log(name)
  wx.navigateTo({
    url: '/pages/groupBuy/groupBuy?price=' + id + "&name=" + name + "&number=" + number,
  })
},

  toCount: function (e) {
    console.log("下单商品")
    console.log(this.data.cart.list)
    var list = JSON.stringify(this.data.cart.list);
    console.log(list)
    wx.navigateTo({
      url: "/page/count/count?list=" + list,
    })
  },


  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
  },


});

