const mongoose = require("mongoose");
const crypto = require ("crypto");

const userSchema = new mongoose.Schema({
    uuid:{type:String, require:false},
    userName:{type :String, require:true, trim:true },
    email:{type:String, require:true },
    mobileNumber:{type:String, require:true},
    password:{type:String, require: true},
    otp:{type:String,required:false}
   
   // profilePicture:{type:String, require:false},
},{

timestamps:true

})

userSchema.pre("save",function(next){
    this.uuid="user" + crypto.pseudoRandomBytes(5).toString('hex').toUpperCase()
    console.log(this.uuid);
    next();
})
module.exports=mongoose.model("user",userSchema);
