require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose');
const PORT = 5000
const MONGOURI = process.env.MONGOURI
const User = require('./models/user');
const authRoutes = require('./routes/auth');
// require("dotenv").config(); //yeh zaroori hai
// require('dotenv').config({ path: 'ENV_FILENAME' });


const connect = async () => {
    try {
        const connection = await mongoose.connect(MONGOURI, {
            useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false
        })
        console.log('DB-Connected');
    } catch (error) {
        console.log('err', error);
    }
}
connect();

app.use(bodyParser.json())
app.use(authRoutes)



//
app.listen(PORT, () => {
    console.log("server has started")
})











// mongoose.connection.on('connected',()=>{ 
//     console.log('connected to mongo yeahh')
// })
// mongoose.connection.on('error',(err)=>{
//     console.log('err', err);
// })