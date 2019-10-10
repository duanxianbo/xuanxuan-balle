// pages/login/login2.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myarrary:[],
    tab: [],
    hiddenmodalput: true,
    change_info:[],
    new_class: "",
    user:"",
    passwd:"",
    course:"",
    name:"",
    initial:"",
    openId:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    // console.log(JSON.stringify(options))
    // console.log(Object.keys(options).length)
    if (JSON.stringify(options)=='{}' || options==undefined){
      this.setData({
          openId: 'oBiQ-5U7MRFe6wRTt5ij35A3RNkA'
      })
    }else{
      this.setData({
          openId: options.openId
      })
    }
    console.log(this.data.openId)

     var myarray=new Array(100);
     this.setData({
        myarray:myarray,
     })
    console.log(this.data.myarray.length)

    var that = this
    wx.request({
      // url: 'https://rv647fej.qcloud.la/weapp/lesson',
      url: 'https://104724433.xuanxuanballe.club/weapp/lesson',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var tab = res.data.data.msg
        // console.log(tab)
        that.setData({
          tab: tab
        })  
      }
    })

  },


  getCode1: function (e) {
    var val = e.detail.value;
    this.setData({
      new_class: val
    });

  },  

  add1: function (e) {
    var val = e.detail.value;
    this.setData({
      user: val
    });

  },
  add2: function (e) {
    var val = e.detail.value;
    this.setData({
      passwd:val
    });

  },

  add3: function (e) {
    var val = e.detail.value;
    this.setData({
      name:val
    });

  },

  add4: function (e) {
    var val = e.detail.value;
    this.setData({
      course:val
    });

  },

  addUser:function(e){

    var that=this
    console.log({ user: this.data.user, passwd: this.data.passwd, name: this.data.name, class: this.data.course })
    wx.request({
      url: 'https://104724433.xuanxuanballe.club/weapp/form_add',
      // url: 'https://rv647fej.qcloud.la/weapp/form',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
        //  'Content-Type': 'application/json'
      },

      data: { user: this.data.user, password:this.data.passwd,name:this.data.name,class: this.data.course ,openId:""},

      success: function (res) {
        console.log(res)
        if (res.data.status == 0) {
          wx.showToast({
            title: res.data.info,
            icon: 'loading',
            duration: 1500
          })
        } else {

          wx.showToast({
            title: '提交成功',
            icon: "success",
            duration: 1000,
          })


          if (getCurrentPages().length != 0) {
            //刷新当前页面的数据
            getCurrentPages()[getCurrentPages().length - 1].onLoad()
          }

        }
      }

    })
    this.setData({
      new_class: "",
      user: "",
      passwd: "",
      course: "",
      name: ""
    })

  },


  delUser: function (e) {
    var user = e.target.dataset.name
    var that=this
    wx.request({
      url: 'https://104724433.xuanxuanballe.club/weapp/form_del',
      // url: 'https://rv647fej.qcloud.la/weapp/form',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
        //  'Content-Type': 'application/json'
      },

      data: { user: user},

      success: function (res) {

        console.log(res)
        if (res.data.status == 0) {
          wx.showToast({
            title: res.data.info,
            icon: 'loading',
            duration: 1500
          })
        } else {

          wx.showToast({
            title: '提交成功',
            icon: "success",
            duration: 1000,
          })


          that.onLoad()
          // if (getCurrentPages().length != 0) {
          //   //刷新当前页面的数据
          //   getCurrentPages()[getCurrentPages().length - 1].onLoad()
          // }

        }
      }
    })

  },



  createTable: function (e) {

    var that = this
    var tab=this.data.tab
    var list = JSON.stringify(this.data.tab);
    console.log('tab in table')
    console.log(tab)
    wx.request({
      url: 'https://104724433.xuanxuanballe.club/weapp/table_add',
      // url: 'https://rv647fej.qcloud.la/weapp/form',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
        //  'Content-Type': 'application/json'
      },

      data: { tab:list } ,

      success: function (res) {
        console.log(res)
        if (res.data.status == 0) {
          wx.showToast({
            title: res.data.info,
            icon: 'loading',
            duration: 1500
          })
        } else {

          wx.showToast({
            title: '存档成功',
            icon: "success",
            duration: 1000,
          })


          if (getCurrentPages().length != 0) {
            //刷新当前页面的数据
            getCurrentPages()[getCurrentPages().length - 1].onLoad()
          }

        }
      }

    })
    this.setData({
      new_class: "",
      user: "",
      passwd: "",
      course: "",
      name: ""
    })

  },





  
  
  changeUser: function (e) {

    var user = e.currentTarget.dataset.name 
    var pwd = e.currentTarget.dataset.pwd
    var openId = e.currentTarget.dataset.openid

    console.log('user=' + user)
    console.log('pwd='+pwd)
    console.log('openId=' + openId)

   var that=this
    var val =this.data.new_class
    
    // this.data.change_info.push({ user, val })
   
    // console.log(this.data.change_info)

    wx.request({
      url: 'https://104724433.xuanxuanballe.club/weapp/form_change',
      // url: 'https://rv647fej.qcloud.la/weapp/form',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
        //  'Content-Type': 'application/json'
      },
     
      data: { user: user, class:val },
      success: function (res) {
        console.log(res)
        console.log('res1')
        if (res.data.status == 0) {
          wx.showToast({
            title: res.data.info,
            icon: 'loading',
            duration: 1500
          })
        } else {
    
          wx.showToast({
            title: '提交成功',
            icon: "success",
            duration: 1000,
          })
          if (getCurrentPages().length != 0) {
            //刷新当前页面的数据
            getCurrentPages()[getCurrentPages().length - 1].onLoad()
          }

        }

        console.log('finish 1')
        wx.request({
          url: 'https://wx158a051ad1abcd07.mssnn.cn/v2/api/vpush?id=2',
          method: 'POST',
          dataType: 'json',
          header: {
            'Content-Type': "application/json",
          },
          data: {
            "secret": "a42aa-3d520-7b100-28e2b",
            "path": "pages/login/login1?user="+user+"&pwd="+pwd, 
            // 这里填写管理员的openId
            "openId": openId,
            "data": [
              user,
              val, ]
          },
          success: function (res) {
            console.log(res)
            console.log('res2')
          }
        })



      }
  })
    this.setData({
      new_class: "",
      user: "",
      passwd: "",
      course: "",
      name: "",
      initial: ""
    })
  },
  

  serviceSelection() {
    wx.showToast({
      title: '获取成功',
      icon: 'succes',
      duration: 1000,
      mask: true
    })
  },



comBack:function(){
wx.navigateTo({
  url: '/pages/index/index',
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