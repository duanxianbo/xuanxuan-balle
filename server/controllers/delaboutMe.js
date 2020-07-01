const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var body = ctx.request.body
  await mysql('aboutMe').del().where('adult', body.adult)
}