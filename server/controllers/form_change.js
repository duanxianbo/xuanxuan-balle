const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var body = ctx.request.body
  await mysql('lesson').update({ class: body.class, waste:body.waste}).where('user', body.user)
}