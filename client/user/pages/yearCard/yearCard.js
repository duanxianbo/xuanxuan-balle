
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    user: [],

  },


  toYear: function (e) {
    var mct_id = e.currentTarget.dataset.id
    var mct_name = e.currentTarget.dataset.mct_name
    var name = e.currentTarget.dataset.name
    var time = e.currentTarget.dataset.time
    var phone = e.currentTarget.dataset.phone
    var price = e.currentTarget.dataset.price
    var number = e.currentTarget.dataset.number
    // console.log(mct_id)
    // console.log(mct_name)
    // console.log(price)
    wx.navigateTo({
      url: '/pages/inform/yearCard?mct_id=' + mct_id + "&mct_name=" + mct_name + "&price=" + price + "&number=" + number + "&time=" + time + "&name=" + name + "&phone=" + phone,
    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openId: options.openId
    })
    console.log(this.data.openId)
    var that = this

    wx.request({
      url: 'https://104724433.xuanxuanballe.club/weapp/get_yearCard',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var tab = res.data.data.msg

        that.setData({
          tab: tab
        })

        // console.log(tab)
        var user = []
        for (var element in tab) {
          if (that.data.openId == tab[element].openId) {
            user.push({ mct_id: tab[element].mct_id, price: tab[element].price, mct_name: tab[element].mct_name, time: tab[element].time,name:tab[element].name,phone:tab[element].phone })
          }
        }
        // console.log(user)
        that.setData({
          user: user
        })
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