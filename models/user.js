var mongoose = require('mongoose')
	, Schema = mongoose.Schema;
var util = require('../config/util.js');

var UserSchema = mongoose.Schema({
    name: String,
    alias: String,
    password: String,
    photo: String,
    lastConnection: { type: Date, default: Date.now },
    games: [{
    		 ref_game: { type: Schema.ObjectId, ref: 'Game' }
    		 }
    		]
});

UserSchema.methods = {

    authenticate: function (plainText) {
        return util.encrypt(plainText) == this.password;
    }

};

mongoose.model('User', UserSchema);
