var express = require('express');
var mongoose = require('mongoose');

var Game = mongoose.model('Game');

var router = express.Router();

router.get('/', function(req, res) {
    //console.log('******Search******');
    var errors = req.flash('errorMessage');
    var errorMessage = '';
    if (errors.length) {
        errorMessage = errors[0];
    }
    res.render('partials/search', {
        title: 'Codenames - Match Search',
        user: req.user,
        errorMessage: errorMessage,
        isSearchPage: true
    });
});

router.post('/', function(req, res) {
    var name = req.body.name;
    //console.log('******'+name+'******');
    Game.find({name: name} ,
    function (err, games) {
        if (err) {
            next(err);
        } else {
            if (games !== null) {
                res.set('Content-Type', 'application/json');
                res.status(200);
                res.send({ games: games });
            }
        }
    });
});

/*
router.post('/', function(req, res) {
    var name = req.body.name;
    console.log('******'+name+'******');
    client.search({
        index: 'binko',
        type: 'group',
        body: {
            "query": {
                "bool": {
                    "should": [
                        { "match": { "name":  name }}
                    ]
                }
            }
        }
    }).then(function (resp) {
            var groups = resp.hits.hits;
            res.set('Content-Type', 'application/json');
            res.status(200);
            res.send({ groups: groups });
        }, function (err) {
            res.status(500);
            console.log(err);
        });
});
*/

module.exports = router;
