const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var result = await mysql('aboutMe')
  ctx.state.data = {
    msg: result
  }
}