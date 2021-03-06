var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var util = require('../config/util.js');
var User = mongoose.model('User');
var Game = mongoose.model('Game');
var ObjectId = mongoose.Types.ObjectId;

var router = express.Router();


router.get('/', function(req, res) {
   Game.find({status: 'waiting'}, function(err, games) {
        var errorMessage = req.flash('errorMessage');
        res.render('partials/index', {
             title: 'Codenames',
             games: games,
             errorMessage: errorMessage,
             user: req.user,
             isHomePage: true
       });
    });
});


router.get('/home', function(req, res) {
  Game.find( { $or:[
                  {status: 'started'},
                  {status: 'waiting'}
                ]},
  function(err, games) {
       var errorMessage = req.flash('errorMessage');
       res.render('partials/home', {
            title: 'Codenames',
            games: games,
            errorMessage: errorMessage,
            user: req.user,
            isHomePage: true
      });
   });
});

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('errorMessage', '1Ti sei disconnesso con successo');
    res.redirect('/');
});


module.exports = router;
