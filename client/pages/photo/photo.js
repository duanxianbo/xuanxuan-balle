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
    pictures: [],
    type: "",
    url: "",
    descrp: "",
    id: 0,
    value0: ""
  },


  previewImage: function (event) {
      var that = this,
      index = event.currentTarget.dataset.index,
      picture = this.data.pictures;
      var pictures=[]
      for (var i in picture){ 
          pictures.push(picture[i].URL)  
      }     

    wx.previewImage({
      current: picture[index].URL,
      urls: pictures,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var that = this
    
    var pic_type = ['环境', "课堂", "活动"]
    wx.request({
      // url: 'https://rv647fej.qcloud.la/weapp/picture',
      url: 'https://104724433.xuanxuanballe.club/weapp/picture',
      method: 'GET',
      dataType: 'json',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var picture1 = res.data.data.msg
        var picture=[]
        for( var element in picture1){
          if(picture1[element].type == pic_type[id-1]){

            var img_url = picture1[element].URL;
          
            if (img_url.indexOf('http') >=0){
              picture.push(picture1[element]);
            }
            
          }
        }
        
        that.setData({
          pictures: picture,
          type: pic_type[id - 1]
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


  addDescrp: function(e){
    var val = e.detail.value;
    this.setData({
      descrp: val
    });
  },

  addUrl: function (e) {
    var val = e.detail.value;
    this.setData({
      url: val
    });
  },

  addImage: function (e) {
    var that = this
    console.log("type", this.data.type, "descrp:", this.data.descrp, "URL", this.data.url)
    wx.request({
      url: 'https://104724433.xuanxuanballe.club/weapp/picture_add',
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        type: that.data.type,
        descrp: that.data.descrp,
        URL: that.data.url
      },
      success: function (res) {
        if (res.data.code != 0) {
          wx.showToast({
            title: "提交失败",
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
          let pages = getCurrentPages()
           pages[pages.length-1].onLoad({id: that.data.id + 1})
          }

        }
      },

      fail: function (res){
        console.log("Filure")
      }
      

    })
    that.setData({
      url: "",
      descrp: "",
      value0: ""
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
