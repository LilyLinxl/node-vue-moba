const mongoose = require('mongoose')

const schema = new mongoose.Schema({//模型
    username:{type:String},
    password:{
      type:String,
      select:false,//是否查出来
      set(val){
        return require('bcrypt').hashSync(val,10)//加密等级
      }
    }
})

module.exports = mongoose.model('AdminUser',schema)