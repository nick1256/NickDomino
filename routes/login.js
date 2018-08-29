const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.post('/', function(req, res, next) {
  
  const uname = req.body["username"];
  const upass = req.body["password"];

  // check if there is a match in the database
  MongoClient.connect('mongodb://localhost:27017/', {useNewUrlParser: true}, function (err, client) {
  
    users = client.db("kingdomino").collection("users")
    
    users.find({"username":uname, "password":upass}).count(function (err, result) {
      if (err) throw err     

      // there is no match throw "Invalid credentials"
      if (result != 1) res.render("start", {uname: uname, invaliduser:true});
      
      // else log in the person
      else res.render("enter");
    })
  })
});

module.exports = router;