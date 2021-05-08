const express=require('express');

const router=express.Router();


//app.use('/',require('./Routes/pages'));
router.get("/",function(req,res){
    res.render("index");
});

router.get("/login_or_signup",function(req,res){
    res.render("login");
});



module.exports=router;