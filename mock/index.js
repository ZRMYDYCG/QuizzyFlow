const Koa = require('koa')
const Router = require('koa-router')
const mockList = require('./core/index')

const app = new Koa()
const router = new Router()

// 增加响应时间
async function getRes(fn, ctx) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const res = fn(ctx)
      resolve(res)
    }, 1000)
  })
}

// 注册Mock路由
mockList.forEach((item) => {
  if (!item.method || !item.url || typeof item.response !== 'function') {
    console.error('Invalid mock item:', item)
    return
  }

  router[item.method](item.url, async (ctx) => {
    console.log(`Handling request for ${item.method.toUpperCase()} ${item.url}`)
    ctx.body = await getRes(item.response, ctx)
  })
})

app.use(router.routes())

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000')
  console.log('Swagger UI is available at http://localhost:3000/swagger')
})
