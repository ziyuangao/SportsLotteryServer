let express = require('express')
let app = express()
let router = express.Router()
let db = require('../public/js/db.js')
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var md5 = require("md5");
// 创建 application/x-www-form-urlencoded 编码解析

router.get('/createNumber',(req,res)=>{
        let leftPart = createPart({
            length:5,max:35,min:1
        })
        let rightPart = createPart({
            length:2,max:12,min:1
        })
        res.send({
            statusCode:200,
            message:'创建成功',
            data:leftPart.join()+' '+rightPart.join()
        })
})

function random(maxNum,minNum){
    return parseInt(Math.random()*(maxNum-minNum+1)+minNum)//可以获取最小数
}

function createPart(options={length,max,min}){
    let x  = undefined,arr = [];
    for(var i = 0 ; i <options.length; i++){
        x = random(options.max,options.min)
        if (arr.indexOf(x)<0) {
            arr.push(x)
        }else{
            i--
        }
    }
    return filterNum(arr)
}

function filterNum(arr){
    return arr.map(item=>{
        return item < 10 ? '0'+item : item+''
    })
}

router.get('/login',(req,res)=>{
    var dataObj = req.query
    dataObj.passwd = md5(md5(dataObj.passwd))
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