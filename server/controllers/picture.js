const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var result = await mysql('picture')
  ctx.state.data = {
    msg: result
  }
}