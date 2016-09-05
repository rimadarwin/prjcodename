var mongoose         = require('mongoose');
var LocalStrategy    = require('passport-local').Strategy;
var User             = mongoose.model('User');

module.exports = function (app, passport) {

    // serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({ _id: id }, function (err, user) {
            done(err, user)
        });
    });

    // use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'alias',
            passwordField: 'password'
        },
        function(alias, password, done) {

            User.findOne( { alias: alias } , function (err, user) {

                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, { message: 'This alias is not registered' });
                }

                if (!user.authenticate(password)) {
                    return done(null, false, { message: 'Invalid login or password' });
                }

                return done(null, user);
            });
        }
    ));

};
