// pages/card/card.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var app = getApp();


import qqVideo from "../../utils/qqVideo.js"
var part_urls = {};
var videoPage;
var pageArr = new Array()



Page({

  /**
   * 页面的初始数据
   */
  data: {
    time_flag:false,
    timer:'',
    countDownNum: '60',
    duration:0,
    flag:true,
    active:true,
    day:[],
    tab:[],
    openId:'',
    tag:'点击登录',
    userInfo: [], 
    logged: '',
    trigger:false,
    vid:'',
    name:'',
    image: "/pages/images/logo.png",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  

    if (options.vid != undefined) {
       console.log(options.vid)
      this.setData({
        vid: options.vid,
      });
    } else {
      wx.showToast({
        title: '未传入视频id',
      })
    }

    videoPage = 1;
    pageArr = new Array();
    part_urls = {};
    var that = this;
    const vid = options.vid;
    // const vid2 = options.vid2;
    // console.log(vid);
    qqVideo.getVideoes(vid).then(function (response) {

      that.setData({
        videUrl: response[0],
      });
    })




    var that=this
    console.log('openid1=',options.openId) 
    console.log(options.image) 
    console.log(options.name) 
    this.setData({
      openId:options.openId,
      image:options.image,
      name: options.name,
      trigger: true,
    })

    //next
    wx.request({
      url: 'https://104724433.xuanxuanballe.club/weapp/read_day',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {

        var tab = res.data.data.msg
        console.log('output tab')
        console.log(tab)
        var day = []
        var duration = []
        for (var element in tab) {
          console.log('vid=',options.vid)
          // console.log('tab=', tab[element])
          // console.log(tab[element].day)
          // console.log(that.data.openId)
          if(tab[element].vid== options.vid){
              if (tab[element].openId == that.data.openId) {
                day.push(tab[element].day)
                duration.push(tab[element].duration)
              }
          }
        }
        that.setData({
          day: day,
        })


        var myDate = new Date()
        var today = myDate.toLocaleDateString()
        var today1 = new Date(today)

        console.log('today=',today)

        var oldDate = myDate - 1000 * 60 * 60 * 24
        // console.log(oldDate)

        var yesterday = new Date(oldDate).toLocaleDateString()
        console.log('yesterday=',yesterday)

        for (var i in day) {
          // console.log(day[i])
          if (day[i] == yesterday) {
            that.setData({
              duration: duration[i]
            })
          }
        }

        for (var i in day) {
          if (day[i] == today) {
            that.setData({
              duration: duration[i],
              flag: false,

            })
          }
        }




      }
    })

  },

tap:function(){
  this.setData({
    tag: '已登录',
  })

},


  // 获取授权用户信息
  btn_sub: function (res) {
    var that = this

    util.showBusy('正在登录')

    const session = qcloud.Session.get()

    if (session) {
      qcloud.loginWithCode({
        success: res => {
          this.setData({ userInfo: res, logged: true })
          util.showSuccess('登录成功')
          console.log(this.data.userInfo)
          this.setData({
            // image: this.data.userInfo.avatarUrl,
            // name: this.data.userInfo.nickName,
            // openId: this.data.userInfo.openId,
            trigger:true,
          })
          app.globalData.openId = this.data.userInfo.openId;
          console.log(this.data.openId)
          console.log(app.globalData.openId)
         
         //next
          wx.request({
            url: 'https://104724433.xuanxuanballe.club/weapp/read_day',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            success: function (res) {

              var tab = res.data.data.msg
               console.log(tab)
              var day = []
              var duration=[]
              for (var element in tab) {
                // console.log('tab=', tab[element])
                // console.log(tab[element].day)
                // console.log(that.data.openId)
                if (tab[element].openId == that.data.openId) {
                  day.push(tab[element].day)
                  duration.push(tab[element].duration)
                }
              }
              that.setData({
                day: day,
              })


              var myDate = new Date()
              var today = myDate.toLocaleDateString()
              var today1 = new Date(today)

              //  console.log(today)

              var oldDate = myDate-1000 * 60 * 60 * 24
              // console.log(oldDate)

              var yesterday = new Date(oldDate).toLocaleDateString()
              console.log(yesterday)

              for(var i in day){
                // console.log(day[i])
                if(day[i]==yesterday){
                  that.setData({
                    duration:duration[i]
                  })
                }
              }

              for (var i in day) {
                if (day[i] == today) {
                  that.setData({
                    duration: duration[i],
                    flag:false,
                  
                  })
                }
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
   
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    }

  },



changeDate:function(){
  var that = this

if(this.data.time_flag==false){
  wx.showToast({
    title: '请先学习完课程！',
    icon: 'loading'
  })
}else{
if(this.data.trigger==false){
  wx.showToast({
    title: '请先登录！',
    icon: 'loading'
  })
}else{

        if (that.data.flag == true) {
          that.setData({
            flag: false
          })
     



          wx.request({
            // url: 'https://rv647fej.qcloud.la/weapp/lesson',
            url: 'https://104724433.xuanxuanballe.club/weapp/read_day',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              var tab = res.data.data.msg
              console.log('tab=', tab)
              that.setData({
                tab: tab
              })
            }
          });

          for (element in this.data.tab) {
            console.log(element.day)
          }



          var myDate = new Date()

          // console.log(myDate.toLocaleDateString())
          var day1 = myDate.toLocaleDateString()
          console.log(day1)
          var today = new Date(day1)

          that.setData({
            duration: that.data.duration + 1
          })

          wx.request({
            url: 'https://104724433.xuanxuanballe.club/weapp/add_day',
            // url: 'https://rv647fej.qcloud.la/weapp/form',
            method: "POST",
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
              //  'Content-Type': 'application/json'
            },

            data: { vid:that.data.vid, day: day1, openId: that.data.openId, duration: that.data.duration },

            success: function (res) {
              console.log(res)
            },
            fail:function(res){
              console.log(res)
            }
          })


        }// if flag


      }//if trigger
}//if time_flag







//   if(that.data.flag==true){
//     that.setData({
//       flag:false
//     })
//     var that=this
  
//   wx.request({
//     // url: 'https://rv647fej.qcloud.la/weapp/lesson',
//     url: 'https://104724433.xuanxuanballe.club/weapp/read_day',
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     success: function (res) {
//       var tab = res.data.data.msg
//       that.setData({
//         tab: tab
//       })
//       // console.log(tab)

//     }
//   });

//   for (element in that.data.tab) {
//     console.log(element.day)
//   }



//   var myDate = new Date()

//   // console.log(myDate.toLocaleDateString())
//   var day1 = myDate.toLocaleDateString()
//   console.log(day1)
//   var today = new Date(day1)

//   that.setData({
//     duration:that.data.duration+1
//   })

//   wx.request({
//     url: 'https://104724433.xuanxuanballe.club/weapp/add_day',
//     // url: 'https://rv647fej.qcloud.la/weapp/form',
//     method: "POST",
//     header: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//       //  'Content-Type': 'application/json'
//     },

//     data: { day: day1, openId:that.data.openId,duration:that.data.duration },

//     success: function (res) {
//       console.log(res)
//     }
//   })


// }// if flag

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
    this.countDown();

  },

  countDown: function () {
    let that = this;
    let countDownNum = that.data.countDownNum;//获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setData({
          countDownNum: countDownNum
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum == 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timer);
          that.setData({
            time_flag:true
          })
          //关闭定时器之后，可作其他处理codes go here
        }
      }, 1000)
    })
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
   // let pages = getCurrentPages().length - 2;
  //  var pages='/pages/vip/vip'
  //   console.log('需要销毁的页面：' + pages);
  //   wx.navigateBack({
  //     delta: pages
  //   })
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