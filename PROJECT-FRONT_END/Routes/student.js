const connection = require("../configs/connection");
const mysql = require('mysql2');
const express = require('express');
const router = express.Router();
const insertMembers = require('../controllers/insertmembers');
var uuid = require('uuid');
const { report } = require(".");

router.get("/submitprojectdetails", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("submitprojectdetails");
    } else {
        res.redirect("/suser/login");
    }
});

router.get("/report", function(req, res) {
    if (req.isAuthenticated()) {
        console.log("authenticated");
        connection.query(`SELECT PROJECT_TITLE,PROJECT_ID FROM PROJECT_DETAILS WHERE USER_ID ='${req.user.id}' ;`, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                connection.query(`SELECT LINK,TIMEOFUPLOAD,STATUS FROM DOCUMENTS WHERE PROJECT_ID ='${result[0].PROJECT_ID}';`, function(err, result1) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (result1.length > 0) {
                            res.render("report", {
                                result: result1.length,
                                pname: result[0].PROJECT_TITLE,
                                projectid: result[0].PROJECT_ID,
                                plink: result1[0].LINK,
                                time: result1[0].TIMEOFUPLOAD,
                                status: result1[0].STATUS
                            });
                        } else {
                            res.render("report", {
                                result: result1.length,
                                pname: result[0].PROJECT_TITLE,
                                projectid: result[0].PROJECT_ID
                            });
                        }
                    }
                });
            }
        });
    } else {
        res.redirect("/suser/login");
    }
});



router.get("/appointment", function(req, res) {
    if (req.isAuthenticated()) {
        connection.query(`SELECT PROJECT_TITLE, PROJECT_ID FROM PROJECT_DETAILS WHERE USER_ID =  '${req.user.id}' ;`, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                const done = { pname: result[0].PROJECT_TITLE, scheduled: 0 };
                connection.query(`SELECT * FROM APPOINTMENT WHERE PROJECT_ID ='${result[0].PROJECT_ID}';`, function(error, reslt) {
                    if (error) {
                        console.log(error);
                    } else {

                        if (reslt.length > 0) {
                            console.log(reslt[0]);
                            done.scheduled = 1;
                            done.pid = reslt[0].PROJECT_ID;
                            done.sby = (reslt[0].SCHEDULED_BY_ADMIN === 0) ? "student" : "admin";
                            done.type = reslt[0].TYPEOFAPP;
                            done.date = reslt[0].ADATE;
                            done.approval = reslt[0].APPROVAL;

                        }
                        res.render("appointment", done);

                    }
                });


            }
        });
    } else {
        res.redirect("/suser/login");
    }

});

router.get("/psub", function(req, res){
    if(req.isAuthenticated()){
        connection.query(`SELECT PROJECT_TITLE, PROJECT_ID FROM PROJECT_DETAILS WHERE USER_ID =  '${req.user.id}' ;`, function(err, result){
            if (err) {
                console.log(err);

            } else{
                var send = {pname: result[0].PROJECT_TITLE, submitted : 0};
                
                  connection.query(`SELECT * FROM PROJECTS WHERE PROJECT_ID ='${result[0].PROJECT_ID}';`, function(error, reslt) {
                    if (error) {
                        console.log(error);
                    } else {

                        if (reslt.length > 0) {
                            console.log(reslt[0]);
                            send.pid = reslt[0].PROJECT_ID;
                            send.submitted = 1;
                            send.link = reslt[0].LINK;
                            send.status= reslt[0].STATUS;
                            send.structure= reslt[0].STRUCTURE;
                            send.date= reslt[0].PDATE;

                        }
                        res.render("psub", send);

                    }
                });

            } 
        });
    }else{
        res.redirect("/suser/login");
    }
});


router.get("/grades", function(req, res){
    if(req.isAuthenticated()){
        connection.query(`SELECT PROJECT_TITLE,PROJECT_ID FROM PROJECT_DETAILS WHERE USER_ID =  '${req.user.id}' ;`, function(err, result){
            if (err) {
                console.log(err);
            } else{              
                connection.query(`SELECT S.NAME,S.STUD_ID FROM GRADES G,STUDENT_DETAILS S WHERE G.STUDENT_ID=S.STUD_ID ;`, function(err, result1){
                    if (err) {
                        console.log(err);
                    } else{                   
                        console.log(result1);                
                            res.render("pregrades",{pname:result[0].PROJECT_TITLE,res:result1});                                        
                    }
        });
    }
});
    }
    else{
        res.redirect("/suser/login");
    }
});



