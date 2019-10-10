const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var body = ctx.request.body
  await mysql('lesson').update({ class: body.class}).where('user', body.user)
}