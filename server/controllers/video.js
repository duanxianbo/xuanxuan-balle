const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var result = await mysql('video')
  ctx.state.data = {
    msg: result
  }
}