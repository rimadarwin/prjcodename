var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var util = require('../config/util.js');
var User = mongoose.model('User');

var router = express.Router();

router.get('/', function(req, res) {
    var errors = req.flash('errorMessage');
    var errorMessage = '';
    if (errors.length) {
        errorMessage = errors[0];
    }

    res.render('partials/register', {
        title: 'Codenames - Register',
        errorMessage: errorMessage,
        isLoginPage: true
    });
});

router.post('/', function(req, res, next) {

    var photo = req.body.photo;
    var name = req.body.name;
    var alias = req.body.alias;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;

    User.findOne({alias: alias} ,function (err, user) {
        if (user !== null) {
            req.flash('registerStatus', false);
            req.flash('errorMessage', '0We have already an account with email: ' + email);
            res.redirect('/register');
        } else { // no user found
            if(password === confirmPassword) {
                var u = new User({ name: name, photo: photo, alias: alias, password: util.encrypt(password) });
                u.save(function (err) {
                    if (err) {
                        next(err);
                    } else {
                        console.log('new user:' + u);
                        req.login(u, function(err) {
                            if (err) { return next(err); }
                            req.flash('registerStatus', true);
                            req.flash('errorMessage', '1Welcome ' + u.name + "!");
                            return res.redirect('/home');
                        });
                    }
                });
            } else {
                req.flash('registerStatus', false);
                req.flash('errorMessage', '0The confirmation password does not match the password');
                res.redirect('/register');
            }
        }
    });
});

module.exports = router;
