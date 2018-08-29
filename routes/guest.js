const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.post('/', function(req, res, next) {

    MongoClient.connect("mongodb://localhost:27017/", {useNewUrlParser: true}, function(dbErr, client){

        if (dbErr) throw dbErr;
        else{
            guests = client.db("kingdomino").collection("guests");
            // get the id for the next guest 
            guests.find().count(function(findErr, number){

                const nextGuest = "Guest " + number;

                // log this user 
                guests.insert({"name": nextGuest}, function(insertErr, res){if(insertErr) throw insertErr});

                // redirect to success
                res.render("enter")

            })
        }
    });
});

module.exports = router;