const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var body= ctx.request.body
  await mysql('picture').insert(body)
}