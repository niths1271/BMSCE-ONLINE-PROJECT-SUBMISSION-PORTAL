require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mysql = require('mysql2');
const { body, validationResult } = require('express-validator');
const session = require('express-session');
const passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
const connectFlash = require("connect-flash");
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: "OnlineProjectSubmissionPortal",
    multipleStatements: true,
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// app.use(cookieParser({secret:"Our little Secret."}));
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
passport.use('local', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        connection.query(`SELECT * FROM STUDENT_USER_DETAILS WHERE EMAIL =  '${email}' ;`, function(err, rows) {
            // console.log(rows);
            // console.log(password);
            if (err)
                return done(err);
            if (!rows.length) {
                console.log(rows[0]);
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }
            bcrypt.compare(password, rows[0].PASSWORD, (err, isMatch) => {
                if (err) {
                    console.log(err);
                }
                if (isMatch) {
                    return done(null, rows[0]);
                } else {
                    // console.log(rows[0], password);
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }
            });
        });

    }));


// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    // console.log(user);
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    connection.query("select * from STUDENT_USER_DETAILS where id = " + id, function(err, rows) {
        done(err, rows[0]);
    });
});

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

app.get("/submitprojectdetails", function(req, res) {
    if (req.isAuthenticated) {
        res.render("submitprojectdetails");
    } else {
        res.redirect("/login");
    }
});

app.post("/signup", [
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
            const email = req.body.semail;
            const password = req.body.spassword;
            bcrypt.hash(password, saltRounds, function(err, hash) {
                var post = { EMAIL: email, PASSWORD: hash };
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
        // console.log(req.user);
        res.redirect('/submitprojectdetails');

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
    connection.query(`SELECT PROJECT_ID,MEMBERS_NO FROM PROJECT_DETAILS WHERE USER_ID =  '${req.user.id}' ;`, function(err,result) {
        console.log(result);
        if(err){
            console.log(err);
        }
        else{
            console.log(result[0].PROJECT_ID);
            console.log(result[0].MEMBERS_NO);
            switch(result[0].MEMBERS_NO){
                case 4:
                    var post4 = {
                        PROJECT_ID:result[0].PROJECT_ID,
                        NAME:req.body.name4,
                        USN:req.body.usn4,
                        EMAIL:req.body.e4,
                        PHONE_NO:req.body.phone4,
                    };
                    var query = connection.query('INSERT INTO STUDENT_DETAILS SET ?', post4, function(error) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Successfully Inserted DETAILS OF MEMBER 4");
                        }
                    });
                    case 3:
                        var post3 = {
                            PROJECT_ID:result[0].PROJECT_ID,
                            NAME:req.body.name3,
                            USN:req.body.usn3,
                            EMAIL:req.body.e3,
                            PHONE_NO:req.body.phone3,
                        };
                        var query = connection.query('INSERT INTO STUDENT_DETAILS SET ?', post3, function(error) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log("Successfully Inserted DETAILS OF MEMBER 3");
                            }
                        });  
                        case 2:
                            var post2 = {
                                PROJECT_ID:result[0].PROJECT_ID,
                                NAME:req.body.name2,
                                USN:req.body.usn2,
                                EMAIL:req.body.e2,
                                PHONE_NO:req.body.phone2,
                            };
                            var query = connection.query('INSERT INTO STUDENT_DETAILS SET ?', post2, function(error) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log("Successfully Inserted DETAILS OF MEMBER 2");
                                }
                            });  
                            case 1:
                                var post1 = {
                                    PROJECT_ID:result[0].PROJECT_ID,
                                    NAME:req.body.name1,
                                    USN:req.body.usn1,
                                    EMAIL:req.body.e1,
                                    PHONE_NO:req.body.phone1,
                                };
                                var query = connection.query('INSERT INTO STUDENT_DETAILS SET ?', post1, function(error) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log("Successfully Inserted DETAILS OF MEMBER 1");
                                    }
                                });    
            }
         }
});
});



app.listen(port, function() {
    console.log("Server started Successfully");
});

