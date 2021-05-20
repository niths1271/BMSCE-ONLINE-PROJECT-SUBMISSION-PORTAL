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

// app.use('/',require('./Routes/pages'));

app.use("/", require("./Routes/index"));

app.use("/suser", require("./Routes/suser"));



app.listen(port, function() {
    console.log("Server started Successfully");
});