const nodemailer = require('nodemailer');
require('dotenv').config();
const ejs = require('ejs');
const {join} = require('path');
const sendGrid=require('@sendgrid/mail')

sendGrid.setApiKey(process.env.smsApikey)

const transpoter=nodemailer.createTransport({
  service:'gmail',

  auth:{
        user : process.env.userEmail,
        pass:process.env.userPassword
    }
});
async function mailSending(mailData){
    try{
        const data = await ejs.renderFile(join(__dirname,'../templete/',mailData.fileName),mailData)
        const mailDetails = {
            from:mailData.from,
            to:mailData.to,
            subject:mailData.subject,
            attachments: mailData.attachments,
            html:data
        }
         await sendGrid.send(mailDetails, (err, data)=>{
            if(err){
                console.log("err", err.message)
                
            }else{
                console.log("Mail sent successfully");
                return 1
            }
        })

    }catch(err){
        console.log(err.message);
        process.exit(1)
    }
}
module.exports={mailSending}