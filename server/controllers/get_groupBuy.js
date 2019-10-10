const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var result = await mysql('order_groupBuy')
  ctx.state.data = {
    msg: result
  }
}