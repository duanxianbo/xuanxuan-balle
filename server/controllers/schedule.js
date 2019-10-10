const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var result = await mysql('schedule')
  ctx.state.data = {
    msg: result
  }
}