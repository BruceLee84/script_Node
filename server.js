const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
//const envData = require('./env.json');
require('dotenv').config()
const dressRoute = require('./routes/dress.route');
const { kill } = require('nodemon/lib/monitor/run');
const userRoutes = require('./routes/user.route');
//const orderRoutes = require('./routes/order.route');

const app = express();
app.use(cors());

app.get("/healthcheck", async(req,res)=>{
    console.log("it works");
   // process.exit(1);
    res.send({status: 'Success'})
})
mongoose.connect('mongodb://localhost:27017/ecommerece', {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(data=>{
    console.log("database connected")
}).catch(err=>{
    console.log(err.message)
   process.exit(1)
})
app.use(express.json());
app.set('view engine', 'ejs');
app.use('/api/v1/dress/',dressRoute);
app.use('/api/v2/user/',userRoutes);
//app.use('/api/v3/order/',orderRoutes);

app.listen(7075, ()=>{
    console.log("server start....")
})

//http://localhost:7075
