const connection = require("../configs/connection");
const mysql = require('mysql2');
const express = require('express');
const { result, functions } = require("lodash");
const router = express.Router();

router.get("/viewreport",function(req,res){
  if (req.isAuthenticated() && req.user.ROLE==="TEACHER"){
  connection.query(`SELECT T.TEACHER_ID,T.NAME,T.EMAIL,P.PROJECT_TITLE,P.PROJECT_ID,P.MEMBERS_NO FROM TEACHER_DETAILS T,PROJECT_DETAILS P WHERE T.TEACHER_ID=P.TEACHER_ID AND T.USER_ID='${req.user.id}';`,function(err,result1){
    if(err){
      console.log(err);
    }else{
      //console.log(result1);
      var docsObj=[];
      function getFinal(){
        return new Promise(function(resolve,reject){
           result1.forEach((result, index)=>{
        function names(){
          return new Promise(function(resolve,reject){
            const query1=`SELECT PROJECT_ID,NAME FROM STUDENT_DETAILS WHERE PROJECT_ID='${result.PROJECT_ID}';`;
            connection.query(query1,function(err,result2){
              if(err){
                console.log(err);
              }else{   
                //console.log(result2);
                resolve(result2);
              }
            });
          });      
      }
      names().then(function(rows){
             namesObj.push(rows);
      }) 
      function docs(){
        return new Promise(function(resolve,reject){
          const query2=`SELECT D.LINK,D.STATUS FROM DOCUMENTS D WHERE PROJECT_ID='${result.PROJECT_ID}'`;
          connection.query(query2,function(err,result2){
            if(err){
              console.log(err);
            }else{   
              //console.log(result2[0]);
              resolve(result2[0]);
            }
          });
        });      
    }
    names().then((name)=>{
      //namesObj.push(name);
      docs().then((doc)=>{
      docsObj.push([...name, doc]);
      //console.log("z",docsObj); 
      console.log("holaaaa",index, " ", result1.length );
      if(index==result1.length-1){
        console.log("loop done");
        resolve();
      }
    });
    });    
      });        
        });
      }
      getFinal().then(()=>{
        console.log("got", docsObj);
        res.render("treport",{result:result1,values:docsObj});
      }); 
     // console.log("z",namesObj);
    }
  });
  }else{
    res.redirect("/teacheruser/login");
  }
});

router.post("/viewreport",function(req,res){
  console.log(req.body);
  connection.query(`UPDATE DOCUMENTS SET STATUS="APPROVED" WHERE PROJECT_ID='${req.body.projectId}'`,function(err,result){
    if(err){
      console.log(err);
    }else{
      console.log("Updated successfully");
      res.redirect("viewreport");
    }
  });
});

module.exports = router;
