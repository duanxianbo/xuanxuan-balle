Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId:'',
    user:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openId:options.openId
    })
    console.log(this.data.openId)
    var that=this

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

        //  console.log(tab)
        var user = []
        for (var element in tab) {
          if (that.data.openId == tab[element].openId) {
            user.push({mct_id:tab[element].mct_id,price:tab[element].price,mct_name:tab[element].mct_name,number:tab[element].number,name:tab[element].name,phone:tab[element].phone})
          }
        }
      //  console.log(user)
      that.setData({
        user:user
      })
      }
    })

  },

toGroupBuy:function(e){
  var mct_id = e.currentTarget.dataset.id
  var mct_name = e.currentTarget.dataset.mct_name
  var price = e.currentTarget.dataset.price
  var name=e.currentTarget.dataset.name
  var phone= e.currentTarget.dataset.phone
  var number = e.currentTarget.dataset.number
  console.log(name)
  console.log(phone)
  // console.log(mct_id)
  // console.log(mct_name)
  // console.log(price)
  wx.navigateTo({
    url: '/pages/groupBuy/groupBuy_share?mct_id=' + mct_id + "&mct_name=" + mct_name + "&price=" + price+"&number="+number+"&name="+name+"&phone="+phone,
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