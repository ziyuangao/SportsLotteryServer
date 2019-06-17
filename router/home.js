let express = require('express')
let app = express()
let router = express.Router()
let db = require('../public/js/db.js')
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var md5 = require("md5");
// 创建 application/x-www-form-urlencoded 编码解析

router.get('/getNavList',(req,res)=>{
    db.find('navList',{
        where:{
            isDeleted:2,//1删除 2未删除
        }
    },(err,data)=>{
        let obj = {}
        if (err) {
            obj.statusCode = 500 //系统报错
            obj.data = [],
            res.send(obj)
        }else{
            obj.statusCode = 200
            obj.data = data.sort(sortNumber)
            res.send(obj)
        }
    })
})

function sortNumber(a,b){
    return a.sort - b.sort
}

router.get('/login',(req,res)=>{
    var dataObj = req.query
    dataObj.passwd = md5(md5(dataObj.passwd))
    console.log(dataObj.passwd)
    db.find('money',{
        where:{ 
            name:dataObj.name,
            passwd:dataObj.passwd,
            isDelete:0,
        }},
        (err,data)=>{
        if (err) throw err
        if (data[0]) {
            var obj ={
                statusCode:200,
                message:'登陆成功',
                data:{
                    name:dataObj.name,
                    passwd:dataObj.passwd
                }
            }
        }else{
            var obj = {
                statusCode:10201,
                message:'用户不存在或账号密码错误',
                data
            }
        }
        res.send(obj)
    })
})

router.post('/signIn',urlencodedParser,(req,res)=>{
    var dataObj = req.body
    db.find('money',{where:{name:dataObj.name,isDelete:0}},(err,data)=>{
       if (err) throw err
        if (data[0]) {
            var obj = {
                statusCode:10110,
                message:'已存在用户,请直接登陆',
                data,
            }
            res.send(obj)
        }else{
            dataObj.passwd = md5(md5(dataObj.passwd))
            dataObj.checkPass = md5(md5(dataObj.checkPass))
            dataObj.code = md5(md5(dataObj.code))
            dataObj.cTime = new Date().getTime()
            dataObj.isDelete = 0
            db.insertOne('money',dataObj,(data)=>{
                var obj = {
                    statusCode:200,
                    message:'注册成功,请登陆。',
                    data,
                }
                res.send(obj)
            })
        }
    })
})

module.exports = router