router.post('/submitprojectdetails', function(req, res) {
    console.log(req.body);
    console.log(req.user);
    let i = 1;
    var post = {
        USER_ID: req.user.id,
        PROJECT_TITLE: req.body.projectitle,
        MEMBERS_NO: req.body.dropdown2,
        SECTION: req.body.dropdown1,
    };
    var query = connection.query('INSERT INTO PROJECT_DETAILS SET ?', post, function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            console.log("Successfully Inserted Project Details of the New Team");
            res.render("submitteamdetails", { members: req.body.dropdown2, });
        }
    });
});

router.post('/submitteamdetails', function(req, res) {
    console.log(req.body);
    connection.query(`SELECT PROJECT_ID,MEMBERS_NO FROM PROJECT_DETAILS WHERE USER_ID =  '${req.user.id}' ;`, function(err, result) {
        console.log(result);
        if (err) {
            console.log(err);
        } else {
            console.log(result[0].PROJECT_ID);
            console.log(result[0].MEMBERS_NO);
            insertMembers(result, result[0].MEMBERS_NO, req, res);
        }
    });
});

router.post('/report', function(req, res) {
    let file = req.files.myFile
    console.log(file);
    var uuidname = uuid.v1(); // this is used for unique file name
    var filesrc = 'http://127.0.0.1:3000/docs/' + uuidname + file.name;
    connection.query(`SELECT PROJECT_ID FROM PROJECT_DETAILS WHERE USER_ID =  '${req.user.id}' ;`, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            var date = new Date().toLocaleDateString()+new Date().toLocaleTimeString();
            var insertData = {
                PROJECT_ID: result[0].PROJECT_ID,
                TYPE: "Report",
                LINK: filesrc,
                TIMEOFUPLOAD: date,
            };
            connection.query('INSERT INTO DOCUMENTS SET ?', insertData, (err) => {
                if (err) throw err
                else {
                    file.mv('public/docs/' + uuidname + file.name);
                    console.log("Inserted Successfully");
                    res.redirect("/student/report");
                }
            });
        }
    });
});

router.post("/appointment", function(req, res) {
    console.log(req.body);
    connection.query(`SELECT PROJECT_ID FROM PROJECT_DETAILS WHERE USER_ID =  '${req.user.id}' ;`, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            var type = (req.body.appointment == 1) ? "presentation" : "doubt clarification";
            var date = req.body.appointmenttime;
            var insertData = {
                PROJECT_ID: result[0].PROJECT_ID,
                TYPEOFAPP: type,
                ADATE: date.substring(0, 10) + " " + date.substring(11, 16) + ":00",
                // APPROVAL: "PENDING..",
                SCHEDULED_BY_ADMIN: 0
            };
            console.log(insertData);
            connection.query('INSERT INTO APPOINTMENT SET ?', insertData, (err) => {
                if (err) throw err
                else {
                    console.log("Inserted Successfully");
                    res.redirect("/student/appointment");
                }
            });
        }
    });

});

router.post("/psub", function(req, res){
    connection.query(`SELECT PROJECT_ID FROM PROJECT_DETAILS WHERE USER_ID =  '${req.user.id}' ;`, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            var d = new Date();
            var date = d.getFullYear()+"-"+ (d.getMonth()+1) +"-"+d.getDate();
            var insertData = {
                PROJECT_ID: result[0].PROJECT_ID,
                LINK:req.body.link,
                PDATE: date,
                STRUCTURE: req.body.structure
            };
            console.log(insertData);
            connection.query('INSERT INTO PROJECTS SET ?', insertData, (error) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log("Inserted Successfully");
                    res.redirect("/student/psub");
                }
            });
        }
    });
});

router.post("/grades",function(req,res){
    const query=`SELECT HTML,JAVASCRIPT,CSS,REPORT,ORALCOMMUNICATION,
                (HTML+JAVASCRIPT+CSS+REPORT+ORALCOMMUNICATION) AS TOTAL_CIE,
                TOTAL_SEE FROM GRADES WHERE STUDENT_ID ='${req.body.memberid}';`;
    connection.query(query,function(err, result) {
        if(err){
            console.log(err);
        }
        else{
            console.log(result);
            const googleChartArray=[
                ['Task', 'Marks per Criteria'],
                ['HTML',result[0].HTML],
                ['CSS',result[0].CSS],
                ['JAVASCRIPT',result[0].JAVASCRIPT],
                ['Report',result[0].REPORT],
                ['ORALCOMMUNICATION',result[0].ORALCOMMUNICATION]
            ]
         const totalMarks=result[0].TOTAL_CIE+result[0].TOTAL_SEE;
           res.render("grades",{dataArray:JSON.stringify(googleChartArray),
                                cie:result[0].TOTAL_CIE*2,
                                see:result[0].TOTAL_SEE*2,
                                total:totalMarks});
        }
    });
});

module.exports = router;