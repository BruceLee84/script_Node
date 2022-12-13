const joi = require('joi');
const joivalidation= joi.object({
username: joi.string().pattern(new RegExp([/^[A-Za-z]+[0-9]+$/])).min(3).required(),
email:joi.string().pattern(new RegExp(/^[A-Za-z]+[0-9]+@[A-Za-z]+$/)).required,
mobilenumber:joi.string().length(10).pattern(new RegExp(/^[0-9]+$/)).required,
password:joi.string().min(8).pattern(new RegExp(/^[A-Za-z]+[0-9]+@[A-Za-z]+$/)).required()

})

module.exports={joivalidation:joivalidation};