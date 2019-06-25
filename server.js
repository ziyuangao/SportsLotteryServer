const express = require('express')
const app = express()
var homeRouter = require('./router/home.js')
var dailyLifeRouter = require('./router/dailyLife.js')
var uploadRouter = require('./router/uploadRouter.js')
var lolRouter = require('./router/lol.js')
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin","*");         //允许的来源
    res.header("Access-Control-Allow-Headers","Content-Type");    //请求的头部
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE");  //允许请求的方法
    next()
})
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/uploads', express.static(__dirname + '/uploads'))

app.use('/home',homeRouter)
app.use('/dailyLife',dailyLifeRouter)
app.use('/upload',uploadRouter)
app.use('/lol',lolRouter)

var server = app.listen(9999, function () {
    console.log('server has started')
})