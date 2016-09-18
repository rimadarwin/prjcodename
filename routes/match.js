var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var util = require('../config/util.js');
var board = require('../public/javascripts/game.js');
var User = mongoose.model('User');
var Game = mongoose.model('Game');
var ObjectId = mongoose.Types.ObjectId;

var router = express.Router();

router.post('/matchStart', function(req, res) {
  console.log('into matchStart');
  var id_game = req.body.id_game;
  var status = 'started';
  Game.findByIdAndUpdate(id_game,
      { $set: {'status': status}},
      { safe: true, upsert: true},
  function(err, game) {
          if (err) {
              next(err);
          } else {
            console.log('status saved on DB!');
          }
    });

});

router.get('/matchNew', function(req, res) {
    var errors = req.flash('errorMessage');
    var errorMessage = '';
    if (errors.length) {
        errorMessage = errors[0];
    }
    res.render('partials/matchNew', {
        title: 'Codenames - New Match',
        errorMessage: errorMessage,
        user:req.user,
        isGroupNewPage: true
    });
});

router.post('/matchNew', function(req, res, next) {

    var name = req.body.name;
    var color = req.body.color;
    var rule = req.body.rule;

    Game.findOne({name: name},
      {$or:[{status:'waiting'},{status:'started'}]},
    function (err, game) {
        if (game !== null) {
            //req.flash('groupNewStatus', false);
            req.flash('errorMessage', '0Esiste già un gioco attivo con questo nome: ' + name);
            res.redirect('/match/matchNew');
        } else { // no game found
            /* inserire logica di creazione tabellone */
              //console.log("cartellone");
                var b = board.generateBoard();
                //console.log(b);
                var u = new Game({ name: name, id_creator: req.user._id, alias_creator: req.user.alias, starter: b[0], board: b[1], status: 'waiting', num_users: 1,
                "users": [{ ref_user: req.user._id, name: req.user.name, alias: req.user.alias, rule: rule, color: color}] });
                u.save(function (err) {
                    if (err) {
                        next(err);
                    } else {
                        User.findByIdAndUpdate(req.user._id,
                            { $push: {"games": { ref_game: u._id}}},
                            { safe: true, upsert: true},
                        function(err, user) {
                                if (err) {
                                    next(err);
                                } else {
                                    req.user = user;
                                    //req.flash('groupNewStatus', true);
                                    req.flash('errorMessage', '1Gioco creato con successo: ' + u.name);
                                    return res.redirect('/match/'+u._id);
                                }
                        });
                    }
                });
        }
    });
});


router.get('/:id', function(req, res) {
    //console.log("/:id");
    var errors = req.flash('errorMessage');
    var errorMessage = '';
    if (errors.length) {
        errorMessage = errors[0];
    }
    var id = req.params.id;
    //console.log(" user_id: "+req.user._id);
    //console.log("match_id: "+id);
    Game.findById(id, function(err, game) {
      if(err) {
          next(err);
      }
      if (game == null){
          res.status(404).end();
      } else {
          Game.aggregate([{ $match:{"_id":ObjectId(id)}},{ $unwind: "$users"},{ $match: {"users.ref_user": ObjectId(req.user._id)}}],
          //Game.findById(id,
          function(err, us) {
            //console.log("game: "+JSON.stringify(game));
              if(err) {
                  next(err);
              }
              if (us == null){
                console.log("select null");
                  res.status(404).end();
              } else {
                  var b = [];
                  b = board.updateTeam(game.users);
                  var rule = "";
                  var color = "";
                  if (us.length>0){
                      rule = us[0].users.rule;
                      color = us[0].users.color;
                      res.render('partials/game', {
                         title: 'Codenames - Game Detail',
                         game: game,
                         user: req.user,
                         team_r: b[0],
                         team_b: b[1],
                         me: us[0].users,
                         ready: b[3],
                         rule: rule,
                         my_color: color,
                         emit: true,
                         errorMessage: errorMessage,
                         isGamePage: true
                     });
                  } else {
                      res.render('partials/join', {
                         title: 'Codenames - Game Detail',
                         game: game,
                         user: req.user,
                         team_r: b[0],
                         team_b: b[1],
                         rules: b[2],
                         emit: false,
                         errorMessage: errorMessage,
                         isGamePage: true
                       });
                  }
              }
          });
        }
    });
});

router.post('/matchJoin', function(req, res, next) {
    var errors = req.flash('errorMessage');
    var errorMessage = '';
    if (errors.length) {
        errorMessage = errors[0];
    }
    var id = req.body.id;
    var def = req.body.rule;
    var rule = "";
    var color = "";
    if (def!=null && def.length>0){
      color = def.substring(0,1);
      rule = def.substring(1);
    }
    console.log(color);
    console.log(rule);

    Game.findByIdAndUpdate(id,
        { $inc: {num_users: 1},
          $push: {"users": { ref_user: req.user._id, name:  req.user.name, alias:  req.user.alias, rule: rule, color: color }}},
        { safe: true, upsert: true},
    function(err, game) {
            if (err) {
                next(err);
            } else {
              Game.aggregate([{ $match:{"_id":ObjectId(id)}},{ $unwind: "$users"},{ $match: {"users.ref_user": ObjectId(req.user._id)}}],
              //Game.findById(id,
              function(err, us) {
                //console.log("game: "+JSON.stringify(game));
                  if(err) {
                      next(err);
                  }
                  if (us == null){
                    console.log("select null");
                      res.status(404).end();
                  } else {
                    /*
                      var b = [];
                      b = board.updateTeam(game.users);
                      var rule = "";
                      var color = "";
                      rule = us[0].users.rule;
                      color = us[0].users.color;
                      req.flash('successMessage', 'Ti sei unito al gioco!');
                      res.render('partials/game', {
                         title: 'Codenames - Game Detail',
                         game: game,
                         user: req.user,
                         team_r: b[0],
                         team_b: b[1],
                         ready: b[3],
                         me: us[0].users,
                         rule: rule,
                         my_color: color,
                         emit: true,
                         errorMessage: errorMessage,
                         isGamePage: true
                     });
                     */
                     return res.redirect('/match/'+id);
                  }
              });
            }
    });
});

/*
router.post('/matchJoin', function(req, res, next) {

    var id = req.body.id;
    var rule = req.body.rule;

    Game.findById(id,
    function (err, game) {
        if (err) {
            next(err);
        } else {
            if (game !== null) {
                User.findByIdAndUpdate(req.user._id,
                    { $push: {"games": { ref_game: game._id}}},
                    { safe: true, upsert: true},
                function(err, user) {
                        if (err) {
                            next(err);
                        } else {
                            Game.findByIdAndUpdate(id,
                                { $inc: {num_user: 1},
                                  $push: {"users": { ref_user: user._id, name: user.name, alias: user.alias, color: rule.substring(0,1), rule: rule.substring(1,1)}}},
                                { safe: true, upsert: true},
                            function(err, group) {
                                if (err) {
                                    next(err);
                                } else {
                                    req.user = user;
                                    req.game = game;
                                    req.flash('groupJoinStatus', true);
                                    req.flash('successMessage', 'Succesfully join ' + game.name + " game!");
                                    return res.redirect('/match/'+game._id);
                                }
                            });
                        }
                });
            }
        }
    });
});
*/



module.exports = router;
