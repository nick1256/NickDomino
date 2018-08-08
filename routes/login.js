var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.post('/', function(req, res, next) {
  
  var uname = req.body["username"];
  var upass = req.body["password"];

  console.log(uname, upass)

  // check if both have values
  if (uname != "" && upass != "") {

    // check if there is a match in the database
    MongoClient.connect('mongodb://localhost:27017/', {useNewUrlParser: true}, function (err, client) {
      
      users = client.db("kingdomino").collection("users")
      
      users.find({"username":uname, "password":upass}).count(function (err, result) {
          if (err) throw err     

          // there is a match, log in the person
          if (result == 1) res.render("success");
          
          // there is no match, try again
          else res.render("fail");

      })
    })
  }

  // either password or username is invalid, require another attemp to login
  else {res.render('fail');}

});

module.exports = router;
