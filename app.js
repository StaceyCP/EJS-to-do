const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const app = express();
const date = require(__dirname + ("/public/date.js"));
const bodyParser = require("body-parser");
const ejs = require("ejs");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemsSchema = {
    name: String
};
const Item = mongoose.model("Item", itemsSchema);

const workItemsSchema = {
    name: String
}

const WorkItem = mongoose.model("WorkItem", workItemsSchema);

const item1 = new Item({
    name: "This is today's to-do list!"
});

const item2 = new Item({
    name: "Hit the + button to add a new task!"
});

const item3 = new Item ({
    name: "Check off each completed task!"
});

const defaultTasks = [item1, item2, item3];

let {day, year} = date();

app.get("/", function(req, res){
    Item.find({}, function(err, results){
        if(results.length === 0) {
            Item.insertMany(defaultTasks, function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("Items added to DB successfully");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle: day, year: year, userTasks: results});    
        }
    });
});

app.post("/", function(req, res) {
    const taskName = req.body.taskInput;
    const task = new Item ({
        name: taskName
    });
    const workTask = new WorkItem ({
        name: taskName
    })

    if (req.body.list === "Work") {
        workTask.save();
        res.redirect("/work");
    } else {
        task.save();
        res.redirect("/");
    }
});

app.get("/work", function(req, res) {
    WorkItem.find({}, function(err, results){
        if(results.length === 0) {
            WorkItem.insertMany(defaultTasks, function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("Items added to DB successfully");
                }
            });
            res.redirect("/work");
        } else {
            res.render("list", {listTitle: "Work", year: year, userTasks: results});  
        }
    });
});

app.get("/about", function(req, res) {
    res.render("about", {listTitle: "About", year: year})
})

app.listen(3000, function(req, res){
    console.log("Server is running on port 3000.")
});