var config = require('config');

module.exports = function (app, mongoose) {

    var connect = function () {
        var options = {
            server: {
                socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 }
            },
            replset: {
                socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 }
            },
            auto_reconnect:true
        };
        mongoose.Promise = global.Promise;
        mongoose.connect(config.get('codenames.dbrem'), options);
    };
    connect();

    // Error handler
    mongoose.connection.on('error', function (err) {
        console.error('MongoDB Connection Error. Please make sure MongoDB is running. -> ' + err);
    });

    // Reconnect when closed
    mongoose.connection.on('disconnected', function () {
        connect();
    });

};
