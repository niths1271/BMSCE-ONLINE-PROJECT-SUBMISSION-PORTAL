const connection = require("../configs/connection");
const mysql = require('mysql2');
const express = require('express');
const router = express.Router();

router.get("/viewreport",function(req,res){
  console.log(req.user);
  if (req.isAuthenticated() && req.user.ROLE==="TEACHER"){
  res.render("treport");
  }
});

module.exports = router;