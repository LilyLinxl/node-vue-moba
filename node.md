# 一、王者荣耀项目简介
# 二、工具安装和环境搭建
nodejs 官网下载,
npm 淘宝镜像 npm install -g cnpm --registry=https://registry.npm.taobao.org,
mongodb 官网下载
# 三、初始化项目
## 1.node-vue-moba根目录下(github新建同名仓库)
包括readme介绍文件，license开源协议，.gitignore分类文件
## 2.新建server文件夹放服务端项目
## 3.用vue cli新建web和admin文件夹，前台和后台的前端
npm i -g @vue/cli
vue create web,vue create admin
## 4.初始化后端项目
npm init -y
新建index.js入口文件
在package.json中设置启动项目的命令
全局安装nodemon ：npm i -g nodemon
# 四.管理后台
## 4.1 基于Element UI的后台管理基础界面搭建
+ 1.安装element 
cd admin
vue add element
+ 2.添加路由  history---no
+ 3.在views中新建Main.vue，
将element官网中的container布局容器中实例代码复制到Main.vue里
container部分放到template中
+ 4.在router中引用Main页面
home替换成Main
+ 5.去掉App.vue中不需要的链接和样式，去掉边距
让container的高度充满屏幕，height:100vh
## 4.2 分类管理

### 1. 创建分类 (客户端)

+ 1.修改导航栏
+ 2.新建 创建分类页面CategoryEdit，
+ 3.修改main中写死的table，这个部分应该是router-view路由容器，
显示当前路由地址所对应的内容，
为main添加子路由
+ 4.新建分类页面的布局
双向绑定数据，绑定事件
+ 5.安装axios(因为需要请求接口提交数据)
cnpm i axios
axios是基于promise用于浏览器和node.js的http客户端。

axios的作用是什么呢：axios主要是用于向后台发起请求的，还有在请求中做更多的可控功能。
+ 6.建议接口请求每个功能写一个js都从router中引用。新建http.js
新建http实例，导出
在main.js中导入实例,并且加载的vue的原型上，这样任何地方都能访问到这个http实例（数据请求接口）
+ 7.在新建分类页面的方法中调用数据请求接口（但是现在还没有后端接口，先放着...）
### 2. 创建分类 (服务端)
+ 1.切到服务端的文件夹中,并启动
cd server
npm run serve
+ 2.安装常用模块
cnpm i express@next mongoose cors
+ 3.index.js
引入express，新建express实例，监听端口号，并传递回调函数（启动服务器成功后做的事情)
+ 4.写分类路由
新建routes文件夹，里面再新建admin文件夹表示后端路由，再里面新建index.js
小技巧：
+ 5.新建plugins>db.js 表示数据库
用同样的方式引入db.js
+ 6.新建models文件夹存放模型
+ 7.子路由使用客户端传来的数据，调用models中的模型实现分类添加，并将响应结果返回给客户端
+ 8.vue页面调用后端接口

### 3. 分类列表
+ 1.新建CategoryList.vue
+ 2.在路由中将其引入
+ 3.在CategoryList中加一个表格，并为表格提供数据items（id，name)
+ 4.created生命周期函数中获取数据，获取数据的方法写在mothods中
因为还没有写后端的接口，切到后端中路由里写一下分类列表的接口
+ 5.CategoryList中调用接口，将结果赋值给items

### 4.分类编辑
+ 1.为表格加一个操作列，留下一个编辑项
+ 2.编辑可以跳转到指定的路由
+ 3.添加相应的路由，并接受传递的参数即id
+ 4.编辑页面通过props接受参数
+ 5.通过是否有id判断是新增还是编辑
如果有id，在created中获取id相应的name填到输入栏中
+ 6.后端写根据id获取 name的接口
+ 7.前端请求接口，获取接口响应的数据
+ 8.保存的时候做条件判断，并写上修改的后端接口

### 5. 分类删除
+ 1.添加删除列，触发点击事件执行删除方法，将当前行row传入方法
+ 2.使用messagebox做删除提示
+ 3.删除接口
+ 4.删除成功后重新获取数据

