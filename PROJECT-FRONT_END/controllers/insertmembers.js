const connection = require("../configs/connection");
const mysql = require('mysql2');

module.exports = function(result, members,req,res) {
    switch (members) {
        case 4:
            var post4 = {
                PROJECT_ID: result[0].PROJECT_ID,
                NAME: req.body.name4,
                USN: req.body.usn4,
                EMAIL: req.body.e4,
                PHONE_NO: req.body.phone4,
            };
            var query = connection.query('INSERT INTO STUDENT_DETAILS SET ?', post4, function(error) {
                if (error) {
                    console.log(error);
                    //break;
                } else {
                    console.log("Successfully Inserted DETAILS OF MEMBER 4");
                }
            });
        case 3:
            var post3 = {
                PROJECT_ID: result[0].PROJECT_ID,
                NAME: req.body.name3,
                USN: req.body.usn3,
                EMAIL: req.body.e3,
                PHONE_NO: req.body.phone3,
            };
            var query = connection.query('INSERT INTO STUDENT_DETAILS SET ?', post3, function(error) {
                if (error) {
                    console.log(error);
                    //break;
                } else {
                    console.log("Successfully Inserted DETAILS OF MEMBER 3");
                }
            });
        case 2:
            var post2 = {
                PROJECT_ID: result[0].PROJECT_ID,
                NAME: req.body.name2,
                USN: req.body.usn2,
                EMAIL: req.body.e2,
                PHONE_NO: req.body.phone2,
            };
            var query = connection.query('INSERT INTO STUDENT_DETAILS SET ?', post2, function(error) {
                if (error) {
                    console.log(error);
                    //break;
                } else {
                    console.log("Successfully Inserted DETAILS OF MEMBER 2");
                }
            });
        case 1:
            var post1 = {
                PROJECT_ID: result[0].PROJECT_ID,
                NAME: req.body.name1,
                USN: req.body.usn1,
                EMAIL: req.body.e1,
                PHONE_NO: req.body.phone1,
            };
            var query = connection.query('INSERT INTO STUDENT_DETAILS SET ?', post1, function(error) {
                if (error) {
                    console.log(error);
                    //break;
                } else {
                    console.log("Successfully Inserted DETAILS OF MEMBER 1");
                }
            });
            res.redirect("/student/report");
    }
};