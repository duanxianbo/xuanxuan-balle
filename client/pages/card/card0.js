// pages/card/card0.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId:'',
    image:'',
    name:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: 'https://104724433.xuanxuanballe.club/weapp/video_card',
      // url: 'https://rv647fej.qcloud.la/weapp/video',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var tab = res.data.data.msg
        //  for (var item in tab) {
        //    console.log(tab[item].name)
        that.setData({
          tab: tab
        })
        //  }
      }
    })

    console.log(options.openId)
    console.log(options.image)
    console.log(options.name)
    this.setData({
      openId: options.openId,
      image: options.image,
      name: options.name,
    })


  },


  toVideoSum: function (e) {
    var that = this,
      vid = e.currentTarget.dataset.vid;
    // console.log(vid);
    vid.toString;
    // wx.navigateTo({
    //   url: '/pages/card/card?vid=' + vid + '&openId=' + this.data.openId + '&image=' + this.data.image + '&name='+this.data.name,
    // });
    wx.navigateTo({
      url: '/pages/canlendar/canlendar?vid=' + vid + '&openId=' + this.data.openId + '&image=' + this.data.image + '&name=' + this.data.name,
    });
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