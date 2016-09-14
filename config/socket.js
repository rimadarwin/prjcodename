module.exports = function (server) {

    var io = require('socket.io').listen(server);
    var mongoose = require('mongoose');
    var Game = mongoose.model('Game');

    /*
     * Socket IO event handlers
     */
    var clients = [];

    io.sockets.on('connection', function (socket) {
      //console.log("server socket connection: " + socket.id);

            //io.sockets.connected[socket.id].emit --> ad un socket.id specifico
            //io.emit --> a tutti, me compreso
            //socket.broadcast.emit --> a tutti eccetto me
            //socket.emit --> a chi mi ha chiamato

            socket.on('addClients', function(){
              //console.log("into addClients");
              clients.push(socket);
              /*
              for (i=0;i<clients.length;i++){
                console.log("a" + i + ") " + clients[i].handshake.query.user);
              }
              console.log("into server updateSid: " + socket.id);
              */
              io.sockets.connected[socket.id].emit('updateSid',socket.id);
            });

            socket.on('chatMessage', function(from, msg){
              //console.log("into server chatMessage by " + from);
        	    io.emit('chatMessage', from, msg);
        	  });

            socket.on('disconnect', function(user_id){
              //console.log("into server disconnect:"+socket.handshake.query.user);
              //console.log(socket);
              var i = clients.indexOf(socket);
              clients.splice(i, 1);
              /*
              console.log(clients.length);
              for (j=0;j<clients.length;j++){
                console.log(j+ ") " + clients[j].handshake.query.user);
              }
              */
              if (clients.length && clients.length>0){
                socket.broadcast.emit('chatMessage', 'System', '<b>' + socket.handshake.query.user + '</b> si è scollegato dalla partita');
              }
              if (clients.length && clients.length==1){
                io.sockets.connected[clients[0].id].emit('saveGame');
              }
            });

            socket.on('endGame', function(team,opposite){
              //console.log("into server endGame");
              io.emit('endGame', team,opposite);
            });

            socket.on('nextTeam', function(team){
              //console.log("into server nextTeam " + team);
              io.emit('nextTeam', team);
            });

        	  socket.on('notifyUser', function(user){
              //console.log("into server notifyUser " + user);
        	    io.emit('notifyUser', user);
        	  });

            socket.on('registerGame', function(sid, id_game){
              //console.log("into server registerGame from " + sid);
              //console.log("Clients " + clients.length);
              //console.log("registerGame by " + clients[0].id);
              var newsid = "";
              if (sid==null || sid=='undefined' || sid==''){
                newsid = clients[clients.length-1].id;
              } else {
                newsid = sid;
              }
              //console.log("newsid is " + newsid);
              if (clients.length==1){
                //console.log("prestep");
                var obj = [];
                readData(newsid, id_game, clients[0].id, io);
                //console.log("postep");
              } else {
                io.sockets.connected[clients[0].id].emit('registerGame',newsid);
              }
        	  });

            socket.on('resetGame', function(){
              resetGame();
            });

            socket.on('startGame', function(starter,sender){
              //console.log("into server startGame " + starter);
              // salvataggio su database dello status della partita
              io.emit('startGame', starter,sender);
            });

            socket.on('startSet', function(indizio,numero,team){
              //console.log("into server startSet " + indizio + " " + numero + " : " + team);
              io.emit('startSet', indizio,numero,team);
            });

            socket.on('updateDb', function(id,winner,status,m1,m2,b,scoreR,scoreB,turn){
              //console.log("into server updateDb");
              updateDb(id,winner,status,m1,m2,b,scoreR,scoreB,turn);
            });

            socket.on('updateGame', function(sid,m1,m2,board,scoreR,scoreB,turn){
              //console.log("into server updateGame from " + sid);
              var newsid = "";
              if (sid==null || sid=='undefined' || sid==''){
                newsid = clients[clients.length-1].id;
              } else {
                newsid = sid;
              }
              //console.log("newsid is " + newsid);
              //socket.broadcast.to(sid).emit('updateGame', sid,m1,m2,b);
              //eliminata la memorizzazione della chat
              io.sockets.connected[sid].emit('updateGame', newsid,'',m2,board,scoreR,scoreB,turn);
        	  });

            socket.on('updateReadyState', function(ready){
              //console.log("into server updateReadyState " + ready);
        	    io.emit('updateReadyState', ready);
        	  });

            socket.on('updateSet', function(row,col,numero,risultato,team,owner,word,scorer,scoreb){
              //console.log("into server updateSet " + word);
              io.emit('updateSet', row,col,numero,risultato,team,owner,word,scorer,scoreb);
            });

            socket.on('updateTeam', function(rule,color,user){
                //console.log("into server updateTeam " + user);
                socket.broadcast.emit('updateTeam', rule,color,user);
              });

    });

    function getPlayerName(room, side) {
        var game = games[room];
        for (var p in game.players) {
            var player = game.players[p];
            if (player.side === side) {
                return player.name;
            }
        }
    }


    function updateDb(id_game,winner,status,m1,m2,b,scoreR,scoreB,turn){
      //console.log('into updateDb: '+id_game+','+status+','+m1+','+m2+','+b+','+scoreR+','+scoreB+','+turn);
      Game.findByIdAndUpdate(id_game,
          { $set: {'status':status, 'winner': winner, 'chat': m1, 'clues': m2, 'scoreR': scoreR, 'scoreB': scoreB, 'turn': turn, 'grid': b}},
          { safe: true, upsert: true},
      function(err, game) {
              if (err) {
                  next(err);
              } else {
                console.log('updateDb success!');
              }
        });
    }

    function readData(newsid,id_game,id_socket,io){
      console.log('into readData: '+id_game);
      Game.findById(id_game, function(err, game) {
        if(err) {
            next(err);
        } else {
          //console.log("grid: "+game.grid);
          if (game.chat!=null && game.chat!='undefined'){
            //eliminata la memorizzazione della chat
            io.sockets.connected[id_socket].emit('updateGame',newsid,'',game.clues,game.grid,game.scoreR,game.scoreB,game.turn);
          }
        }
      });
    }

    function resetGame(){
      console.log('into resetGame: ');
      Game.update({ $or: [
                      {status: 'started'},
                      {status: 'waiting'}
                    ]},
          { $set: {'status': 'finished'}},
          { safe: true, upsert: true},
      function(err, game) {
              if (err) {
                  next(err);
              } else {
                console.log('status saved on DB!');
              }
      });
    }

};
