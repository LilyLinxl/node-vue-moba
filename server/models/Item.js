const mongoose = require('mongoose')

const schema = new mongoose.Schema({//模型
    name:{type:String},
    icon:{type:String}
})

module.exports = mongoose.model('Item',schema)