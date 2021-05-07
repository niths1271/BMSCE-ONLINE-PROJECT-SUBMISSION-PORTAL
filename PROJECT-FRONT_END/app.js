
require('dotenv').config()
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mysql = require('mysql');
const { body, validationResult } = require('express-validator');

const app=express();
const port=3000;

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database:"OnlineProjectSubmissionPortal",
    multipleStatements:true,
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");


app.get("/",function(req,res){
    res.render("index");
});

app.get("/login_or_signup",function(req,res){
    res.render("login");
});

app.post("/login",function(req,res){
    const email=req.body.email;
    const password=req.body.password;
    console.log(req);
    console.log(password);
});

app.post("/signup",
[
    body('usn')
     .notEmpty(),
     body('semail')
     .exists()
     .isEmail()
     .normalizeEmail()
     .custom(async email => {
        const value = await isEmailInUse(email);
        if (value) {
            throw new Error('Email is already exists!!!');
        }
    })
    .withMessage('Invalid Email Address!!!'),
     body('spassword')
    .exists()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
    .escape()
    .trim()
    .withMessage('Invalid password!!!'),
body('cPassword').exists().custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('The passwords is not same!!!');
    }    
    return true;
  })
],
function(req,res){   
    const errors = validationResult(req);
if(errors){
    console.log(errors);
    // res.render("login",{errors:errors});
}
    const usn=req.body.usn;
    const email=req.body.semail;
    const password=req.body.spassword;
});
















app.listen(port,function(){
    console.log("Server started Successfully");
});