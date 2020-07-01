const uuid = require('uuid')
const crypto = require('crypto');
const xml2js = require('xml2js')
const request = require('request');
const querystring = require("querystring");
const util=require('./util.js')

module.exports = async (ctx, next) => {
  //1.根据orderCode查询订单状态和付款金额，此处省略
  // console.log(ctx.request.body)
  const order = { //参数一定要按照acil码(也就是a,b,c,d)顺序来写，或者你需要按照acil码自己排序，否则会在支付时报签名错误
    appid: 'wx158a051ad1abcd07',
    //appid: 'wx162b6c9d84fddb88',
    body: '课程购买',
    mch_id: '1531463121',
    nonce_str: (uuid.v4()).replace(/-/g, ''),
    notify_url: 'https://104724433.xuanxuanballe.club/weapp/wxNotify',
    openid: ctx.request.body.openId,
    out_trade_no: ctx.request.body.mct_id,//orderInfo[0].orderCode,
    spbill_create_ip: ctx.request.ip.replace(/::ffff:/g, ''),
    total_fee: Number(ctx.request.body.price)*100, //先1分钱
    trade_type: 'JSAPI'
  }
   const objStr = util.objTostring(order)
  //const objStr = querystring.stringify(order)
  console.log(objStr)
  const preSign = objStr + 'key=QiuMeiDuoQiuMeiDuoQiuMeiDuo12345'
  console.log(preSign)
  const md5 = crypto.createHash('md5');
  order.sign = md5.update(preSign).digest('hex').toUpperCase();

  // order.sign = util.endeurl.md5(preSign).toUpperCase()
  const xml = util.objToXml(order)
  console.log(xml)


  //exports.httprequest = (requestData) =>{
  function httprequest(xml) {
    return new Promise((resolve, reject) => {
      var url = "https://api.mch.weixin.qq.com/pay/unifiedorder"
      var option = {
        url: url,
        method: "POST",
        body: xml
      }
      request(option, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(util.parseStringAsync(body))
          //resolve(body)
        }
      });
    });

  };

  var result
  await httprequest(xml).then(function (req) {
     result=req
   
    // console.log(util.parseStringAsync(req))
    // console.log('result parse')
    // console.log(result1)

    console.log('req')
    console.log(req)
  })



   console.log('result.xml')
  console.log(result.xml)
 paySign1=result.xml



  //await console.log(data)

  // const parser = new xml2js.Parser()
  // const json = parser.parseString(data.body)
  // // await console.log(json)
  //const result = await querystring.parse(data.body)

  if (result.xml.result_code[0] == 'FAIL') {
    throw {
      message: 'orderStatus wrong'
    }
  }


  const paysign2= { //参数一定要按照acil码(也就是a,b,c,d)顺序来写，或者你需要按照acil码自己排序，否则会在支付时报签名错误
    appId: 'wx158a051ad1abcd07',
    nonceStr:paySign1.nonce_str[0] ,
    package: 'prepay_id=' +paySign1.prepay_id[0],
    signType: 'MD5',
    timeStamp: parseInt(Date.now() / 1000).toString(),
  }


  // //字符串必需按照顺序来
  // const paysign2 = {
  //   appId: result.xml.appid[0],
  //   nonceStr: result.xml.nonce_str[0],
  //     //package: 'Sign=WXPay',
  //   //package:'prepay_id='+result.xml.prepay_id[0],
  //   package: result.xml.prepay_id[0],
  //   partnerid: result.xml.mch_id[0],
  //   prepayid:  result.xml.prepay_id[0],
  //   signType: 'MD5',
  //   timeStamp: parseInt(Date.now() / 1000).toString() //注意：时间必需为秒
    
  // }
  const payPrestr = util.objTostring(paysign2) + 'key=QiuMeiDuoQiuMeiDuoQiuMeiDuo12345' //不知道的话，可以问老板

console.log(payPrestr)
  //paysign2.sign = endeurl.md5(payPrestr).toUpperCase()
  const md5_2 = crypto.createHash('md5');
  paysign2.sign = md5_2.update(payPrestr).digest('hex').toUpperCase();
 
 console.log(paysign2)

  //二次签名，返回给app即可，由app端进行微信支付吊起
  ctx.body = {
    paysign2
    //paySign1
  }
}