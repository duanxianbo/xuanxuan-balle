// pages/class/class.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
      tab:[]
  
  },

  /**
   * 生命周期函数--监听页面加载
   */

  //建立连接
  onLoad: function (options) {
    var that=this
    wx.request({
      // url: 'https://rv647fej.qcloud.la/weapp/lesson',
      url: 'https://104724433.xuanxuanballe.club/weapp/lesson',
      
      method:'GET',
      headers:{
        'Content-Type':'application/json'
      },
      success:function(res){
         var tab = res.data.data.msg
        //  for (var item in tab) {
        //    console.log(tab[item].name)
          that.setData({
             tab:tab
          })
        //  }
      } 
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