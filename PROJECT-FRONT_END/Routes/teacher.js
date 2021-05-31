const connection = require("../configs/connection");
const mysql = require('mysql2');
const express = require('express');
const router = express.Router();

router.get("/viewreport",function(req,res){
  if (req.isAuthenticated() && req.user.ROLE==="TEACHER"){
  res.render("treport");
  }else{
    res.redirect("/teacheruser/login");
  }
});

module.exports = router;