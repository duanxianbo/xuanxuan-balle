const {mysql} =require('../qcloud')

module.exports= async ctx=>{
  var result=await mysql('lesson')
  ctx.state.data={
    msg: result
  }
}