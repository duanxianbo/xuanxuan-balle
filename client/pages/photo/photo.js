// pages/index/index.js
let col1H = 0;
let col2H = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    pictures: []
  },


  previewImage: function (event) {
    var that = this,
      index = event.currentTarget.dataset.index,
      picture = this.data.pictures;
      var pictures=[]
      for (var i in picture){ 
          pictures.push(picture[i].URL)  
      }     
    // console.log(1)
    // console.log(picture[0].URL)
    // console.log(pictures)
    wx.previewImage({
      current: picture[index].URL,
      urls: pictures,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.id
    var that = this
    wx.request({
      // url: 'https://rv647fej.qcloud.la/weapp/picture',
      url: 'https://104724433.xuanxuanballe.club/weapp/picture',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var picture1 = res.data.data.msg
        var picture=[]
        if(id==1){
          for( var element in picture1){
            if(picture1[element].type=="环境"){
              picture.push(picture1[element])
            }
          }
        } else if (id == 2) {
          for (var element in picture1) {
            if (picture1[element].type == "课堂") {
              picture.push(picture1[element])
            }
          }
        } else if (id == 3) {
          for (var element in picture1) {
            if (picture1[element].type == "活动") {
              picture.push(picture1[element])
            }
          }
        }

        that.setData({
          pictures: picture
        })
      }    
    })


    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;
        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });
 
      }
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

  }
})
