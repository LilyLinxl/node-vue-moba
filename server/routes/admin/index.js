module.exports = app =>{//导出函数app，接受一个传入的app对象
    const express = require('express')
    const router = express.Router({
        mergeParams:true
    })//express的子路由,子路由中会有各种增删改查的东西
    //当我们需要子路由时就这样写
    // const Category = require('../../models/Category')

    router.post('/',async (req,res)=>{
        //创建数据,数据来源是客户端提交的数据，要使用req.body需要引入中间件
        //express.json()
        
        const model = await req.Model.create(req.body)
        res.send(model)//发送响应结果给客户端
    })
    //分类的增删改查
    router.get('/',async (req,res)=>{
        const queryOptions = {}
        if(req.Model.modelName === 'Category'){
            queryOptions.populate = 'parents'
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(10)
        res.send(items)
    })
    router.get('/:id',async (req,res)=>{
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })
    router.put('/:id',async (req,res)=>{
        const model = await req.Model.findByIdAndUpdate(req.params.id,req.body)
        res.send(model)
    })
    router.delete('/:id',async (req,res)=>{
        await req.Model.findByIdAndDelete(req.params.id,req.body)
        res.send({
            success:true
        })
    })
    app.use('/admin/api/rest/:resource',(req,res,next)=>{
        const modelName = require('inflection').classify(req.params.resource)
        req.Model = require(`../../models/${modelName}`)
        next()
    },router)//将子路由挂载上去,/admin/api接口地址

    const multer = require('multer')//处理上传文件数据的包
    const upload = multer({dest:__dirname+'/../../uploads'})//dest目标地址
    app.post('/admin/api/upload',upload.single('file'),async(req,res)=>{
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })
    //upload.single('file')定义上传中间件,单个文件上传，字段名‘file’
}