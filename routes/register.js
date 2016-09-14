var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
//var gm = require('gm').subClass({ imageMagick: true});
var util = require('../config/util.js');
var fs = require('fs.extra');
//var multer = require('multer');
var User = mongoose.model('User');

var router = express.Router();

// config the uploader
/*
var options = {
    tmpDir:  __dirname + '/../public/uploaded/tmp',
    uploadDir: __dirname + '/../public/uploaded/files',
    uploadUrl:  '/uploaded/files/',
    maxPostSize: 11000000000, // 11 GB
    minFileSize:  1,
    maxFileSize:  10000000000, // 10 GB
    acceptFileTypes:  /.+/i,
    // Files not matched by this regular expression force a download dialog,
    // to prevent executing any scripts in the context of the service domain:
    inlineFileTypes:  /\.(gif|jpe?g|png)/i,
    imageTypes:  /\.(gif|jpe?g|png)/i,
    copyImgAsThumb : true, // required
    imageVersions :{
        maxWidth : 200,
        maxHeight : 200
    },
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
        allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
    },
    storage : {
        type : 'aws'
    }
};
*/
/*
var options = {
  tmpDir: __dirname + '/../public/uploaded/thumb',
  uploadDir: __dirname + '/../public/uploaded/files',
  uploadUrl: '/uploaded/files/',
  copyImgAsThumb: true, // required
  imageVersions: {
    maxWidth: 150,
    maxHeight: 150
  },
  storage: {
    type: 'local'
  }
};

var uploader = require('blueimp-file-upload-expressjs')(options);
*/

/*
var original = './public/uploaded/files';
var thumb = './public/uploaded/thumb';
var size = 100;
var ratio = 0;


var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, original);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({storage: storage}).single('photo');
*/

router.get('/', function(req, res) {
    var errors = req.flash('errorMessage');
    var errorMessage = '';
    if (errors.length) {
        errorMessage = errors[0];
    }

    res.render('partials/register', {
        title: 'Codenames - Registra',
        errorMessage: errorMessage,
        isLoginPage: true
    });
});

router.post('/', function(req, res, next) {

    /*
    upload(req, res, function(err) {
    if(err) {
      console.log('Error Occured: '+err);
      return;
    }
    */
    /*
    uploader.post(req, res, function (obj) {
    console.log(JSON.stringify(obj));
    */
    //var photo = req.body.photo;
    //var photo = req.file.originalname;
    var def = "default.jpg";
    var name = req.body.name;
    var alias = req.body.alias;
    var photo = alias + ".jpg";
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var thumb = './public/uploaded/thumb/';

    fs.copy(thumb+def, thumb+photo, { replace: false }, function (err) {
      if (err) {
        // i.e. file already exists or can't write to directory
        throw err;
      }
      //console.log("Copied 'foo.txt' to 'bar.txt'");
    });

    User.findOne({alias: alias} ,function (err, user) {
        if (user !== null) {
            req.flash('registerStatus', false);
            req.flash('errorMessage', '0Esiste già un account con questo nome: ' + alias);
            res.redirect('/register');
        } else { // no user found
            if(password === confirmPassword) {
                var u = new User({ name: name, photo: photo, alias: alias, password: util.encrypt(password) });
                u.save(function (err) {
                    if (err) {
                        next(err);
                    } else {
                        //console.log('new user:' + u);
                        /*
                        var start = original + "/" + photo;
                        var finish = finish + "/" + photo;
                        gm(start)
                              .crop(250,250,20,20)
                              .resize(size,size)
                              .write(finish, function(){
                                  gm(size,size,'none')
                                      .fill(finish)
                                      .drawCircle(size/2,size/2,size/2, 0)
                                      .write(finish, function(err){
                                        console.log(err||'done');
                                      });
                              });
                        */
                        req.login(u, function(err) {
                            if (err) { return next(err); }
                            req.flash('registerStatus', true);
                            req.flash('errorMessage', '1Benvenuto ' + u.name + "!");
                            return res.redirect('/home');
                        });
                    }
                });
            } else {
                req.flash('registerStatus', false);
                req.flash('errorMessage', '0La password di conferma non coincide con la password');
                res.redirect('/register');
            }
        }
    });
  //});
});

module.exports = router;
