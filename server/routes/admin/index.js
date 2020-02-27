module.exports = app =>{//导出函数app，接受一个传入的app对象
    const express = require('express')
    const router = express.Router({
        mergeParams:true
    })
    //express的子路由,子路由中会有各种增删改查的东西
    //当我们需要子路由时就这样写
    // const Category = require('../../models/Category')
    //新增资源
    //登录校验中间件
    const AdminUser = require('../../models/AdminUser')
    const jwt = require('jsonwebtoken')
    const assert = require('http-assert')
    const authMiddleware = require('../../middleware/auth')
    const resourceMiddleware = require('../../middleware/resource')
    router.post('/',authMiddleware(),async (req,res)=>{
        //创建数据,数据来源是客户端提交的数据，要使用req.body需要引入中间件
        //express.json()
        
        const model = await req.Model.create(req.body)
        res.send(model)//发送响应结果给客户端
    })
    //资源列表
    router.get('/',authMiddleware(),async (req,res)=>{
        const queryOptions = {}
        if(req.Model.modelName === 'Category'){
            queryOptions.populate = 'parents'
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(10)
        res.send(items)
    })
    //资源详情
    router.get('/:id',authMiddleware(),async (req,res)=>{
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })
    //修改资源
    router.put('/:id',authMiddleware(),async (req,res)=>{
        const model = await req.Model.findByIdAndUpdate(req.params.id,req.body)
        res.send(model)
    })
    router.delete('/:id',authMiddleware(),async (req,res)=>{
        await req.Model.findByIdAndDelete(req.params.id,req.body)
        res.send({
            success:true
        })
    })
   
    app.use('/admin/api/rest/:resource',authMiddleware(),resourceMiddleware(),router)//将子路由挂载上去,/admin/api接口地址
    

    const multer = require('multer')//处理上传文件数据的包
    const upload = multer({dest:__dirname+'/../../uploads'})//dest目标地址
    app.post('/admin/api/upload',authMiddleware(),upload.single('file'),async(req,res)=>{
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })
    //upload.single('file')定义上传中间件,单个文件上传，字段名‘file’
    app.post('/admin/api/login',async (req, res) => {
        const { username, password } = req.body
        // 1.根据用户名找用户
        const user = await (await AdminUser.findOne({username}).select('+password'))
        //为了校验密码，查出密码
        assert(user,422,{message:'用户不存在'})
        // 2.校验密码
        const isValid = require('bcrypt').compareSync(password,user.password)
        assert(isValid,422,'密码错误')
        // 3.返回token
        const token = jwt.sign({id:user._id},app.get('secret'))
        res.send({token})
    })

    //错误处理函数
    app.use(async(err,req,res,next) => {
        res.status(err.statusCode||401).send({
            message:err.message
        })
    })
}