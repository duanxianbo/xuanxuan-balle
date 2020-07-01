module.exports = async (ctx, next) => {
async (ctx, next) => {

  //获取微信返回的参数值，查询订单状态

  const data = ctx.params
  var payQuery = {
    appid: data.xml.appid[0],
    mch_id: data.xml.mch_id[0],
    nonce_str: data.xml.nonce_str[0],
    out_trade_no: data.xml.out_trade_no[0],
    transaction_id: data.xml.transaction_id[0]
  }
  let payQueryString = objTostring(payQuery) + 'key=QiuMeiDuoQiuMeiDuoQiuMeiDuo12345'
  payQuery.sign = endeurl.md5(payQueryString).toUpperCase()
  //查询订单是否支付成功
  const data1 = await request.postAsync({
    url: 'https://api.mch.weixin.qq.com/pay/orderquery',
    body: services.pay.objToXml(payQuery)
  })

  const result = await parseStringAsync(data1.body)

  if (result.xml.return_code[0] && result.xml.return_code[0] == 'SUCCESS' && result.xml.trade_state[0] == 'SUCCESS') {

    //告诉微信，你收到支付结果通知了

    const resXml = "<xml>" + "<return_code><![CDATA[SUCCESS]]></return_code>" +

      "<return_msg><![CDATA[OK]]></return_msg>" + "</xml> "
    ctx.body = {
      resXml
    }

    //从result中比较价格和你订单中的金额是否一致，，进行后台业务处理，此处省略

  }
}
}