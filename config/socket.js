module.exports = function (server) {

    var io = require('socket.io').listen(server);

    //var chess =  require('chess.js');

    /*
     * Socket IO event handlers
     */
    var clients = [];

    io.sockets.on('connection', function (socket) {
      //console.log("server socket connection: " + socket.id);
/*
      soc.on('socketMatch', function (data) {

        var room = data.room;
        var name = data.name;
        console.log("into server:"+room);
          var match = io.of('/match/'+room);
          match.on('connection', function (socket) {
*/
            //socket.emit('chatMessage', 'System', '<b>' + name + '</b> si è unito alla partita');
            socket.on('updateGame', function(sid,m1,m2,board,scoreR,scoreB){
              console.log("into server updateGame from " + sid);
              var newsid = "";
              if (sid==null || sid=='undefined' || sid==''){
                newsid = clients[clients.length-1].id;
              } else {
                newsid = sid;
              }
              console.log("newsid is " + newsid);
              //socket.broadcast.to(sid).emit('updateGame', sid,m1,m2,b);
              io.sockets.connected[sid].emit('updateGame', newsid,m1,m2,board,scoreR,scoreB);
        	  });

            socket.on('registerGame', function(sid){
              console.log("into server registerGame from " + sid);
              console.log("registerGame by " + clients[0].id);
              var newsid = "";
              if (sid==null || sid=='undefined' || sid==''){
                newsid = clients[clients.length-1].id;
              } else {
                newsid = sid;
              }
              console.log("newsid is " + newsid);
/*
              console.log("******** sid connection ********");
              console.log(io.sockets.connected[sid]);
              console.log("******** client0 connection ********");
              console.log(io.sockets.connected[clients[0].id]);
*/
              //socket.broadcast.to(clients[0]).emit('registerGame', sid);
              io.sockets.connected[clients[0].id].emit('registerGame',newsid);
        	  });

            socket.on('chatMessage', function(from, msg){
              console.log("into server chatMessage by " + from);
        	    io.emit('chatMessage', from, msg);
              if (from=="System"){
                clients.push(socket);
                for (i=0;i<clients.length;i++){
                  console.log(i + ") " + clients[i].id);
                }
                console.log("into server updateSid: " + socket.id);
                //io.emit('updateSid',socket.id);
                //socket.to(socket.id).emit('updateSid',socket.id);
                //socket.broadcast.to(socket.id).emit('updateSid',socket.id);
                //io.clients[socket.id].send('updateSid',socket.id);
                io.sockets.connected[socket.id].emit('updateSid',socket.id);
              }
        	  });
        	  socket.on('notifyUser', function(user){
              console.log("into server notifyUser " + user);
        	    io.emit('notifyUser', user);
        	  });
            socket.on('updateReadyState', function(ready){
              console.log("into server updateReadyState " + ready);
        	    io.emit('updateReadyState', ready);
        	  });
            socket.on('updateTeam', function(rule,color,user){
                console.log("into server updateTeam " + user);
                socket.broadcast.emit('updateTeam', rule,color,user);
              });
            socket.on('startGame', function(starter){
              console.log("into server startGame " + starter);
              // salvataggio su database dello status della partita
              io.emit('startGame', starter);
            });

            socket.on('nextTeam', function(team){
              console.log("into server nextTeam " + team);
              io.emit('nextTeam', team);
            });

            socket.on('startSet', function(indizio,numero,team){
              console.log("into server startSet " + indizio + " " + numero + " : " + team);
              io.emit('startSet', indizio,numero,team);
            });

            socket.on('updateSet', function(row,col,numero,risultato,team,owner,word,scorer,scoreb){
              console.log("into server updateSet " + word);
              io.emit('updateSet', row,col,numero,risultato,team,owner,word,scorer,scoreb);
            });

            socket.on('endGame', function(team,opposite){
              console.log("into server endGame");
              io.emit('endGame', team,opposite);
            });
          //});
      //});

        //var username = socket.handshake.query.user;

        //monitor.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});
/*

        /*
         * A player joins a game
         * /
        socket.on('join', function (data) {
            var room = data.token;

            // If the player is the first to join, initialize the game and players array
            if (!(room in games)) {
                var players = [{
                    socket: socket,
                    name: username,
                    status: 'joined',
                    side: data.side
                }, {
                    socket: null,
                    name: "",
                    status: 'open',
                    side: data.side === "black" ? "white" : "black"
                }];
                games[room] = {
                    room: room,
                    creator: socket,
                    status: 'waiting',
                    creationDate: Date.now(),
                    players: players
                };

                socket.join(room);
                socket.emit('wait'); // tell the game creator to wait until a opponent joins the game
                return;
            }

            var game = games[room];

            /* TODO: handle full case, a third player attempts to join the game after already 2 players has joined the game
            if (game.status === "ready") {
                socket.emit('full');
            }* /

            socket.join(room);
            game.players[1].socket = socket;
            game.players[1].name = username;
            game.players[1].status = "joined";
            game.status = "ready";
            io.sockets.to(room).emit('ready', { white: getPlayerName(room, "white"), black: getPlayerName(room, "black") });

        });

        /*
         * A player makes a new move => broadcast that move to the opponent
         * /
        socket.on('new-move', function(data) {
            socket.broadcast.to(data.token).emit('new-move', data);
        });

        /*
         * A player resigns => notify opponent, leave game room and delete the game
         * /
        socket.on('resign', function (data) {
            var room = data.token;
            if (room in games) {
                io.sockets.to(room).emit('player-resigned', {
                    'side': data.side
                });
                games[room].players[0].socket.leave(room);
                games[room].players[1].socket.leave(room);
                delete games[room];
                monitor.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});
            }
        });

        /*
         * A player disconnects => notify opponent, leave game room and delete the game
         * /
        socket.on('disconnect', function(data){
            users--;
            monitor.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});
            for (var token in games) {
                var game = games[token];
                for (var p in game.players) {
                    var player = game.players[p];
                    if (player.socket === socket) {
                        socket.broadcast.to(token).emit('opponent-disconnected');
                        delete games[token];
                        monitor.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});
                    }
                }
            }
        });
*/
    });
/*
    var match = io.of('/match');
    monitor.on('connection', function(socket){
        socket.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});
    });
*/
    /*
     * Utility function to find the player name of a given side.
     */
    function getPlayerName(room, side) {
        var game = games[room];
        for (var p in game.players) {
            var player = game.players[p];
            if (player.side === side) {
                return player.name;
            }
        }
    }

};
