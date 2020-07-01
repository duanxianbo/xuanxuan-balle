/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

router.post("/class", controllers.class)
router.get("/lesson", controllers.lesson)
router.get("/picture", controllers.picture)
router.get("/video", controllers.video)
router.get("/video_card", controllers.video_card)
router.get("/schedule", controllers.schedule)
router.post("/form", controllers.form)
router.post("/form_change", controllers.form_change)
router.post("/form_add", controllers.form_add)
router.post("/form_del", controllers.form_del)
router.post("/openId_add", controllers.openId_add)
router.post("/table_add", controllers.table_add)
router.post("/add_day", controllers.add_day)
router.get("/read_day", controllers.read_day)
router.get("/yearCard", controllers.yearCard)
router.get("/group_buy", controllers.group_buy)
router.post("/order_single", controllers.order_single)
router.post("/order_groupBuy", controllers.order_groupBuy)
router.post("/order_yearCard", controllers.order_yearCard)
router.get("/get_groupBuy", controllers.get_groupBuy)
router.get("/get_single", controllers.get_single)
router.get("/get_yearCard", controllers.get_yearCard)
router.get("/listYearcard", controllers.listYearcard)
router.post("/form_del_yearCard", controllers.form_del_yearCard)
router.post("/form_add_yearCard", controllers.form_add_yearCard)
router.get("/listGroupbuy", controllers.listGroupbuy)
router.get("/aboutMe", controllers.aboutMe)
router.post("/form_del_groupBuy", controllers.form_del_groupBuy)
router.post("/form_add_groupBuy", controllers.form_add_groupBuy)
router.post("/form_del_picture", controllers.form_del_picture)
router.post("/form_add_picture", controllers.form_add_picture)
router.post("/form_del_video", controllers.form_del_video)
router.post("/form_add_video", controllers.form_add_video)
router.post("/form_del_videoCard", controllers.form_del_videoCard)
router.post("/form_add_videoCard", controllers.form_add_videoCard)
router.post("/addaboutMe", controllers.addaboutMe)
router.post("/delaboutMe", controllers.delaboutMe)
router.post("/contract_add", controllers.contract_add)
router.post("/contract_show", controllers.contract_show)
router.post('/wxpay', controllers.wxpay )

router.post('/wxNotify',controllers.wxNotify )
router.post('/picture_add', controllers.picture_add)


module.exports = router
