const mongoose = require("mongoose");
const crypto = require('crypto');

const categorySchema = new mongoose.Schema({
    uuid:{type: String, required: false},
    categoryName: {type: String, required: true, trim: true},
    categoryDesc: {type: String, required: false},
    userUuid: {type: String, required: true},
   
},
{
    timestamps: true
});



// UUID Generation Adding Method
categorySchema.pre('save', function(next){
    this.uuid = 'category' + crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()
    console.log(this.uuid);
    next();
});

module.exports=mongoose.model('category',categorySchema, 'category');