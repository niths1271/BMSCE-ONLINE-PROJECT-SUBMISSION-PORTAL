const express = require("express");
const connection = require("../configs/connection");
const bcrypt = require('bcrypt');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const saltRounds = 10;
router.get("/signup", function(req, res) {
    res.render("signup", { errors: req.flash("errors") });
});

router.get("/login", function(req, res) {
    res.render("login", { loginerrors: req.flash("loginMessage"), signupmessage: req.flash("signupsuccessful") });
});








router.post("/signup", [
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
                        res.redirect("/suser/login");
                    }
                });
            });
        }
    });



router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        connection.query(`SELECT PROJECT_ID FROM PROJECT_DETAILS WHERE USER_ID = ${req.user.id};`, function(error, result) {
            if (!error) {
                if (result.length == 0) {
                    res.redirect('/suser/login');
                } else {
                    res.redirect("/");
                }
            } else {
                console.log(error);
            }
        });
    });



module.exports = router;