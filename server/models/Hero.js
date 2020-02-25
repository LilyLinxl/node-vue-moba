const mongoose = require('mongoose')

const schema = new mongoose.Schema({//模型
    name:{type:String},
    avatar:{type:String},
    title:{type:String},
    categories:[{type:mongoose.SchemaTypes.ObjectId,ref:'Catrgory'}],
    scores:{
      difficult:{ type: Number },
      skills: { type: Number },
      attack: { type: Number },
      survive: { type: Number}
    },
    skills:[{
      icon: { type: String },
      name: { type: String },
      description: { type: String },
      tip: { type: String }
    }],
    items1:[{type:mongoose.SchemaTypes.ObjectId,ref: 'Item'}],
    items2:[{type:mongoose.SchemaTypes.ObjectId,ref: 'Item'}],
    usageTips: { type: String },
    battleTips: { type: String },
    teamTips: { type: String },
    partners: [{
      hero: {type:mongoose.SchemaTypes.ObjectId,ref:'Hero'},
      description: { type:String }
    }]
})

module.exports = mongoose.model('Hero',schema)