const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var result = await mysql('day')
  ctx.state.data = {
    msg: result
  }
}