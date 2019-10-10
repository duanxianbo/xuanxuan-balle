// pages/video/video1.js

import qqVideo from "../../utils/qqVideo.js"
var part_urls = {};
var videoPage;
var pageArr = new Array()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.vid != undefined) {
      // console.log(options.vid)
      this.setData({
        file_id: options.vid,
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