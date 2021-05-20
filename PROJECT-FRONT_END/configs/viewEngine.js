const express = require("express");

let configViewEngine = (app)=> {
    app.use(express.static("public"));
    app.set("view engine", "ejs");
};

module.exports.configViewEngine = configViewEngine;