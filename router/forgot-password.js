const express = require('express')

const router = express.Router()
var Brevo = require('@getbrevo/brevo');
//var SibApiV3Sdk = require('sib-api-v3-sdk');

require('dotenv').config()
const bcrypt = require('bcrypt')


const User = require('../models/user_model')
const resetPassword = require('../models/resetPassword')

const sequelize = require('../util/database')

router.post('/forgot-password' , async(req,res)=>{
    try{
        const email = req.body.email
        const user = await User.findOne({where : {email : email}},{
            include : [
                {model : resetPassword}
            ]
        })
        console.log(user)
        console.log(user== null)
        if(user === null)
             return res.status(404).json({success : false , msg :"Email not found"})
        var defaultClient = Brevo.ApiClient.instance;
        var apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BRAVO_API_KEY
        var apiInstance = new Brevo.TransactionalEmailsApi();
        //deoghariasonika@gmail.com
        const sender = { "email": "deoghariasonika@gmail.com"}

        const reciever = [{
            "email": req.body.email
        }]
        const link = await user.createResetPassword()

        const response = await apiInstance.sendTransacEmail({
            sender,
            to : reciever,
            subject : 'Reset password for Expense Tracker App',
            htmlContent: '<p>Click the link to reset your password</p>'+
            `<a href="http://3.25.113.52:4000/reset-password.html?reset=${link.id}">click here</a>`,
        })
        return res.json({success : true ,link})
    }catch(e){
        console.log(e)
        return res.status(500).json({success : false ,msg :"Internal server error"})
    }
})


router.post('/reset-password/:resetId' , async(req,res)=>{
    const t = await sequelize.transaction()
    try{
        const resetId = req.params.resetId;
        const newPassword = req.body.newPassword
        const confirmPassword = req.body.confirmPassword

        const resetUser = await resetPassword.findByPk(resetId)
        if(!resetUser.isActive){
            return res.status(401).json({success : false , msg:"link expired create a new one"})
        }
        if(newPassword !== confirmPassword)
        return res.status(403).json({success : false , msg:"new and confirm password are different"})
    
    const user = await resetUser.getUser()
    const hash = await bcrypt.hash(newPassword,10)

    await user.update({password : hash},{transaction :t})
    await resetUser.update({isActive : false},{transaction : t})

    await t.commit()

    return res.json({success : true , msg:"Password changed successfully"})
    }catch(e){
        console.log(e)
        await t.rollback()
        return res.status(500).json({success : false , msg : "Internal server error"})
    }
})


router.get('/check-password-link/:resetId', async(req,res)=>{
    try{
        const resetUser = await resetPassword.findByPk(req.params.resetId)
        return res.json({isActive : resetUser.isActive})
    }catch(e){
        console.log(e)
        return res.status(500).json({success : false , msg : "Internal server error"})
    }
})



module.exports = router;