### 6. 子分类
+ 1.页面中添加子分类输入框，上级分类选择框
+ 2.获取分类列表渲染到选择框上
+ 3.修改分类model加一个parent，父级分类
```javascript
parents:{type:mongoose.SchemaTypes.ObjectId,ref:'Category'}
```
关联分类模型
+ 4.分类列表展示上级分类名称
需要修改后端接口
```javascript
 const items = await Category.find().populate('parent').limit(10)
```
关联取出parent,parent从原先的id变成一个对象.对象中包含了上级分类名称

### 7. 通用crud接口
+ 1.动态获取模型名称
+ 2.因为是在router.use中定义的参数又在router里面中应用，所以
要在router实例中加一个参数，mergeParams:true表示合并参数
这个意思差不多是让子路由继承父路由的参数
前端页面的接口地址也要改
加上rest/...表示通用接口，避免和以后的接口产生冲突
+ 3.但是模型是大写单数，url上是小写复数，所以需要做一些转化
```javascript
  const modelName = require('inflection').classify(req.params.resource)
  req.Model = require(`../models/${modelName}`)
```
npm i inflection
处理类名转换，单复数，大小写转换

+ 4.为了复用上面两句代码
在这些接口统一加上前置的处理
在app.use那里加一个中间件，一个处理函数
+ 5.为了访问到Model，把它加到req上，表示在请求对象上加一个属性model
这样在后续的请求中可以用上一个请求函数里面的req
express里面的链式操作，一个路径对应很多个处理函数，调用next()就会处理第二个处理函数
然后把所以model名换在req.Model
+ 6.有一个接口中的parent属于特殊操作
把populate('parent')作为条件选择
```javascript
const queryOptions = {}
        if(req.Model.modelName === 'Category'){
            queryOptions.populate = 'parents'
        }
const items = await req.Model.find().setOpt(queryOptions).limit(10)
```
 ## 4.3 装备物品管理
 和分类页面差不多，前端部分先复制过来改一下名字就行，后端加个Item模型
 ### 1.图片上传
 + 1.使用element中的upload组件
 其中action:上传图片的接口地址，因为action是自带的ajax请求，所以要带上baseUrl
 + 2.后端写接口，安装处理上传文件数据的包
 cnpm i multer
```javascript
 const multer = require('multer')//处理上传文件数据的包
    const upload = multer({dest:__dirname+'/../../uploads'})//dest目标地址
    app.post('/admin/api/upload',upload.single('file'),async(req,res)=>{
        const file = req.file
        res.send(file)
    })
```
upload.single('file')定义上传中间件,单个文件上传，字段名‘file’
+ 3.为了让上传的文件可见
- 在node.js中想要被访问的文件都要写路由
定义一个路由，静态文件托管
index.js
```javascript
app.use('/uploads',express.static(__dirname + '/uploads'))
```
- 添加file的url
```javascript
file.url = `http://localhost:3000/uploads/${file.filename}`
```
+ 4.修改前端页面
添加成功上传后的回调函数
```javascript
 afterUpload(res){
                // this.model.icon = res.url 这种方式不是响应式的
                this.$set(this.model,'icon',res.url)
            }
```
+ 5.物品列表中显示图标
需要在表格中增加自定义列

## 4.4 英雄管理
### 1.基础界面根据物品的修改一下就行了
### 2.英雄编辑模型字段
根据原型图定义英雄模型
需要关联模型的使用
```javascript
type:mongoose.SchemaTypes.ObjectId,ref: 'Item'
```
### 3.编辑表单
+ 1.分类需要从服务端获取数据，用el-select
+ 2.难度技能等分值 使用el-rate
获取数据时
```javascript
this.model = Object.assign({}, this.model, res.data)
//避免没有获取到数据使得初始化的数据为undefined
```
### 4.技能编辑
+ 1.把刚刚那些放到el-tabs>el-tab-pane中作为基础信息，
然后再做技能表单。这样就像活页夹里的分页一样了很清晰明了
+ 2.点击按钮添加新的表单
```@click="model.skills.push({})```
给数组添加空对象即可
+ 3.使用el-row，el-col对新表单进行布局
每次点击新增一列
+ 4.交互
添加技能图标
```javascript
:on-success="res => $set(item,'icon',res.url)"
```
删除一个技能
使用数组删除的方法

