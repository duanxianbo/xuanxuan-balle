
var count = 0;

// 用来装视频列表
var videoSrcArr = new Array();

var qqVideo = {
getVideoes (vid) {
  count = 0;
  videoSrcArr = new Array();
  console.log(vid);
  var that = this;
    var videoUrl = "https://vv.video.qq.com/getinfo?otype=json&appver=3.2.19.333&platform=11&defnpayver=1&vid=" + vid;
    console.log(videoUrl);
    var host;
    return new Promise(function (resolve) {
    wx.request({
      url: videoUrl,
      success: function (res) {
        var dataJson = res.data.replace(/QZOutputJson=/, '') + "qwe";
        var dataJson1 = dataJson.replace(/;qwe/, '');
        var data = JSON.parse(dataJson1);
        var fn_pre = data.vl.vi[0].lnk
        host = data['vl']['vi'][0]['ul']['ui'][0]['url']
        console.log(host);
        var streams = data['fl']['fi']
        var seg_cnt = data['vl']['vi'][0]['cl']['fc']
        if (parseInt(seg_cnt) == 0) {
          seg_cnt = 1
        }
        var best_quality = streams[streams.length - 1]['name']
        var part_format_id = streams[streams.length - 1]['id']
        console.log(part_format_id);
      console.log(seg_cnt);
         for (var i = 1; i < (seg_cnt + 1); i++) {
           var filename = fn_pre + '.p' + (part_format_id % 10000) + '.' + i + '.mp4';
           console.log(filename);
           requestVideoUrls(part_format_id, vid, filename, host, seg_cnt).then(function (response) {
        resolve(response);
           });
        }
      
      }
    })
    })
  },
// 解析视频真正的地址
};

function requestVideoUrls(part_format_id, vid, fileName, host,videoCount) {
  if(part_format_id==10709){
    var keyApi = "https://vv.video.qq.com/getkey?otype=json&platform=11&format=" + part_format_id + "&vid=" + vid + "&filename=" + fileName + "&appver=3.2.19.333"
  
  }else{
    var keyApi = "https://vv.video.qq.com/getinfo?otype=json&platform=11&format=" + part_format_id + "&vid=" + vid + "&filename=" + fileName + "&appver=3.2.19.333"
  }
  console.log(keyApi);
  
 
  // 
 
  return new Promise(function (resolve) {
    wx.request({
      url: keyApi,
      success: function (res) {
        console.log(res);
        var dataJson = res.data.replace(/QZOutputJson=/, '') + "qwe";
        var dataJson1 = dataJson.replace(/;qwe/, '');
        var data = JSON.parse(dataJson1);
        console.log(data);
        if (data.key != undefined) {
          var vkey = data['key']
          var url = host + fileName + '?vkey=' + vkey;
          var vidoeSrc = String(url)
          videoSrcArr.push(vidoeSrc);
        }else if(data.vl.vi[0].fvkey){
          var vkey = data.vl.vi[0].fvkey;
          fileName = data.vl.vi[0].fn
          var url = host + fileName + '?vkey=' + vkey;
          var vidoeSrc = String(url);
          videoSrcArr.push(vidoeSrc);
        }
        count++;
        // 判断视频是否全部获取，获取全部视频再返回
        if(count==videoCount){
          resolve(videoSrcArr);
          console.log(videoSrcArr);
        }
       
      }
    })
  })
}
module.exports = qqVideo