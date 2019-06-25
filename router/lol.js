let express = require('express')
let app = express()
let router = express.Router()
let db = require('../public/js/db.js')
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var md5 = require("md5");
// 创建 application/x-www-form-urlencoded 编码解析

router.get('/equipmentList',(req,res)=>{
    var dataObj = req.query
    db.find('lol',{where:{ isDelete:2},skip:dataObj.skip*1,limit:dataObj.limit*1},(err,data)=>{
        if (err) throw err
        var obj = {
            message:'获取成功',
            data
        }
        res.send(obj)
    })
})

function sortNumber(a,b){
    return a.sort - b.sort
}

router.post('/addEquipment',urlencodedParser,(req,res)=>{
    var dataObj = req.body
    db.find('lol',{where:{isDeleted:2,name:dataObj.name}},(err,data)=>{
        if (err) throw err
        if(data[0]){
            var obj = {
                statusCode:10110,
                message:'已存在装备,请编辑',
                data,
            }
            res.send(obj)
        }else{
            dataObj.cTime = new Date().getTime()
            dataObj.isDelete = 2
            db.insertOne('lol',dataObj,(data)=>{
                var obj = {
                    statusCode:200,
                    message:'添加成功。',
                    data,
                }
                res.send(obj)
            })
        }
    })
})

module.exports = router