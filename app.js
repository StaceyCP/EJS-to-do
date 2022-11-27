const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const app = express();
const date = require(__dirname + ("/public/date.js"));
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemsSchema = {
    name: String
};
const Item = mongoose.model("Item", itemsSchema);

const CustomListSchema = {
    name: String,
    tasks: [itemsSchema]
}

const CustomList = mongoose.model("CustomList", CustomListSchema);

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
            res.render("list", {listTitle: "Today", date: day, year: year, userTasks: results});    
        }
    });
});

app.get("/:customListName", function(req, res) {
    const customListName = req.params.customListName;
    const customList = new CustomList({
        name: customListName,
        tasks: defaultTasks
    });
        CustomList.findOne({name: customListName}, function(err, result){
            if (!err) {
                if (!result) {
                    //Create new list
                    console.log("List does not exist");
                    customList.save();
                    res.redirect("/" + customListName);
                } else {
                    //Show existing list
                    console.log("List already exists");
                    res.render("list", {listTitle: result.name, date: day, year: year, userTasks: result.tasks});
                }
            }
        });
})

app.post("/", function(req, res){
    const taskName = req.body.taskInput;
    const listName = req.body.list;
    console.log(listName);
    const task = new Item ({
        name: taskName
    });
    if(listName === "Today"){
        task.save();
        res.redirect("/");
    } else {
        CustomList.findOne({name: listName}, function(err, result){
            result.tasks.push(task);
            result.save();
            res.redirect("/" + listName);
        })
    }

});

app.post("/delete", function(req, res) {
    const checkedTaskId = req.body.checkbox;
    const listName = req.body.listName;
    console.log(listName);
    if(listName === "Today") {
        Item.findByIdAndRemove(checkedTaskId, function(err) {
            console.log(err);
        });
        res.redirect("/");
    } else {
        CustomList.findOneAndUpdate({name: listName}, {$pull: {tasks: {_id: checkedTaskId}}}, function(err, foundList){
            if(!err) {
                res.redirect("/" + listName);
            }
        });
    }

});

app.listen(3000, function(req, res){
    console.log("Server is running on port 3000.")
});