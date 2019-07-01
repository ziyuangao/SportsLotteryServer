let express = require('express')
let app = express()
let router = express.Router()
const multer = require('multer')
const upload = multer({dest: __dirname + '../../uploads'})
var fs = require('fs')
// 创建 application/x-www-form-urlencoded 编码解析

router.post('/img',upload.single('file'),async (req, res)=>{
    const file = req.file
    file.url = `http://localhost:9999/uploads/${file.filename}`
    res.send(file)
})
router.post('/mp3',upload.single('file'),async (req, res)=>{
    const file = req.file
    file.url = `http://localhost:9999/uploads/${file.filename}`
    res.send(file)
})

module.exports = router