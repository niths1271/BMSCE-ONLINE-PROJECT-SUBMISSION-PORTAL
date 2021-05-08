
require('dotenv').config()
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mysql = require('mysql');
const { body, validationResult } = require('express-validator');
const session =require('express-session');
const passport=require("passport");
// const cookieParser=require("cookie-parser");
const connectFlash=require("connect-flash");

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

// app.use(cookieParser({secret:"Our little Secret."}));

app.use(session({
    secret:"Our little Secret.",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));

app.use(connectFlash());

// app.use('/',require('./Routes/pages'));

app.get("/",function(req,res){
    res.render("index");
});

app.get("/login_or_signup",function(req,res){
    res.render("login",{errors:req.flash("errors")});
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
    .withMessage('Invalid Email Address!!!'),
body('spassword')
    .exists()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
    .escape()
    .trim()
    .withMessage('Invalid password!!!'),
body('cpassword').exists().custom((value, { req }) => {
    if (value !== req.body.spassword) {
      throw new Error('The passwords are not same!!!');
    }    
    return true;
  })
],
function(req,res){   
    const errorsArr=[];
    const validationErrors = validationResult(req);
if(!validationErrors.isEmpty()){
    const errors =Object.values(validationErrors.mapped());
    errors.forEach(function(item){
        errorsArr.push(item.msg);
    });
    console.log(errorsArr);
    req.flash("errors",errorsArr);
    res.redirect("/login_or_signup");
}else{
    const usn=req.body.usn;
    const email=req.body.semail;
    const password=req.body.spassword;
    var post  = {USN:usn,EMAIL:email,PASSWORD:password};
    var query = connection.query('INSERT INTO STUDENT_USER_DETAILS SET ?',post, function (error, results, fields) {
      if (error) {
          console.log(error);
      }else{
      console.log("Successfully inserted");
    //   console.log(results);
    //   console.log(fields);
    }});
}
});













app.listen(port,function(){
    console.log("Server started Successfully");
});