const express = require('express')
const sunningRouter = express.Router()
const mongoose = require('mongoose')
// 上传文件包
const fs = require('fs')
const multer = require('multer')
// 初始化Clinent
const OSS = require('ali-oss')
const co = require('co')
const client = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: 'LTAI5tK1ufrBALYRgncNhtDy',
    accessKeySecret: 'qmsXCrqXqBkJlDn7HxKCQ4Lcgou5XZ'
})
const ali_oss = {
    bucket: 'sunning-sjj',
    endPoint: 'oss-cn-beijing.aliyuncs.com'
}
// 加载MongoDB模型
const Sunning = require('../model/Sunning')
// 连接MongoDB
mongoose.connect("mongodb://localhost:27017/sj_pro", { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true })
mongoose.connection.on('open', () => console.log('mongodb is connected'))
mongoose.connection.on('error', () => console.log('mongodb connect error'))
mongoose.connection.on('disconnected', () => console.log('mongodb is disconnected'))

// 1.获取sunning数据
sunningRouter.post('/getSunning', (req, res, next) => {
    const { pageNum, pageSize } = req.body
    const skip = pageSize * (pageNum - 1)
    Sunning.find().skip(skip).limit(pageSize).sort({ month: -1 }).exec((err, sunnings) => {
        if (err) res.json({ status: 500, message: 'error' })
        else res.json({ status: 200, result: sunnings, message: 'success' })
    })
})

// 2.上传图片到阿里云oss
const upload = multer({ dest: './tmp/' })
sunningRouter.post('/upload_sunning', upload.single('sunning'), (req, res, next) => {
    // 文件路径
    const filePath = './' + req.file.path
    // 文件类型
    const temp = req.file.originalname.split('.')
    const fileType = temp[temp.length - 1]
    const lastName = '.' + fileType
    // 构建图片名
    const fileName = Date.now() + lastName
    // 图片重命名
    fs.rename(filePath, fileName, err => {
        if (err) res.json({ status:'500', message:'文件写入失败' })
        else {
            const localFile = './' + fileName
            const key = fileName                // 可拼凑文件夹的路径

            // 阿里云上传文件
            client.useBucket(ali_oss.bucket)
            client.put(key, localFile, { headers: { 'Content-Type': 'image/jpg' } }).then(result => {
                fs.unlinkSync(localFile)
                res.json({ status:'200', message:'上传成功', imageUrl: result.url})
            })
        }
    })
})

// 3.添加城市的踩一踩tag
/*
step [
    {
        city: '',
        step_num: 0
    }
]
*/
sunningRouter.post('/addStepTag', (req, res, next) => {
    const { sunning_id, activity_id, tag_city } = req.body
    Sunning.findOne({ _id: sunning_id }, (err1, sunning) => {
        if (err1) res.json({ status: 500, message: 'error' })
        else {
            // 没有就添加，有就加一并提示存在不需要添加
            if (sunning) {
                // let activities = sunning.activities
                let flag = false // 标记是添加（false）还是增加（true）
                for (let i = 0; i < sunning.activities.length; i++) {
                    if (sunning.activities[i].id === parseInt(activity_id)) {
                        // steps数组为空，没有存在
                        if (sunning.activities[i].steps.length === 0) sunning.activities[i].steps.push({ city: tag_city, step_num: 1 })
                        else {
                            for (let j = 0; j < sunning.activities[i].steps.length; j++) {
                                if (sunning.activities[i].steps[j].city === tag_city) { // 已存在
                                    sunning.activities[i].steps[j].step_num += 1
                                    flag = true
                                    break
                                }
                                if (j === sunning.activities[i].steps.length - 1) {    // 没有存在
                                    sunning.activities[i].steps.push({ city: tag_city, step_num: 1 })
                                    break
                                }
                            }
                        }
                        break
                    }
                }
                // 保存变更
                new Sunning(sunning).save((err2, new_sunning) => {
                    if (err2) res.json({ status: 500, message: 'error' })
                    else res.json({ status: 200, result: flag ? '增加' : '添加成功', sunning: new_sunning, message: 'success' })
                })
            } else res.json({ status: 404, message: 'not find sunning' })
        }
    })
})

module.exports = sunningRouter
