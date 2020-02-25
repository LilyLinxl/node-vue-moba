const express = require('express')

const app = express()

app.use(require('cors')())//引入跨域模块
app.use(express.json())
app.use('/uploads',express.static(__dirname + '/uploads'))
require('./routes/admin')(app)//外部引入并传入app
require('./plugins/db')(app)


app.listen(3000,()=>{
    console.log('http://localhost:3000')
})