const connection = require("../configs/connection");
const mysql = require('mysql2');
const express = require('express');
const { result } = require("lodash");
const router = express.Router();

router.get("/viewreport",function(req,res){
  if (req.isAuthenticated() && req.user.ROLE==="TEACHER"){
  connection.query(`SELECT T.TEACHER_ID,T.NAME,T.EMAIL,P.PROJECT_TITLE,P.PROJECT_ID,P.MEMBERS_NO FROM TEACHER_DETAILS T,PROJECT_DETAILS P WHERE T.TEACHER_ID=P.TEACHER_ID AND T.USER_ID='${req.user.id}';`,function(err,result1){
    if(err){
      console.log(err);
    }else{
      //console.log(result1);
      var namesObj=[];
      var docsObj=[];
<<<<<<< Updated upstream
=======
      function getFinal(){
        return new Promise(function(resolve,reject){
           result1.forEach((result, index)=>{
>>>>>>> Stashed changes
        function names(){
          return new Promise(function(resolve,reject){
            result1.forEach((result)=>{
            const query1=`SELECT PROJECT_ID,NAME FROM STUDENT_DETAILS WHERE PROJECT_ID='${result.PROJECT_ID}';`;
            connection.query(query1,function(err,result2){
              if(err){
                console.log(err);
              }else{   
<<<<<<< Updated upstream
                console.log(result2);
                namesObj.push(result2);
=======
                //console.log(result2);
                resolve(result2);
>>>>>>> Stashed changes
              }
            });
          });
             resolve(namesObj);
          });      
      }
      function docs(){
        return new Promise(function(resolve,reject){
          result1.forEach((result)=>{
          const query2=`SELECT D.LINK,D.STATUS FROM DOCUMENTS D WHERE PROJECT_ID='${result.PROJECT_ID}'`;
          connection.query(query2,function(err,result2){
            if(err){
              console.log(err);
            }else{   
<<<<<<< Updated upstream
              console.log(result2[0]);
              docsObj.push(result2[0]);
=======
              //console.log(result2[0]);
              resolve(result2[0]);
>>>>>>> Stashed changes
            }
          });
        });
        resolve(docsobj);
        });      
    }
<<<<<<< HEAD
    
      console.log(namesObj);
      console.log(docsObj); 
=======
    names().then((name)=>{
      //namesObj.push(name);
      docs().then((doc)=>{
      docsObj.push([...name, doc, {TITLE:result1.PROJECT_TITLE}]);
      //console.log("z",docsObj); 
      console.log("holaaaa",index, " ", result1.length );
      if(index==result1.length-1){
        console.log("loop done");
        resolve();
      }
    });
    });
    
      // namesObj.push(await names());
      // docsObj.push(await docs());
       
       
    
    
      });
<<<<<<< Updated upstream
      console.log("z",namesObj);
      console.log("z",docsObj); 
>>>>>>> 526e03d4befa608b5bccb6d23e7bffdf26c73129
      res.render("treport",{tname:result1[0].NAME,temail:result1[0].EMAIL});
=======
          
        });
      }
      getFinal().then(()=>{
        console.log("got", docsObj);
        res.render("treport",{tname:result1[0].NAME,temail:result1[0].EMAIL, values:docsObj});
      });
     
     // console.log("z",namesObj);
      
      
>>>>>>> Stashed changes
    }
  });
  }else{
    res.redirect("/teacheruser/login");
  }
});

module.exports = router;
