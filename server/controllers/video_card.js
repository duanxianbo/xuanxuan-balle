const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var result = await mysql('video_card')
  ctx.state.data = {
    msg: result
  }
}