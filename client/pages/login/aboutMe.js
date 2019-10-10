// pages/login/login2.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: [],
    hiddenmodalput: true,
    change_info: [],
    new_class: "",
    user: "",
    adult:'',
    kid:'',
    passwd: "",
    course: "",
    name: "",
    price1: '',
    group_num: '',
    price2: '',
    type: '',
    img: '',
    descrp: '',
    URL: '',
    initial: "",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    wx.request({
      // url: 'https://rv647fej.qcloud.la/weapp/lesson',
      url: 'https://104724433.xuanxuanballe.club/weapp/aboutMe',
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
      kid: val
    });

  },
  add2: function (e) {
    var val = e.detail.value;
    this.setData({
      URL: val
    });

  },

  add3: function (e) {
    var val = e.detail.value;
    this.setData({
      adult: val
    });

  },

  add4: function (e) {
    var val = e.detail.value;
    this.setData({
      group_num: val
    });

  },
  add5: function (e) {
    var val = e.detail.value;
    this.setData({
      price2: val
    });

  },


  addUser: function (e) {

    var that = this

    wx.request({
      url: 'https://104724433.xuanxuanballe.club/weapp/addaboutMe',
      // url: 'https://rv647fej.qcloud.la/weapp/form',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
        //  'Content-Type': 'application/json'
      },

      data: { adult: this.data.adult,kid:this.data.kid },

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
    var name = e.target.dataset.name
    var that = this
    wx.request({
      url: 'https://104724433.xuanxuanballe.club/weapp/delaboutMe',
      // url: 'https://rv647fej.qcloud.la/weapp/form',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
        //  'Content-Type': 'application/json'
      },

      data: { adult: name },

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

        }
      }
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



  comBack: function () {
    wx.switchTab({
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