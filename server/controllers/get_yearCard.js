const { mysql } = require('../qcloud')
module.exports = async ctx => {
  var result = await mysql('order_yearCard')
  ctx.state.data = {
    msg: result
  }
}