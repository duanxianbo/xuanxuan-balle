// pages/canlendar/canlendar.js
//打卡日历页面
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
    objectId: '',
    days: [],
    day:[],
    signUp: [],
    cur_year: 0,
    cur_month: 0,
    count: 0,
        time_flag: false,
    timer: '',
    countDownNum: '120',
    duration: 0,
    flag: true,
    active: true,
    day: [],
    tab: [],
    openId: '',
    tag: '点击登录',
    userInfo: [],
    logged: '',
    trigger: false,
    vid: '',
    name: '',
    image: "/pages/images/name.png",
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




    var that = this
    console.log(options.openId)
    console.log(options.image)
    console.log(options.name)
    this.setData({
      openId: options.openId,
      image: options.image,
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
        console.log(tab)
        var day = []
        var duration = []
        for (var element in tab) {
          console.log('vid=',options.vid)
          // console.log('tab=', tab[element])
          // console.log(tab[element].day)
          // console.log(that.data.openId)
          if (tab[element].vid == options.vid) {
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

        //  console.log(today)

        var oldDate = myDate - 1000 * 60 * 60 * 24
        // console.log(oldDate)

        var yesterday = new Date(oldDate).toLocaleDateString()
        console.log('yesterday=',yesterday)

        for (var i in day) {
           console.log('day_i=',day[i])
          if (day[i] == yesterday) {
            console.log('day=',day[i],'yesterday',yesterday)
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


    // this.setData({ objectId: options.objectId });
    //获取当前年月  
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    //获取当前用户当前任务的签到状态
    this.onGetSignUp();
    this.setData({
      cur_year,
      cur_month,
      weeks_ch
    })

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



  tap: function () {
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
            trigger: true,
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
              var duration = []
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

              var oldDate = myDate - 1000 * 60 * 60 * 24
              // console.log(oldDate)

              var yesterday = new Date(oldDate).toLocaleDateString()
              console.log(yesterday)

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



  changeDate: function () {
    var that = this

    if (this.data.time_flag == false) {
      wx.showToast({
        title: '请先学习完课程！',
        icon: 'loading'
      })
    } else {
      if (this.data.trigger == false) {
        wx.showToast({
          title: '请先登录！',
          icon: 'loading'
        })
      } else {

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

            data: { vid: that.data.vid, day: day1, openId: that.data.openId, duration: that.data.duration },

            success: function (res) {
              console.log(res)
            },
            fail: function (res) {
              console.log(res)
            }
          })


        }// if flag


      }//if trigger
    }//if time_flag


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
            time_flag: true
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

  },
  // 获取当月共多少天
  getThisMonthDays: function (year, month) {
    return new Date(year, month, 0).getDate()
  },

  // 获取当月第一天星期几
  getFirstDayOfWeek: function (year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },

  // 计算当月1号前空了几个格子，把它填充在days数组的前面
  calculateEmptyGrids: function (year, month) {
    var that = this;
    //计算每个月时要清零
    that.setData({ days: [] });
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        var obj = {
          date: null,
          isSign: false
        }
        that.data.days.push(obj);
      }
      this.setData({
        days: that.data.days
      });
      //清空
    } else {
      this.setData({
        days: []
      });
    }
  },

  // 绘制当月天数占的格子，并把它放到days数组中
  calculateDays: function (year, month) {
    var that = this;
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      var obj = {
        date: i,
        isSign: false
      }
      that.data.days.push(obj);
    }
    this.setData({
      days: that.data.days
    });
  },

  //匹配判断当月与当月哪些日子签到打卡
  onJudgeSign: function () {

  var that=this


    //net
   wx.request({
      url: 'https://104724433.xuanxuanballe.club/weapp/read_day',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {

        var vid =that.data.vid;
        var tab = res.data.data.msg
        var day = []
        var duration = []

        for (var element in tab) {
          if (tab[element].vid == vid) {
            if (tab[element].openId == that.data.openId) {
              day.push(tab[element].day)
              duration.push(tab[element].duration)
            }
          }
        }
        that.setData({
          signUp: day,
          // duration: duration[duration.length - 1]
        })

        var signs = that.data.signUp;
        console.log(signs)
        var daysArr = that.data.days;
        console.log(daysArr)

        var myDate = new Date();
        var year= myDate.getFullYear(); 
        var month= myDate.getMonth()+1; 
  

        for(var j=0; j< day.length;j++){
          var parse_day = Date.parse(day[j])
          var newDate=new Date(parse_day)
          var new_year = newDate.getFullYear();
          var new_month = newDate.getMonth() + 1; 
          var new_day = newDate.getDate() ; 
          
          console.log(j,day[j])
          if(year==new_year && month == new_month ){
            console.log(new_day)
            for (var i = 0; i < daysArr.length;i++){
                    var current = daysArr[i].date;     
                    if(current == new_day){
                        daysArr[i].isSign = true;
                    }
                }
          }
        }
        that.setData({ days: daysArr });

      }
    })

    
  },

  // 切换控制年月，上一个月，下一个月
  handleCalendar: function (e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
      this.calculateEmptyGrids(newYear, newMonth);
      this.calculateDays(newYear, newMonth);
      this.onGetSignUp();
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
      this.calculateEmptyGrids(newYear, newMonth);
      this.calculateDays(newYear, newMonth);
      this.onGetSignUp();
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  },

  //获取当前用户该任务的签到数组
  onGetSignUp: function () {
     var that = this;
    // var Task_User = Bmob.Object.extend("task_user");
    // var q = new Bmob.Query(Task_User);
    // q.get(that.data.objectId, {
    //   success: function (result) {
    //     that.setData({
    //       signUp: result.get("signUp"),
    //       count: result.get("score")
    //     });
    //     //获取后就判断签到情况
         that.onJudgeSign();
    //   },
    //   error: function (object, error) {
    //   }
    // });
  }
})
