const {totp}=require("otplib");
require('dotenv').config();

function otp(){
    const secreatkey='otpkey'
    const token = totp.generate(secreatkey)
    console.log(secreatkey)
    console.log(token)
}
otp()

function verify(){
    const secreatkey ='otpkey'
    const token = totp.generate(secreatkey)
    console.log(secreatkey)
    console.log(token)
    const same =totp.check(token, secreatkey)

}

verify()
module.exports={otp}