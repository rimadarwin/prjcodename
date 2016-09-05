var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var util = require('../config/util.js');
var User = mongoose.model('User');
var Game = mongoose.model('Game');
var ObjectId = mongoose.Types.ObjectId;

var router = express.Router();


/*
router.post('/matchJoin', function(req, res, next) {

    var id_group = req.body.id_group;
    var id_user = req.body.id_user;
    var id_match = req.body.id_match;
    var name_user = req.body.name_user;
    var alias_user = req.body.alias_user;

    Match.findByIdAndUpdate(id_match,
        { $inc: {'num_users': 1},
          $push: {"users": { ref_user: id_user, name: name_user, alias: alias_user, score: 0}}},
        { safe: true, upsert: true},
    function(err, match) {
            if (err) {
                next(err);
            } else {
                User.update(
                    {_id: ObjectId(id_user), "matches": {$elemMatch: {ref_match : ObjectId(id_match)}}},
                    { $set : {'matches.$.status': 'joined'}},
                    {safe:true, upsert:true},
                function (err, user){
                        if (err) {
                            next(err);
                        } else {
                            User.update(
                                {"matches": {$elemMatch: {ref_match : ObjectId(id_match)}}},
                                { $inc : {'matches.$.num_users': 1}},
                                {safe:true, upsert:true, multi:true},
                            function (err, user){
                                    if (err) {
                                        next(err);
                                    } else {
                                        Group.findById(id_group, function(err, group) {
                                              if (err) {
                                                  next(err);
                                              } else {
                                                req.user = user;
                                                req.group = group;
                                                req.flash('successMessage', 'Succesfully joined ' + match.name + ' match!');
                                                return res.redirect('/group/' + id_group);
                                              }
                                        });
                                    }
                            });
                        }
                  });
            }
     });

});

router.get('/matchJoin/:id', function(req, res) {
    var errors = req.flash('errorMessage');
    var errorMessage = '';
    if (errors.length) {
        errorMessage = errors[0];
    }
    var id_match = req.params.id;
    Match.findById(id_match,
    function(err, match) {
        if(err) {
            next(err);
        }
        if (match == null){
            res.status(404).end();
        } else {
            res.render('partials/matchJoin', {
               title: 'Binko - New Match',
               match: match,
               user: req.user,
               errorMessage: errorMessage,
               isMatchJoinPage: true
           });
        }
    });

});


router.post('/matchMod', function(req, res, next) {

    var id_group = req.body.id_group;
    var id_user = req.body.id_user;
    var id_match = req.body.id_match;
    var name_user = req.body.name_user;
    var alias_user = req.body.alias_user;
    var status = req.body.status;

    Match.findByIdAndUpdate(id_match,
        { $set: {'status': status}},
        { safe: true, upsert: true},
    function(err, match) {
            if (err) {
                next(err);
            } else {
                User.update(
                    {"matches": {$elemMatch: {ref_match : ObjectId(id_match)}}},
                    { $set : {'matches.$.status': status}},
                    {safe:true, upsert:true},
                function (err, user){
                      if (err) {
                          next(err);
                      } else {
                          Group.findById(id_group, function(err, group) {
                                if (err) {
                                    next(err);
                                } else {
                                  req.user = user;
                                  req.group = group;
                                  req.flash('successMessage', 'Succesfully change ' + match.name + ' match status!');
                                  return res.redirect('/group/' + id_group);
                                }
                          });
                      }
                  });
            }
     });

});

router.get('/matchMod/:id', function(req, res) {
    var errors = req.flash('errorMessage');
    var errorMessage = '';
    if (errors.length) {
        errorMessage = errors[0];
    }
    var id_match = req.params.id;
    Match.findById(id_match,
    function(err, match) {
        if(err) {
            next(err);
        }
        if (match == null){
            res.status(404).end();
        } else {
            res.render('partials/matchMod', {
               title: 'Binko - Update Match',
               match: match,
               user: req.user,
               errorMessage: errorMessage
           });
        }
    });

});

router.post('/matchNew', function(req, res) {
    var id_profile = req.body.profile;
    var match_name = req.body.name;
    var id_group = req.body.id_group;

    Profile.findById(id_profile,
    function(err, profile) {
        if(err) {
            //res.status(500).end();
            next(err);
        }
        if (profile == null){
            res.status(404).end();
        } else {
            var u = new Match({ ref_group: ObjectId(id_group), name: match_name, id_creator: req.user._id, alias_creator: req.user.alias,
              words: profile.words, num_user: 1, status: 'creato', "profiles": [{ ref_profile: ObjectId(id_profile), name: profile.name}],
              "users": [{ ref_user: req.user._id, name: req.user.name, alias: req.user.alias, score: 0}] });
            u.save(function (err, match) {
                if (err) {
                    next(err);
                } else {
                  Group.findByIdAndUpdate(id_group,
                      { $inc: {'tot_match': 1}},
                      { safe: true, upsert: true},
                  function(err, group) {
                          if (err) {
                              next(err);
                          } else {
                            if (group == null){
                                res.status(404).end();
                            } else {
                                User.findByIdAndUpdate(req.user._id,
                                  { $push: {"matches": { ref_match: match._id, ref_group: id_group, num_users: 1, name: match_name, profile: profile.name, score: 0, status: 'creato', id_creator: req.user._id}}},
                                  { safe: true, upsert: true},
                                function(err, user) {
                                    if(err) {
                                        next(err);
                                    }
                                    if (user == null){
                                        res.status(404).end();
                                    } else {
                                      User.update(
                                          {_id: ObjectId(req.user._id), "groups": {$elemMatch: {ref_group : ObjectId(id_group)}}},
                                          { $inc : {'groups.$.tot_match': 1}},
                                          {safe:true, upsert:true},
                                      function (err, user2){
                                            if(err) {
                                                next(err);
                                            }
                                            if (user == null){
                                                res.status(404).end();
                                            } else {
                                              req.flash('successMessage', 'Succesfully created ' + match_name + " match!");
                                              res.render('partials/group', {
                                                 title: 'Binko - Group Detail',
                                                 group: group,
                                                 user: user,
                                                 successMessage: req.flash('successMessage'),
                                                 isGroupPage: true
                                              });
                                            }
                                      });
                                    }
                                });
                            }
                          }
                  });
                }
            });
        }
      });
});

router.get('/matchNew/:id', function(req, res) {
    var errors = req.flash('errorMessage');
    var errorMessage = '';
    if (errors.length) {
        errorMessage = errors[0];
    }
    var id_group = req.params.id;
    Group.findById(id_group,
    function(err, group) {
        if(err) {
            next(err);
        }
        if (group == null){
            res.status(404).end();
        } else {
            if (group.profiles.length==0){
                res.render('partials/group', {
                   title: 'Binko - Group Detail',
                   group: group,
                   user: req.user,
                   errorMessage: errorMessage,
                   isGroupPage: true
               });
            } else {
                res.render('partials/matchNew', {
                   title: 'Binko - New Match',
                   group: group,
                   user: req.user,
                   errorMessage: errorMessage,
                   isMatchNewPage: true
               });
            }
        }
    });

});

*/

module.exports = router;
