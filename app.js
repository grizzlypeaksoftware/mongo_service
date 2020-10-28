var express = require("express");
var dotenv = require("dotenv").config();
var cors = require('cors');
const bodyParser = require('body-parser');
var session = require('express-session');
var model = require('./model.js');

var app = express();
app.use(bodyParser.json());

app.use(session({
	secret: process.env.SESSION_KEY,
	resave: false,
	saveUninitialized: true
  }));

app.use(cors({credentials: true, origin: true}));

// middleware that is specific to this router
app.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now());
    next();
  })
  
app.post('/query', function (req, res) {
    var collection = req.query.collection;
    var query = req.body;
    model.GetEntities(collection,query).then(function(data){res.send(data);}).then(function(err){res.send(err)});  
});
  
// get
app.get('/', function(req,res){
    var collection = req.query.collection;
    model.Get(collection, req.query.id).then(function(data){res.send(data);}).then(function(err){res.send(err)});  
});

// post
app.post('/', function (req, res) {
var obj =req.body;
var collection = req.query.collection;
model.InsertEntity(collection, obj).then(function(data){res.send(data);}).then(function(err){res.send(err)});  
});

//put
app.put('/', function(req,res){   
var collection = req.query.collection;
var id = req.query.id;

var query = { _id: 
    mongoModel.ObjectID(id)
}
var setObj = {$set:req.body}

model.Update(collection,query, setObj).then(function(data){res.send(data);}).then(function(err){res.send(err)});  
});

// delete
app.delete("/", function(req,res){  
    var collection = req.query.collection;
    model.DeleteById(collection, req.query.id).then(function(data){res.send(data);}).then(function(err){res.send(err)});  
});
  

// redirect the user to the  authorization page
app.get("/authorize", (req, res) => {
    res.send({status: false, message: "Not yet implemented", data:{}});
});

// handle the callback from the  authorization flow
app.get("/callback", (req, res) => {
    res.send({status: false, message: "Not yet implemented", data:{}});
});

app.listen(process.env.PORT, function(){
    console.log("listening on port " + process.env.PORT);
});
