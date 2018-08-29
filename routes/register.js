const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const nodemailer = require('nodemailer');

/* GET home page. */
router.post('/', function(req, res, next) {
  res.render('register', {passmismatch:false, userexists: false, emailexists:false});
});


/* GET home page. */
router.post('/signup', function(req, res, next) {
    
    const uname = req.body["username"];
    const upass = req.body["password"];
    const cpass = req.body["password2"];
    const email = req.body["email"];

    // check if passwords match
    if ( upass != cpass ) {res.render("register", {uname:uname, email:email, passmismatch : true})}
    
    // check if such username or email exists in db
    else{
        
        MongoClient.connect("mongodb://localhost:27017/", {useNewUrlParser: true}, function(dbErr, client){
            
            if (dbErr) throw dbErr;
            const users = client.db("kingdomino").collection("users");

            users.find({"username":uname}).count(function(findUserErr, usercount){
                    
                if (findUserErr) throw findUserErr;
                
                // such username exists in db, throw "Username already exists" notification
                if (usercount == 1) {res.render("register", {uname:uname, email:email, userexists:true})}
                
                // such username doesn't exist in db
                else{
                    

                    // check if there is user with that email
                    users.find({"email":email}).count(function(findEmailErr, emailcount){
                        
                        if(findEmailErr) throw findEmailErr

                        // email is already in database, throw "Email already exists" notification
                        
                        //comment for testing
                        if (emailcount) {res.render("register", {uname:uname, email:email,emailexists:true})}
                        
                        // no such username and email exist, so we can create user entry with given params
                        // and send verification email
                        
                        else{

                            // insert the entry in db
                            users.insert({"username":uname, "password": upass, "email":email}, function(insertErr, inserted){
                                
                                if(insertErr) throw insertErr
                                
                                // create reusable transporter object with smtp
                                var transporter = nodemailer.createTransport('smtps://nickdomino1256%40gmail.com:nickdomino1@smtp.gmail.com');

                                // setup e-mail data with unicode symbols
                                var mailOptions = {
                                    from: '<nickdomino>', // sender address
                                    to: email, // receiver address
                                    subject: 'E-mail verification', // Subject line
                                    
                                    // html body
                                    html: `<p> 
                                                <b> If you did not try to register with NickDomino please ignore the rest of this e-mail. </b> <br> <br>

                                                To complete your registration please check the details below and click on the verification link: <br> <br>

                                                Account: ` + uname + ` <br>
                                                Password: ` + upass + ` <br> <br>

                                                If you want to register with this credentials please click on the following link: <br>
                                                
                                                "confirm link". <br> <br>

                                                If you don't want to register with this credentials, please click here to cancel this registration: <br>
                                                "cancel link" <br> <br>

                                                Thank you, <br>
                                                NickDomino
                                                
                                        </p>` 
                                };

                                // send mail with defined transport object
                                transporter.sendMail(mailOptions, function(sendErr, info){});
                                res.send("E-mail send.")
                            })
                        } 
                    })
                }
            })
        })
    }
});

module.exports = router;
