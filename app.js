const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const http = require("http");
const app = express();
const date = require(__dirname + ("/public/date.js"))

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

var userTasks = ["Write notes", "Organise paper"];
var workTasks = [];
let {day, year} = date();

app.get("/", function(req, res){
    res.render("list", {listTitle: day, year: year, userTasks: userTasks});
});

app.post("/", function(req, res) {
    var task = req.body.taskInput;

    if (req.body.list === "Work") {
        workTasks.push(task)
        res.redirect("/work");
    } else {
        userTasks.push(task);
        res.redirect("/");
    }
});

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work", year: year, userTasks: workTasks});
});

app.get("/about", function(req, res) {
    res.render("about", {listTitle: "About", year: year})
})

app.listen(3000, function(req, res){
    console.log("Server is running on port 3000.")
});