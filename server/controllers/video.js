const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var result = await mysql('video')
  console.log(result)
  ctx.state.data = {
    msg: result
  }
}