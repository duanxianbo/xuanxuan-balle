
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    txtOrderCode: '',
    openId: '',
    flag: false,
    mem_flag:true,
    userInfo: [],
    mct_name:'',
    name:'',
    phone:'',
    mct_id: "",
    mct_id2: "",
    tab:[],
    hidden: true,           // loading动画是否显示
    tipShow: false,         // 判断是否还有更多数据
    page: 0,                // 当前分页
    nextPage: "",           // 分页信息
    user:[],
    us: "",                 // 用户分享的ID，之前为了做分享统计什么的，现在没卵用
    lists: { goodsImg: 'http://img5.imgtn.bdimg.com/it/u=85405917,2332675820&fm=11&gp=0.jpg', goodsTitle: '测试1'},
    groupSize: 1, 
    SumGroup: '',
  },

  onReady: function () {

  },

  onLoad: function (options) {
    var that=this
    console.log(options.mct_id)
    console.log(options.mct_name)
    console.log(options.number)
    console.log(options.price)
    this.setData({
       mct_id: options.mct_id,
       mct_name:options.mct_name,
       SumGroup:options.number,
       name:options.name,
       phone:options.phone
    })
    this.setData({
      txtOrderCode: options.price
    })

    wx.request({  
      url: 'https://104724433.xuanxuanballe.club/weapp/get_groupBuy',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var tab = res.data.data.msg

        that.setData({
          tab: tab
        })

        var user=[]
        for (var element in tab) { 
          if (that.data.mct_id == tab[element].mct_id) {
                 user.push(tab[element].image)
              }
          }

          var groupSize=user.length
 

        that.setData({
          groupSize: groupSize,
          user: user
        })

          if(groupSize >= that.data.SumGroup){
            that.setData({
                mem_flag:false
            })

            console.log(that.data.mem_flag)
            // var str = user.map((item) => item).join(",")
            
          }

      }
    })



  },

  toPurchase:function(){
    wx.switchTab({
      url: '/pages/mine/mine',
    })
  },

  pay: function () {
    var ordercode = this.data.txtOrderCode;
    var openId = this.data.userInfo.openId;
    var that = this

    if (this.data.flag == true) {
      wx.login({
        success: function (res) {
          // console.log(res)
          // console.log(that.data.userInfo.openId)
          // console.log(that.data.mct_id)
          // console.log(ordercode)

          if (res.code) {
            wx.request({
              url: 'https://104724433.xuanxuanballe.club/weapp/wxpay',
              data: {
                openId: that.data.userInfo.openId,
                mct_id: that.data.mct_id2,
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
                    console.log('succuss');
                    console.log(res);
                    wx.request({
                      url: 'https://104724433.xuanxuanballe.club/weapp/order_groupBuy',
                      // url: 'https://rv647fej.qcloud.la/weapp/form',
                      method: "POST",
                      header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                        //  'Content-Type': 'application/json'
                      },

                      data: { openId: that.data.userInfo.openId, mct_id: that.data.mct_id, price: that.data.txtOrderCode, image: that.data.userInfo.avatarUrl, mct_name: that.data.mct_name, number: that.data.SumGroup,name:that.data.name,phone:that.data.phone},

                      success: function (res) {
                        console.log(res)
                      }
                    })

                    wx.showModal({
                      title: '支付成功',
                      content: '请前往我的团购中查看订单',
                    })
                    wx.navigateTo({
                      url: '/pages/groupBuy/groupBuy_share?mct_id=' + that.data.mct_id + "&price=" + that.data.txtOrderCode + "&mct_name=" + that.data.mct_name + '&number=' + that.data.SumGroup+"&name="+that.data.name+"&phone="+that.data.phone,
                    })
                  },
                  fail: function (res) {
                    // fail
                    console.log(res);
                    // that.data.lists.user.push({ name: this.data.userInfo.nickName, userImg: avatarUrl })
                  },
                  complete: function (res) {
                    // complete
                    console.log('complete');
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

    } else {
      wx.showModal({
        title: '请先登录',
        content: '请点击登录按钮进行登录',
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
          this.setData({ userInfo: res, logged: true, flag: true })
          util.showSuccess('登录成功')
          // console.log(this.data)
          var myDate = new Date()
          var mct_id = res.openId + myDate.getTime().toString()
          var mct_id2 = mct_id.substring(mct_id.length - 32)
          console.log(mct_id2)
          this.setData({
            mct_id2: mct_id2
          })
          console.log(res)

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
          // console.log(this.data)
          var myDate = new Date()
          var mct_id = res.openId + myDate.getTime().toString()
          var mct_id2 = mct_id.substring(mct_id.length - 32)
          console.log(mct_id2)
          this.setData({
            mct_id2: mct_id2
          })

        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    }

  },



  onShareAppMessage: function (options) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "团购课程",        // 默认是小程序的名称(可以写slogan等)
      path: '/pages/groupBuy/groupBuy_share?mct_id=' + that.data.mct_id + "&mct_name=" + that.data.mct_name + "&number=" + that.data.SumGroup + "&name=" + that.data.name + "&phone=" + that.data.phone, // 相对的路径
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
    };

    console.log('type=', options.from)
    // 来自页面内的按钮的转发
    if (options.from == 'button') {
      // 此处可以修改 shareObj 中的内容
      if (that.data.flag == true) {
        shareObj.path = '/pages/groupBuy/groupBuy_share?mct_id=' + that.data.mct_id + "&mct_name=" + that.data.mct_name + "&price=" + that.data.txtOrderCode + "&number=" + that.data.SumGroup + "&name=" + that.data.name + "&phone=" + that.data.phone;
      } else {
        shareObj.path = '/pages/groupBuy/groupBuy';
      }
    　　} else {
      // 此处可以修改 shareObj 中的内容
      if (that.data.flag == true) {
        shareObj.path = '/pages/groupBuy/groupBuy_share?mct_id=' + that.data.mct_id + "&mct_name=" + that.data.mct_name + "&price=" + that.data.txtOrderCode + "&number=" + that.data.SumGroup + "&name=" + that.data.name + "&phone=" + that.data.phone;
      } else {
        shareObj.path = '/pages/groupBuy/groupBuy';
      }
    }

    console.log(this.data.flag)
    // 返回shareObj
    if (this.data.flag == true) {
      return shareObj;
    } else {
      wx.showModal({
        title: '请先登录',
        content: '请点击登录按钮进行登录',
      })
    }

  }

})



