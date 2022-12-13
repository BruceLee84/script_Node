const router = require("express").Router();
const crypto = require('crypto');
const bcrypt = require("bcrypt");
//const res = require("express/lib/response");
const jwt =require("jsonwebtoken");
const moment =require("moment");
const userSchema=require("../models/user.model");
const joivalidation=require('../middleware/joischema');
const { match } = require("assert");
const req = require("express/lib/request");
const mail = require("../models/email");
const {totp} = require("otplib");
const fast2sms = require('fast-two-sms');
const otp = require('../middleware/smsotp');


router.post('/signUp',async(req,res)=>{
    try {
           let userName= req.body.userName
           let email = req.body.email
           let mobileNumber= req.body.mobileNumber
           let userDetails = new userSchema(req.body)
        
           if(req.body.password){
           let password = req.body.password;
           const salt = await bcrypt.genSalt(10);
           userDetails.password = bcrypt.hashSync(password,salt); 
        }

        const result = await userDetails.save();
        return res.json({status:'success',message:'userDetails successfully added!','result':result});

    }catch(err){
            return res.json({status:'failed', message:err.message})
    }
})

// router.post('/signUp', async(req,res)=>{
//     try {


//         const userName = req.body.userName;
//         const email = req.body.email;
//         const mobileNumber = req.body.mobileNumber;
        
//         if(userName){
//             let usernameDetail = await userSchema.findOne({'userName': userName}).exec()
//             if(usernameDetail){
//                 return res.json({status: "failure", message: 'userName already exist'})
//             }
//         }else{
//             return res.status(400).json({status: "failure", message: 'Must attach the userName'})
//         }
//         if(email){
//             let useremailDetail = await userSchema.findOne({'email': email}).exec()
//             if(useremailDetail){
//                 return res.json({status: "failure", message: 'email already exist'})
//             }
//         }else{
//             return res.status(400).json({status: "failure", message: 'Must attach the email'})
//         }

//         if(mobileNumber){
//             let usermobileNumberDetail = await userSchema.findOne({'mobileNumber': mobileNumber}).exec()
//             if(usermobileNumberDetail){
//                 return res.json({status: "failure", message: 'mobileNumber already exist'})
//             }
//         }else{
//             return res.status(400).json({status: "failure", message: 'Must attach the mobileNumber'})
//         }

//         let user = new userSchema(req.body);
//            if(req.body.password){
//             let password = req.body.password;
//             let salt = await bcrypt.genSalt(10);
//             console.log("_".repeat(2))
//             user.password = bcrypt.hashSync(password, salt);
//          }
//        let result = await user.save()
//        return res.status(200).json({status: "success", message: "user details added", data: result})
//     } catch (error) {
//         console.log(error.message)
//         return res.status(500).json({status: "failure", message: error.message})
//     }
// });


router.post('/login', async(req,res)=>{
    try {
        let userName = req.body.userName;
        let password = req.body.password;
        let userDetails = await userSchema.findOne({userName: userName}).select('password').exec()

        
        if(userName){
            userDetails = await userSchema.findOne({userName: userName}).exec()
            if(!userDetails){
                return res.status(400).json({status: "failure", message: "please signup first"});
            }
        }else{
            return res.status(400).json({status: "failure", message: "Please enter the userName"})
        }
        if(userDetails){
            let isMatch = await bcrypt.compare(password, userDetails.password)
            if(userDetails!== true){
               await userSchema.findOneAndUpdate({uuid:userDetails.uuid}).exec();
            }
            //let payload = {uuid: userDetails.uuid, role: userDetails.role}
           
            if(isMatch){
                var userData = userDetails.toObject()
                console.log(userData);
                let jwttoken = jwt.sign({userName:userDetails.userName},'bala123')
                userData.jwttoken = jwttoken
                
              token = otp.otp('send')
                await userSchema.findOneAndUpdate({uuid:userDetails.uuid}, {otp: token}, {new:true}).exec() 
                var otpsms = {
                    authorization:process.env.fast2smskey,
                    message: "your otp "+token,
                    numbers:[userDetails.mobileNumber]
                };
                fast2sms.sendMessage(otpsms).then((response)=>{
                    console.log(response)
                })
                return res.json({status: "success", message: "Login successfully",userData:userData})
                }else{
                return res.json({status: "failed", message: "Login failed"})
            }
        }

    }catch(error){
        console.log(error.message)
        return res.status(500).json({status: "failed", message: error.message})
    }
  })


router.post("/logout/:uuid", async(req,res)=>{
    try {
        let date = moment().toDate();
        console.log(date)
        await userSchema.findOneAndUpdate({uuid: req.params.uuid}).exec()
        return res.status(200).json({status: "success", message: "Logout success"})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({status: "failure", message: error.message})
    }
})


router.post('/mailSender',async (req,res)=>{
    try{
        const toEmail=req.body.toEmail;
        const subject= req.body.subject;
        //const text = req.body.text;
        var mailData= {
            from:process.env.userEmail,
            to: toEmail,
            subject: subject,
            fileName:'email.ejs',
            // attachments:[
            //     {
            //         filename: 'java-procedure.pdf',
            //         filePath:"/home/Users\BALA\Downloads/java-procedure.pdf"                    
            //     }
            // ],
            details:{
                name: "bala",
                date: new Date(),
               link: "https://nodejs.org/en/"
                   }
            }
             
      let data = await mail.mailSending(mailData);
        return res.status(200).json({status:'success', message:'mail sended'})
    }catch(error){
        res.status(404).json({status:'failed', message:error.message})
    }
})


module.exports = router;


