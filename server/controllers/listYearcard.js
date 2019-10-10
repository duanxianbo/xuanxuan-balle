const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var result = await mysql('yearCard')
  ctx.state.data = {
    msg: result
  }
}