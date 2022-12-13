const mongoose =require('mongoose');
const crypto =require('crypto');
const { string } = require('joi');

const orderSchema =new mongoose.Schema({
    uuid:{type:String, required:false},
    orderNo:{type:String, required:true},
    dressName:{type:String, required:true},
    address:{type:String, required:true},
    landmark:{type:String, required:true},
    pincode:{type:String, required:true},
    phoneNumber:{type:String,reqired:true},
    order:{type:Boolean, required: false, default: true},
    dressUuid:{type:String, required:true},
},
{ timestamps:true
})

orderSchema.pre("save",function(next){
    this.uuid='dress'+crypto.pseudoRandomBytes(5).toString('hex').toUpperCase()
    console.log(this.uuid);
    next();
})
module.exports=mongoose.model("order",orderSchema);
