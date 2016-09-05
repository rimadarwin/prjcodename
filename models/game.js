var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var GameSchema = mongoose.Schema({
    name: String,
    id_creator: Schema.ObjectId,
    alias_creator: String,
    words: String,
    starter: String,
    sequence: [String], // turno-colore_team-carta-esito, es.1-red-14-red,1-red-15-yellow,2-blue-12-black
    board: [{
        row: String,
        col: String,
        word: String,
        owner_team: String,
        color: String,
      }],
    clues: [String], //indizi es. blue-aereo-3/red-boss-2/...
    id_winner: Schema.ObjectId,
    num_users: Number,
    status: String, // waiting, started, finished
    users: [{
    		ref_user: { type: Schema.ObjectId, ref: 'User' },
    		name: String,
        alias: String,
    		rule: Number, // Es. 0 = Master, 1 = Agent
        color: Number // Es. 0 = Red, 1 = Blue
    		}]
});

mongoose.model('Game', GameSchema);
