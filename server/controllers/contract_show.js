const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var body = ctx.request.body
  var result = await mysql('contract').select("fileID").where('user', body.user)
  ctx.state.data = {
    msg: result
  }
}