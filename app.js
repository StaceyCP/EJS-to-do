const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const app = express();

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(3000, function(req, res){
    console.log("Server is running on port 3000.")
});