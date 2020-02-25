module.exports = app=>{
    const mongoose = require("mongoose")
    mongoose.connect("mongodb://127.0.0.1:27017/node-vue-moba",{//连接数据库
        useNewUrlParser:true
    })
}