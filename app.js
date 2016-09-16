var fs = require('fs');
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var env = process.env.NODE_ENV || 'default';
var port = process.env.PORT || '80';
var config = require('config');

var app = express();

// configure database
require('./config/database')(app, mongoose);

// bootstrap data models
fs.readdirSync(__dirname + '/models').forEach(function (file) {
    if (~file.indexOf('.js')) require(__dirname + '/models/' + file);
});

// configure express app
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// set handelbars own functions
var hbs = require('hbs');
hbs.registerHelper("selected", function(value, option){
    if (option === value) {
        return ' selected';
    } else {
        return ''
    }
});

hbs.registerHelper("split", function(value){
	var temp = value.split("|");
	var cc = 1;
	var res = "";
	for (a in temp ) {
	    var ad2 = "";
	    if (cc == 1){
	     ad2 = temp[a];
	    } else {
	     ad2 = ","+temp[a];
	    }
	    cc = cc + 1;
	    res = res+ad2;
	}
	return res
});

// creator: creato -> waitProf -> started -> finish -> calculated
// utente: joined -> waitProf -> started -> finish -> calculated

hbs.registerHelper("html", function (stringa){
  return new hbs.SafeString(stringa);
});

hbs.registerHelper("colore", function (owner, rule){
  if (rule == "0")
    return owner;
  else
    return "4";
});

hbs.registerHelper("webmaster", function (name){
  console.log("name:" + name );
  if (name == "Gargo")
    return new hbs.SafeString("<input type='button' id='buttonReset' value='Reset'/>");
  else
    return new hbs.SafeString("");
});

hbs.registerHelper("buttonPartita", function (rule){
  console.log("rule:" + rule );
  if (rule == "0")
    return new hbs.SafeString("<input id='indizio' autocomplete='off' placeholder='Parola indizio...' /><input id='numero' autocomplete='off' placeholder='N°' /><input type='submit' id='buttonIndizio' value='Invia'/>");
  else
    return new hbs.SafeString("<input type='submit' id='buttonFatto' value='Fatto'/>");
});

hbs.registerHelper("riga_init", function (col){
  if (col == "0")
    return new hbs.SafeString("<tr>");
  else
    return "";
});

hbs.registerHelper("riga_end", function (col){
  if (col == "4")
    return new hbs.SafeString("</tr>");
  else
    return "";
});

hbs.registerHelper("buttonTable", function(id_user, id_creator, id_match, status){
    if (id_user.toString() == id_creator.toString()) {
    	if (status == 'creato') {
        	return new hbs.SafeString("<a href='/match/matchMod/" + id_match.toString() + "' class='btn btn-info' role='button'> Enter </a>");
    	} else if (status == 'waitingProfile') {
    		return new hbs.SafeString("<a href='/match/matchMod/" + id_match.toString() + "' class='btn btn-info' role='button'> Waiting </a>");
    	} else if (status == 'start') {
    		return new hbs.SafeString("<a href='/match/matchMod/" + id_match.toString() + "' class='btn btn-info' role='button'> Start </a>");
    	}
    } else {
    	if (status == 'creato') {
        	return new hbs.SafeString("<a href='/match/matchJoin/" + id_match.toString() + "' class='btn btn-info' role='button'> Join </a>");
    	} else if (status == 'joined') {
    		return new hbs.SafeString("<a href='/match/matchDet/" + id_match.toString() + "' class='btn btn-info' role='button'> View </a>");
    	} else if (status == 'waitingProfile') {
    		return new hbs.SafeString("<a href='/match/matchDet/" + id_match.toString() + "' class='btn btn-info' role='button'> View </a>");
    	}
    }
});

hbs.registerHelper("match4Group", function(matches, id_group){
    if (matches!=null && matches.length > 0 ) {
		for (i=0;i<matches.length;i++){
			var ref1 = matches[i].ref_group;
			if (ref1.toString() == id_group.toString()){
				return true;
			}
		}
    }
    return false;
});

hbs.registerHelper("compare", function(one, two){
    if (one!=null && one!=undefined){
    	if (two!=null && two!=undefined){
		    if (one.toString() == two.toString()) {
		    	return true;
		    }
		}
    }
    return false;
});

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('S3CRE7'));
app.use(flash());
app.use(session({ secret: 'S3CRE7-S3SSI0N', saveUninitialized: true, resave: true } ));
app.use(express.static(path.join(__dirname, 'public')));
require('./config/passport')(app, passport);
app.use(passport.initialize());
app.use(passport.session());


// configure routes
var index = require('./routes/index');
var match = require('./routes/match');
var account = require('./routes/account');
var api = require('./routes/api');
var login = require('./routes/login');
var register = require('./routes/register');
var search = require('./routes/search');

app.use('/', index);
app.use('/match', match);
app.use('/login', login);
app.use('/register', register);
app.use('/account', account);
app.use('/api', api);
app.use('/search', search);


// configure error handlers
require('./config/errorHandlers.js')(app);

// launch app server
var server = require('http').createServer(app).listen(port);

require('./config/socket.js')(server);

module.exports = app;
