const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var body = ctx.request.body
  await mysql('group_buy').del().where('name', body.name)
}