const mongoose =require("mongoose");
const crypto = require ("crypto");

const dressSchema = new mongoose.Schema({
    uuid:{type:String, required:false},
    dressBrand:{type:String, required:true},
    dressCategory:{type:String,required:true},
    dressSize:{type:String,required:true},
    dressColors:{type:String,required:true},
    dressPrice:{type:String, required:true},
    expiredDate:{type:String,required:true},
    dressImage: {type: String, required: true},
    active: {type: Boolean, required: false, default: true},
    userUuid: {type: String, required: true},
    categoryUuid:{type: String, required:true}
},{
    timestamps: true
    })

dressSchema.pre("save",function(next){
    this.uuid='dress'+crypto.pseudoRandomBytes(5).toString('hex').toUpperCase()
    console.log(this.uuid);
    next();
})
module.exports=mongoose.model("dress",dressSchema);

