const router=require('express').Router;
const orderSchema=require('../models/order');
const dressSchema=require('../models/dress.model');
const moment=require('moment');
const res = require('express/lib/response');
const { isError } = require('joi');

router.post('/orderDress',async (req,res)=>{
    try{
        const orderDress= await new orderSchema(req.body);
        const result = orderDress.save();
        console.log(result)
        return res.status.json({'status':'sucess', 'message':'ordered','result':result}
        )
    }catch(err){
        console.log(err.message);
        return res.status(404).json({'status':'failled','message':err.message})
    }

})

module.exports= router;

