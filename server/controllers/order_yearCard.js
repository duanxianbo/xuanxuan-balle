const { mysql } = require('../qcloud')


module.exports = async ctx => {
  var body = ctx.request.body
  await mysql('order_yearCard').insert(body)
}