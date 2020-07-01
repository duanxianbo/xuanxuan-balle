// pages/video/video.js
// import qqVideo from "../..//utils/qqVideo.js"
// var part_urls = {};
// var videoPage;
// var pageArr = new Array()


// const txvContext = requirePlugin("tencentvideo");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: []

  },


  //建立连接
  onLoad: function (options) {
    var that = this
    wx.request({
      url: 'https://104724433.xuanxuanballe.club/weapp/video',
      // url: 'https://rv647fej.qcloud.la/weapp/video',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var tab = res.data.data.msg
        console.log(tab)
        //  for (var item in tab) {
        //    console.log(tab[item].name)
        that.setData({
          tab: tab
        })
        //  }
      }
    })
  },

  toVideoSum: function (e) {
    var that = this,
    vid = e.currentTarget.dataset.vid;
    // console.log(vid);
    vid.toString;
    wx.navigateTo({
      url: '/pages/video/video1?vid='+vid
    });
  },



  onReady: function () {
    // 页面渲染完成
    // this.videoContext = wx.createVideoContext('myVideo')
    // this.videoContext2 = wx.createVideoContext('myVideo2')
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
