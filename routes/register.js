var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var util = require('../config/util.js');
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
  tmpDir: __dirname + '/../public/uploaded/tmp',
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

// init the uploader
var uploader = require('blueimp-file-upload-expressjs')(options);
*/


var multer = require('multer');
//var upload = multer({ dest: __dirname + '/public/uploaded/files' });
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploaded/files');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({storage: storage}).single('photo');

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
    upload(req, res, function(err) {
    if(err) {
      console.log('Error Occured: '+err);
      return;
    }
    console.log(req.file);
  //uploader.post(req, res, function (obj) {
    //res.send(JSON.stringify(obj));

    //var photo = req.body.photo;
    var photo = req.file.originalname;
    var name = req.body.name;
    var alias = req.body.alias;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;

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
                        console.log('new user:' + u);
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
  });
});

module.exports = router;
