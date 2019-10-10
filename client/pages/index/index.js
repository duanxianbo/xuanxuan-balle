//index.js
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
//获取应用实例
var app = getApp();
Page({
  data: {
    userInfo: {},
    openId:'',
	  showLoading:true,
    animationData: {},
    animationData_book: {},
    animationData_video: {},  
    pictures: ["http://wx3.sinaimg.cn/mw690/006p6Tvegy1fuhn3mirn3j30m80esab7.jpg", "http://wx2.sinaimg.cn/mw690/006p6Tvegy1fuhn3uqpnwj30m80esq3s.jpg", "http://wx4.sinaimg.cn/mw690/006p6Tvegy1fuhn57y282j30m80es3zb.jpg", "http://wx4.sinaimg.cn/mw690/006p6Tvegy1fuhn6cvbo1j30m80esabf.jpg",
    ],
    
  },

onLoad:function(){
},



  intoMap: function () {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.openLocation({
          latitude: 39.786541,
          longitude: 116.324432,
          name: "萱萱舞蹈工作室",
          address: "北京CCD创意港嘉悦广场6号楼303",
          scale: 28
        })
      },
    })

  },


  previewImage: function (event) {
    var that = this,
      index = event.currentTarget.dataset.index,
      pictures = this.data.pictures;

    wx.previewImage({
      current: pictures[index],
      urls: pictures,
    })
  },

  //事件处理函数

	showLoading:function(){
	this.setData({
	})
	},


  toLocation: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/location/location'
    });  
  },


  toVisual: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/visual/visual'
    });
  },


  toVideo: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/video/video'
    });
  },

  toPhoto: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/photo/photo0'
    });
  },

yearCard:function(){
wx.navigateTo({
  url: '/pages/yearCard/yearCard',
})
},

toAbout:function(){
wx.navigateTo({
  url: '/pages/aboutMe/aboutMe',
})
},

Call:function(e){
  wx.makePhoneCall({
    phoneNumber: '18612257539',
  });
},

  setDefault: function () {
    console.log('setDefault....')
  },


  onShow:function(){
    // 页面显示
 
  },



  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }

})
