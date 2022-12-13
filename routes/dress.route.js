const router = require('express').Router();
const dressSchema = require("../models/dress.model");
const categorySchema = require("../models/category");
const userSchema = require('../models/user.model');
const { authVerify, isAdmin } = require('../auth');
const moment = require('moment');
const res = require('express/lib/response');

router.post('/addNewDress', async(req,res)=>{
    try{
        let detail = req.body
        const data = new dressSchema(detail);
        const result = await data.save();
        return res.status(200).json({'status': 'success', "message": "details added successfully", "result": result})
    }catch(error){
        console.log(error.message);
        return res.status(404).json({"status": 'failure', 'message': error.message})
    }
});
router.get("/getAllDress", async(req,res)=>{
    try{
        const dressDetails = await dressSchema.find().skip(1).limit(4).exec();
        if(dressDetails.length > 0){
            return res.status(200).json({'status': 'success', message: "details fetched successfully", 'result': dressDetails});
        }else{
            return res.status(404).json({'status': 'failure', message: "No details available"})}
    }catch(error){
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})}
});
router.get("/getIndividualDress", async(req,res)=>{
    try {
        const dressDetails = await dressSchema.findOne({"uuid" : req.query.dress_uuid}).exec();
        if(dressDetails){
            return res.status(200).json({'status': 'success', message: "details fetched successfully", 'result': dressDetails});
        }else{
            return res.status(404).json({'status': 'failed', message: "No details available"})
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failed', 'message': error.message})
    }
});
router.put("/updateNewDress", async(req,res)=>{
    try {
        let condition = {"uuid": req.body.uuid}
        let updateData = req.body.updateData;
        let option = {new: true}
        const data = await dressSchema.findOneAndUpdate(condition, updateData, option).exec();
        return res.status(200).json({'status': 'success', message: "details updated successfully", 'result': data});
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failed', 'message': error.message})
    }
});
router.delete("/deleteDressDetail/:dress_uuid", async(req,res)=>{
    try {
        console.log(req.params.dress_uuid)
        await dressSchema.findOneAndDelete({uuid: req.params.dress_uuid}).exec();
        return res.status(200).json({'status': 'success', message: "details deleted successfully"});
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failed', 'message': error.message})
    }
})

router.get("/getAllDressOnUser/:userUuid", authVerify, async(req,res)=>{
  try{
      const dressDetails = await dressSchema.find({userUuid:req.params.userUuid}).exec();
    if(dressDetails){
        return res.status.json({'status':'success', message:"dress Details fetched",'result':dressDetails})
    }else{
        return res.status(404).json({'status':'failed',message:'No Details fetched'})

    }
}catch(error){
    console.log(error.message);
  return res.status(400).json({"status": 'failed', 'message': error.message})
}
})

router.get("/userBasedDress", async(req,res)=>{
    try {

 let dressDetails = await categorySchema.aggregate([

 {
    $match:{
         $and:[
          {"uuid":'category965659EC3A2F'},
          {"userUuid": 'user4A3F343786'}
      // {"uuid":req.query.categoryUuid},
      //{"userUuid":req.query.userUuid}

     ]
                }
             },
            {
                '$lookup':{
                    from:'dresses',
                    localField: 'uuid',
                    foreignField: 'categoryUuid',
                    as: 'dress_details'
                }
            },
            {
                "$lookup":{
                    from: 'users',
                    localField: 'userUuid',
                    foreignField: 'uuid',
                    as:'users_datas'
                }
            },
            {
                '$unwind':{
                    path:'$dersss_details',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                '$unwind':{
                    path: '$users_datas',
                    preserveNullAndEmptyArrays: true
                }
            },
            // {
            //     $project: {
            //         "_id": 0,
            //         // "categoryName": 1,
            //         // "dresses_details.dressBrand": 1,
            //         // "users_datas.username":1

            //     }
            // },  
            // {
            //    $sort:{categoryName:-1} 
            // },
            // {

            // }       
        ])

        
        if(dressDetails.length > 0){
            return res.json({'status': 'success', message: "details fetched successfully", 'result': dressDetails});
        }else{
            return res.status(404).json({'status': 'failed', message: "No details available"})
        }
    } catch (error) {
        console.log(error.message);
        return res.json({"status": 'failed', 'message': error.message})
    }
});


router.get('/createDetails',async(req,res)=>{
    try{
        let startDate = req.query.startDate
        let endDate = req.query.endDate
        var date1= moment(startDate).format('YYYY-MM-DDT00:00:00.000Z')
        var date2 =moment(endDate).format('YYYY-MM-DDT23:59:59.000Z')

        let dressDetails1 = await dressSchema.aggregate([
            {
                $match:{
                       $and:[
                        {createdAt:{
                              $gte:new Date(date1),
                              $lte:new Date(date2)
                          }
                          }]    
                       }
            },
            {
                '$lookup':{
                    from:'dresses',
                    localField: 'uuid',
                    foreignField: 'categoryUuid',
                    as: 'dress_details'
                }
            },

        ])
        if(dressDetails1.length){
            return res.json({'status': 'success', message: "details fetched successfully", 'result': dressDetails1});
        }else{
            return res.status(404).json({'status': 'failed', message: "No details available"})
        }
    } catch (error) {
        console.log(error.message);
        return res.json({"status": 'failed', 'message': error.message})
    }
    })

router.post('/addCategory', async(req,res)=>{
    try{
        const categoryDetails = new categorySchema(req.body);
        const result = await categoryDetails.save()
        return res.json({'status':'success',message:'category added'})
    }catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failed', 'message': error.message}) 
    }

})

module.exports = router;