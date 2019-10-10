const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var result = await mysql('group_buy')
  ctx.state.data = {
    msg: result
  }
}