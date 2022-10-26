const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const http = require("http");
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

var userTasks = [];

app.get("/", function(req, res){

    var date = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    var day = date.toLocaleDateString("en-US", options);
    var dayOptions ={weekday: "long"}
    var dayOfWeek = date.toLocaleDateString("en-US", dayOptions);

    res.render("list", {day: day, kindOfDay: dayOfWeek, userTasks: userTasks});

});

app.post("/", function(req, res) {
    var userTask = req.body.taskInput;
    userTasks.push(userTask);
    res.redirect("/");
})

app.listen(3000, function(req, res){
    console.log("Server is running on port 3000.")
});