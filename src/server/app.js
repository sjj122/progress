const express = require('express')
const app = express()
const cors = require('cors')
// 解决跨域
app.use(cors())
// 像往常一样配置body-parser，但是现在express已经集成了body-parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// 引入路由
const sunningRouter = require('./router/sunning')
app.use(sunningRouter)

app.listen(3000, () => console.log('server is running at 3000'))
