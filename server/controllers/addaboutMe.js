const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var body = ctx.request.body
  await mysql('aboutMe  ').insert(body)
}