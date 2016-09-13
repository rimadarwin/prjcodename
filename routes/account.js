var express = require('express');
var mongoose = require('mongoose');
var util = require('../config/util.js');
//var gm = require('gm').subClass({ imageMagick: true});
//var im = require('imagemagick');
var lw = require('lwip');
var router = express.Router();
var moment = require('moment');

var original = './public/uploaded/files';
var thumb = './public/uploaded/thumb';
var size = 100;

var args = [
   original,
   '-filter',
   'Triangle',
   '-define',
   'filter:support=2',
   '-thumbnail',
   size,
   '-unsharp 0.25x0.25+8+0.065',
   '-dither None',
   '-posterize 136',
   '-quality 82',
   '-define jpeg:fancy-upsampling=off',
   '-define png:compression-filter=5',
   '-define png:compression-level=9',
   '-define png:compression-strategy=1',
   '-define png:exclude-chunk=all',
   '-interlace none',
   '-colorspace sRGB',
   '-strip',
   thumb
];

/* GET user account details. */
router.get('/', function(req, res) {
  var photo = "a.jpg";
  var start = original + "/" + photo;
  console.log(start);
  var finish = thumb + "/" + photo;
  lw.open(start, function(err, image){
    console.log(err||'apri');
    if (err) throw err;
    image.scale(0.5, function(err, image){
      console.log(err||'scala');
      if (err) throw err;
      image.writeFile(finish, function(err) {
        console.log(err||'fatto');
        if (err) throw err;
      });
    });
  });
  /*
  im.convert(args, function(err, stdout, stderr) {
   // do stuff
   console.log(err||'done');
 });
 */
/*
  gm(start)
        //.crop(250,250,20,20)
        .resize(size,size)
        .write(finish, function(err){
          /*
            gm(size,size,'none')
                .fill(finish)
                .drawCircle(size/2,size/2,size/2, 0)
                .write(finish, function(err){
                  console.log(err||'done');
                });

            console.log(err||'done');
        });
*/
    res.render('partials/account', {
        title: 'Binko - Account',
        user: req.user,
        isAccountPage: true,
        lastConnection: moment(req.user.lastConnection).fromNow(),
        updateStatus: req.flash('updateStatus'),
        errorMessage: req.flash('errorMessage')
    });
});

/* Update hj user account. */
router.post('/', function(req, res) {
    var User = mongoose.model('User');
    var currentPassword = req.body.password;
    var newPassword = req.body.newPassword;
    var confirmNewPassword = req.body.confirmNewPassword;
    var hash = util.encrypt(currentPassword);
    if ( hash === req.user.password ) {
        if ( newPassword === confirmNewPassword ) {
            var newPasswordHash = util.encrypt(newPassword);
            User.findOneAndUpdate({_id: req.user._id}, { password: newPasswordHash }, {} ,function (err, user) {
                req.user = user;
                req.flash('updateStatus', true);
                req.flash('errorMessage', '1La tua password è stata aggiornata con successo');
                res.redirect('/account');
            });
        } else {
            req.flash('updateStatus', false);
            req.flash('errorMessage', '0La password di conferma non coincide con la nuova password');
            res.redirect('/account');
        }
    } else {
        req.flash('updateStatus', false);
        req.flash('errorMessage', '0La password attuale è errata');
        res.redirect('/account');
    }

});

module.exports = router;
