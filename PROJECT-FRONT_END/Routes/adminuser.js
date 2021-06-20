const express = require("express");
const connection = require("../configs/connection");
const bcrypt = require('bcrypt');
const passport = require('passport');
const validateSignup = require('../validation/validator');
const {validationResult}= require('express-validator');
const router = express.Router();
const saltRounds = 10;

router.get("/login", function(req, res) {
     res.render("adminlogin",{loginerrors: req.flash("loginMessage")});
 });


 router.post('/login',
 passport.authenticate('local', { failureRedirect: '/adminuser/login' }),
 function(req, res) {
     connection.query(`SELECT PROJECT_ID FROM PROJECT_DETAILS WHERE USER_ID = ${req.user.id};`, function(error, result) {
         if (!error) {
                 res.redirect("/admin/admindashboard");
             }
      else {
             console.log(error);
         }
     });
 });

 module.exports = router;