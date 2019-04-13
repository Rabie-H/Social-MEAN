const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config/database');
const User = require('../models/user.model');

const router = express.Router();

// Register
router.post('/register', (req, res, next) => {
    let newUser = User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    User.addUser(newUser, (err,user) => {
        if(err){
            res.json({success: false, message: "An Error occured while signing up"});
        }else {
            res.json({success: true, message: "Signed Up Successfully"});
        }
    });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({
                success: false, 
                message: 'User Not Found'
            });
    }

    User.verifyPassword(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
            const token = jwt.sign(user.toJSON(), config.secret, {
                expiresIn: 604800
            });
            res.json({success: true, 
                token: 'Bearer '+token, user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username
            }
        });

        }else{
            return res.json({success: false, message: 'Please Check Your Password'});
        }
    });
   });
});

// Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({user: req.user})
})


module.exports = router;