## 4.5 文章管理
## 4.6 广告管理
## 4.7 管理员账号管理
+ 1.管理员模型
密码需要加密后再存储
安装bcrypt包
```javascript
 password:{
      type:String,
      set(val){
        return require('bcrypt').hashSync(val,10)//加密等级
      }
    }
```
+ 2.前端加菜单
```html
<el-menu router :default-openeds="['3']" unique-opened :default-active="$route.path">
```
默认打开，只能打开一个，根据地址默认高亮
+ 3.前端加路由
## 4.8 登录
### 1.登录界面
+ 1.前端路由
+ 2.前端页面
@submit.native.prevent="login"
监听el-form的原生表单事件，并阻止默认提交跳转页面
### 2.登录接口
#### 2.1 后端路由
##### 1.根据用户名找用户
##### 2.校验密码
安装 npm i jsonwebtoken
设置全局秘钥
```javascript
app.set('secret','i2jdso393jcjsksk')
//app.set 在express实例上设置一个变量
//后面的值最好还是放到全局变量里去
```
3.返回token
```javascript
const jwt = require('jsonwebtoken')
const token = jwt.sign({id:user._id},app.get('secret'))
```
>jsonwebtoken 里面提供的 jwt.sign 功能，去签发一个 token。
这个 sign 方法需要三个参数：
playload：签发的 token 里面要包含的一些数据。
secret：签发 token 用的密钥，在验证 token 的时候同样需要用到这个密钥。

#### 2.2 前端设置响应拦截，通用错误处理
```javascript
http.interceptors.response.use( res => {
    return res
}, err => {
  if( err.response.data.message ){
     Vue.prototype.$message({
         type:'error',
         message:err.response.data.message
     })   
  }
  return Promise.reject(err)
})
// Vue.prototype.$message
```
#### 2.3 前端保存token
```javascript
 localStorage.token = res.data.token
```
sessionStorage,Cookie也都可以
### 3.服务端登录校验(jwt)
#### 1.修改接口，加一个处理函数(中间件)
app.use 加载用于处理http請求的middleware（中间件），当一个请求来的时候，会依次被这些 middlewares处理。
#### 2.token放在请求头里，前端设置请求拦截
```javascript
http.interceptors.request.use(function (config) {
    config.headers.Authorization = 'Bearer ' + localStorage.token
    return config
  }, function (error) {
    return Promise.reject(error)
})
```
为什么加Bearer，因为授权的类型有很多，加的话是为了指定类型
#### 3.后端获取token后的操作
jwt校验token获取id
根据id查找用户信息
```javascript
 const token = String(req.headers.authorization || '').split(' ').pop()
 const { id } = jwt.verify(token,app.get('secret'))
 req.user = await AdminUser.findById(id)
 await next()
```
### 4.服务端登录校验(assert)
http-assert用来给错误清空返回错误状态码和提示信息的api
#### 1.安装，导入并使用assert
```javascript
 assert(user,422,'用户不存在')//可以替换下面的
        if(!user){
            return res.status(422).send({
                message: '用户不存在'
            })
        }
```
#### 2.错误处理函数
根据状态码返回错误提示
#### 3.资源列表接口中设置异常处理
```javascript
 const token = String(req.headers.authorization || '').split(' ').pop()
 assert(token,401,'请先登录')//未提供jwt token
 const { id } = jwt.verify(token,app.get('secret'))
 assert(id,401,'请先登录')//无效的jwt token
 req.user = await AdminUser.findById(id)
 assert(req.user,401,'请先登录')
```
#### 4.修改前端请求,响应拦截器
没有token就不用把token放请求头
前端和后端状态码统一，一旦出现登录错误返回登录页面
### 5.服务端登录校验(中间件)
封装登录校验中间件
将中间件单独封装到文件中
导出函数便于配置，更灵活


