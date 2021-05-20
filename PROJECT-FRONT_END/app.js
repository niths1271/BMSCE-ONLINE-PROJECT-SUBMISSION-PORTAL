const connection = require("./configs/connection");

const passport = require("passport");

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mysql = require('mysql2');
const { body, validationResult } = require('express-validator');
const session = require('express-session');

const connectFlash = require("connect-flash");
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();
const port = 3000;

require("./controllers/passport")(passport);

//for bodyparser
app.use(bodyParser.urlencoded({ extended: true }));

//Config view engine
require("./configs/viewEngine")(app);

app.use(connectFlash());

app.use(session({
    secret: "Our little Secret.",
    cookie: {
        maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
        // cookie: { secure: true }
}));


app.use(passport.initialize());
app.use(passport.session());

//We have created a local strategy for login only!!!


// app.use('/',require('./Routes/pages'));

app.get("/", function(req, res) {
    res.render("index");
});

app.get("/signup", function(req, res) {
    res.render("signup", { errors: req.flash("errors") });
});

app.get("/login", function(req, res) {
    res.render("login", { loginerrors: req.flash("loginMessage"), signupmessage: req.flash("signupsuccessful") });
});

// app.get('/logout', function(req, res){
//     req.logout();
//     res.redirect('/');
//   });

app.get("/submitprojectdetails", function(req, res) {
    if (req.isAuthenticated) {
        res.render("submitprojectdetails");
    } else {
        res.redirect("/login");
    }
});

app.get("/report", function(req, res) {
    if (req.isAuthenticated) {
        res.render("report");
    } else {
        res.redirect("/login");
    }
})


app.post("/signup", [
        body('username')
        .exists()
        .withMessage('Invalid USERNAME'),
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
    function(req, res) {
        const errorsArr = [];
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            const errors = Object.values(validationErrors.mapped());
            errors.forEach(function(item) {
                errorsArr.push(item.msg);
            });
            console.log(errorsArr);
            req.flash("errors", errorsArr);
            res.redirect("/signup");
        } else {
            const username = req.body.username;
            const password = req.body.spassword;
            bcrypt.hash(password, saltRounds, function(err, hash) {
                var post = { USERNAME: username, PASSWORD: hash };
                var query = connection.query('INSERT INTO STUDENT_USER_DETAILS SET ?', post, function(error, results, fields) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Successfully Inserted the New User");
                        req.flash("signupsuccessful", "YOU HAVE SUCCESSFULLY REGISTERED, NOW PLEASE LOGIN WITH SAME USERNAME AND PASSWORD");
                        res.redirect("/login");
                    }
                });
            });
        }
    });



app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        connection.query(`SELECT PROJECT_ID FROM PROJECT_DETAILS WHERE USER_ID = ${req.user.id};`, function(error, result) {
            if (!error) {
                if (result.length == 0) {
                    res.redirect('/submitprojectdetails');
                } else {
                    res.redirect("/report");
                }
            } else {
                console.log(error);
            }
        });
    });

app.post('/submitprojectdetails', function(req, res) {
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

app.post('/submitteamdetails', function(req, res) {
    console.log(req.body);
    connection.query(`SELECT PROJECT_ID,MEMBERS_NO FROM PROJECT_DETAILS WHERE USER_ID =  '${req.user.id}' ;`, function(err, result) {
        console.log(result);
        if (err) {
            console.log(err);
        } else {
            console.log(result[0].PROJECT_ID);
            console.log(result[0].MEMBERS_NO);
            switch (result[0].MEMBERS_NO) {
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
                    res.redirect("/report");
            }

        }
    });
});



app.listen(port, function() {
    console.log("Server started Successfully");
});