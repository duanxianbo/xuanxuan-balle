var app = getApp();
var qcloud = require('../../vendor/wafer2-client-sdk/index')
// var config = require('../../config')
// var util = require('../../utils/util.js')
// var server = require('../../utils/server');
Page({
  data: {
    userInfo: {},
    logged: false,
    shopId: '',
    goods: [],
    goods_id: [],
    cart: {
      count: 0,
      total: 0,
      list: {}
    },
    showCartDetail: false
  },

toPay:function(e){
  var price = e.currentTarget.dataset.price
  var list= e.currentTarget.dataset.cart
  // console.log(list)
  var list_name=''
  for(var key in list){
    console.log('key=',key)
    list_name=list_name+this.data.goods[key].name+','
  }
  // console.log(list_name)
  // console.log(price)
  if(price>0){
        wx.navigateTo({
          url: '/pages/pay/pay_yearCard?price='+price+"&name="+list_name,
        })
  }else{
    wx.showModal({
      title: '未购买',
      content: '请选择购买的商品',
    })
  }
},

  onLoad: function (options) {
    // var shopId = options.id;
    // this.setData({
    //   shopId: shopId
    // })

    var that = this;

    wx.request({
      url: 'https://104724433.xuanxuanballe.club/weapp/yearCard',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var shops = res.data.data.msg
        console.log('shops=', shops)

        var goods = []
        var goods_id = []
        for (var i in shops) {
      
            goods.push({ name: shops[i].name, price: shops[i].price, pic: shops[i].pic, descrp: shops[i].descrp ,image:shops[i].image})
          
        }

        that.setData({
          goods_id: goods_id,
          goods: goods
        })
      }
    })


  },
  onShow: function () {
  },

  tapAddCart: function (e) {
    console.log('id=', e.target.dataset.bindex)
     this.addCart(e.target.dataset.bindex);

  },
  tapReduceCart: function (e) {
    this.reduceCart(e.target.dataset.id);
  },
  addCart: function (id) {
    var num = this.data.cart.list[id] || 0;
    this.data.cart.list[id] = num + 1;
    this.countCart();
  },
  reduceCart: function (id) {
    var num = this.data.cart.list[id] || 0;
    if (num <= 1) {
      delete this.data.cart.list[id];
    } else {
      this.data.cart.list[id] = num - 1;
    }
    this.countCart();
  },
  countCart: function () {
    var count = 0,
      total = 0;
    for (var id in this.data.cart.list) {
      var goods = this.data.goods[id];
      count += this.data.cart.list[id];
      total += goods.price * this.data.cart.list[id];
    }
    this.data.cart.count = count;
    this.data.cart.total = total;
    this.setData({
      cart: this.data.cart
    });
  },
  follow: function () {
    this.setData({
      followed: !this.data.followed
    });
  },
  onGoodsScroll: function (e) {
    if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
      this.setData({
        scrollDown: true
      });
    } else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
      this.setData({
        scrollDown: false
      });
    }

    var scale = e.detail.scrollWidth / 570,
      scrollTop = e.detail.scrollTop / scale,
      h = 0,
      classifySeleted,
      len = this.data.goodsList.length;
    this.data.goodsList.forEach(function (classify, i) {
      var _h = 70 + classify.goods.length * (46 * 3 + 20 * 2);
      if (scrollTop >= h - 100 / scale) {
        classifySeleted = classify.id;
      }
      h += _h;
    });
    this.setData({
      classifySeleted: classifySeleted
    });
  },
  tapClassify: function (e) {
    var id = e.target.dataset.id;
    this.setData({
      classifyViewed: id
    });
    var self = this;
    setTimeout(function () {
      self.setData({
        classifySeleted: id
      });
    }, 100);
  },


  showCartDetail: function () {
    console.log(this.data.goods)
    this.setData({
      showCartDetail: !this.data.showCartDetail
    });
  },
  hideCartDetail: function () {
    this.setData({
      showCartDetail: false
    });
  },


  bindGetUserInfo: function () {
    if (this.data.logged) {
      console.log('userInfo')
      console.log(this.data.userInfo)
      var list = JSON.stringify(this.data.userInfo);
      wx.navigateTo({
        url: '/page/print/upload?list=' + list,
      })
    }


    util.showBusy('正在登录')

    const session = qcloud.Session.get()

    if (session) {
      console.log('session')
      qcloud.loginWithCode({
        success: res => {
          console.log('qcloud in')
          this.setData({ userInfo: res, logged: true })
          util.showSuccess('登录成功')
          console.log(this.data.userInfo)
          var list = JSON.stringify(this.data.cart.list);
          var userInfo = JSON.stringify(this.data.userInfo);
          console.log(list)
          console.log(userInfo)

          if (this.data.cart.total == 0 || this.data.cart.count == 0) {
            wx.showToast({
              title: '请选择菜品',
              icon: 'loading',
              duration: 2000
            })
          } else {
            var total = this.data.cart.total;
            var count = this.data.cart.count;

            console.log(total);
            console.log(count);
            wx.navigateTo({
              url: "/page/count/count?list=" + list + 'useInfo=' + userInfo,
            })
          }

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
          var list = JSON.stringify(this.data.userInfo);
          console.log(list)
          wx.navigateTo({
            url: '/page/print/upload?list=' + list,
          })
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    }
  },




  // 登录
  login: function () {
    if (this.data.cart.total == 0 || this.data.cart.count == 0) {
      wx.showToast({
        title: '请选择菜品',
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

      var total = this.data.cart.total;
      var count = this.data.cart.count;

      console.log(total);
      console.log(count);

      console.log("下单商品")
      console.log(this.data.cart.list)
      var list = JSON.stringify(this.data.cart.list);
      console.log(list)
      wx.navigateTo({
        url: "/page/count/count?list=" + list,
      })
    }
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
  },


});

