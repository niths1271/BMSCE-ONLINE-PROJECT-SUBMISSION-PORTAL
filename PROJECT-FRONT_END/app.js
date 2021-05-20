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
require("./controllers/passport")(passport);



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

   
 app.use('/',require('./Routes/student'));

app.listen(port, function() {
    console.log("Server started Successfully");
});