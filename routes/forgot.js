const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const nodemailer = require('nodemailer');

/* GET home page. */
router.post('/', function(req, res, next) {
    res.render('forgot');
});

router.post('/send', function(req, res, next){
    
    const email = req.body["email"];

    // check if email exists in db if no send "No account associated with this e-mail"
    // note email cant be empty from the defined html button

    MongoClient.connect("mongodb://localhost:27017/", {useNewUrlParser: true}, function(dbErr, client){
    
        if(dbErr) throw dbErr;

        const users = client.db("kingdomino").collection("users");

        users.find({"email":email}).toArray(function (err, results) {

            // no account with this e-mail
            if(!results[0]) res.render("forgot", {noaccount:true, email:email});

            // send account credentials to email
            else{

                const uname = results[0]["username"];
                const upass = results[0]["password"];

                // create reusable transporter object with smtp
                var transporter = nodemailer.createTransport('smtps://nickdomino1256%40gmail.com:nickdomino1@smtp.gmail.com');

                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: '<nickdomino>', // sender address
                    to: email, // receiver address
                    subject: 'Account Credentials', // Subject line
                    
                    // html body
                    html: `<p> 
                                <b> The account credentials associated with this e-mail are as follows: </b> <br> <br>

                                Account: ` + uname + ` <br>
                                Password: ` + upass + ` <br> <br>

                                Thank you, <br>
                                NickDomino
                                
                        </p>` 
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, function(sendErr, info){});
                res.render("start");
            }
        })
    })

});

module.exports = router;