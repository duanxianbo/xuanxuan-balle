const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var body = ctx.request.body
  await mysql('lesson').update({ openId: body.openId }).where('user', body.user)
}