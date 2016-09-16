var id_game = "";

var socket = null; //io(); //('http://localhost:3000/match/'+id_game);

/*
function notifyTyping() {
  var user = $('#user').val();
  //console.log("notifyTyping: "+user);
  socket.emit('notifyUser', user);
}
*/
function endGame(team,opposite){
  //console.log("endGame");
  var squadra = "";
  var g = $("#game-details")
  g.attr("data-numero",numero);
  g.attr("data-status","finished");
  var m = $('#messages2');
  if (opposite)
    squadra = (team==1)?"Rossa":"Blu";
  else
    squadra = (team==0)?"Rossa":"Blu";
  m.append('<li><b>Vince la squadra ' + squadra + '!</b></li>');
  $("#buttonFatto").attr("disabled",true);
  setTimeout(function(){
    //m.scrollTop(m.outerHeight()+m.offset().top);
    m.scrollTop(10000);
  }, 200);
};

function grid(){
  var b = [];
  for (i=0;i<5;i++){
    for (j=0;j<5;j++){
      //var bordo = $('.row-'+i+'col-'+j).children('.game-card').attr("data-color"); non funziona
      var bordo = $('.row-'+i+'col-'+j+' .game-row .game-card').attr("data-color");
      //console.log(bordo);
      if (bordo!=null && bordo!='undefined' && bordo!=''){
        var obj = {};
        //console.log(i+","+j);
        obj.row=i;
        obj.col=j;
        obj.color=bordo;
        b.push(obj);
      }
    }
  }
  return b;
}

function azzera(team){
  //console.log("azzera");
  //g.attr("data-numero","0");
  $("#buttonFatto").attr("disabled",true);
}

function nextTeam(team){
  //console.log("nextTeam");
  var g = $("#game-details");
  nextteam = "0";
  if (team=="0"){
    nextteam = "1";
  }

  var turn = "0-" + nextteam + "-0";
  g.attr("data-turn",turn);
  var m = $('#messages2');
  var stringa = "<li>La mano passa alla squadra ";
  if (nextteam=="0"){
    stringa = stringa + "<b style='color:#e0676b'>Rossa</b> ";
  } else {
    stringa = stringa + "<b style='color:#67a7e0'>Blu</b> ";
  }
  stringa = stringa + "</li>";

  m.append(stringa);
  setTimeout(function(){
    //m.scrollTop(m.outerHeight()+m.offset().top);
    m.scrollTop(10000);
  }, 200);

  if (g.attr("data-team")==team){
    if (g.attr("data-rule")=="1"){
      //console.log("disabled Fatto");
      // disabilita il bottone fatto per tutti gli agenti di quel team
      $("#buttonFatto").attr("disabled",true);
    }
  } else {
    // abilita il bottone per inviare l'indizio al master dell'altro team
    if (g.attr("data-rule")=="0"){
      //console.log("enabled Indizio");
      //$("#indizio_button").removeAttr("disabled");
      $("#buttonIndizio").attr("disabled",false);
      $("#indizio").attr("disabled",false);
      $("#numero").attr("disabled",false);
    }
  }
}

// cambia colore bordo col colore del team di appartenenza
$('.game-card').on('click', function() {
  //console.log("click card");
  var g = $('#game-details');
  status = g.attr('data-status');
  rule = g.attr('data-rule');
  //console.log(status == "started");
  //console.log(rule == "1");
  //console.log($("#buttonFatto").attr("disabled") != "disabled");
  if (status == "started" && rule == "1" && $("#buttonFatto").attr("disabled") != "disabled"){
    team = g.attr('data-team');
    //console.log('team: '+team);
    numero = g.attr('data-numero');
    scorer = g.attr('data-scoreR');
    scoreb = g.attr('data-scoreB');
    var risultato = 0;

    row = $(this).attr('data-row');
    col = $(this).attr('data-col');
    owner = $(this).attr('data-owner');
    word = $(this).text();
    //$(this).attr('data-color').val =  team;
    if (owner==3){
      risultato = 2;
    } else if (owner==2 || team!=owner){
      risultato = 1;
    } else {
      risultato = 0;
    }

    $(this).attr("data-color", team);
    $(this).parents('.border-').removeClass('border-').addClass('border-' + team); //colorare il bordo
    $(this).parents('.color-4').removeClass('color-4').addClass('color-' + owner); // colorare il tassello
    socket.emit('updateSet', row,col,(Number(numero)-1),risultato,team,owner,word,scorer,scoreb); // turn 1-team-numero
  }
});

$('#buttonStart').on('click', function() {
  //console.log("click");
  var details = $('#game-details');
  starter = details.attr('data-starter');
  sender = details.attr('data-user');
  $("#buttonStart").css("display","none");
  socket.emit('startGame', starter, sender); // turn 0-starter-0
});

$('#buttonForce').on('click', function() {
  //console.log("click force");
  var g = $('#game-details');
  team = g.attr('data-team');
  rule = g.attr('data-rule');
  turn = rule+"-"+team+"-4";
  g.attr('data-turn',turn);
  g.attr('data-numero',"4");
});

$('#buttonReset').on('click', function() {
  //console.log("click force");
  socket.emit('resetGame');
});

$('#buttonIndizio').on('click', function() {
  //console.log("buttonIndizio click");
  var team = $('#team').val();
  var indizio = $('#indizio').val();
  var numero = $('#numero').val();
  //var g = $('#game-details');
  //g.attr("data-indizio",indizio);
  //g.attr("data-numero",numero);
  // disabilita pulsante submit form indizio
  $('#numero').val('');
  $('#indizio').val('').focus();
  $("#buttonIndizio").attr("disabled",true);
  $("#indizio").attr("disabled",true);
  $("#numero").attr("disabled",true);
  socket.emit('startSet',indizio,numero,team); // turn 1-team-numero+1
});

$('#buttonFatto').on('click', function() {
  //console.log("buttonFatto click");
  var g = $('#game-details');
  team = g.attr('data-team');
  //console.log("nextTeam for click");
  //nextTeam(team);
  socket.emit('nextTeam', team); // turn 0-oppteam-0
});

$( document ).ready(function() {

    img1 = $('div.caption1 img');
    img1.on('click', function(){
      if (img1.attr('src')=='/img/offbutton.png'){
        img1.attr('src','/img/onbutton.png')
      } else {
        img1.attr('src','/img/offbutton.png')
      }
      $(this).closest('div.module1').find('div.body1').toggle('slow', function(){
         $(this).closest('div.module1').toggleClass('rolledup',$(this).is(':hidden'));
       });
       setTimeout(function(){
         //$('#messages1').scrollTop($('#messages1').outerHeight()+$('#messages1').offset().top);
         $('#messages1').scrollTop(10000);
       }, 200);
    });

    img2 = $('div.caption2 img');
    img2.on('click', function(){
      if (img2.attr('src')=='/img/offbutton.png'){
           img2.attr('src','/img/onbutton.png')
      } else {
           img2.attr('src','/img/offbutton.png')
      }
      $(this).closest('div.module2').find('div.body2').toggle('slow', function(){
            $(this).closest('div.module2').toggleClass('rolledup',$(this).is(':hidden'));
      });
      setTimeout(function(){
        //$('#messages2').scrollTop($('#messages2').outerHeight()+$('#messages2').offset().top);
        $('#messages2').scrollTop(10000);
      }, 200);
    });

    /*
     * When the user is logged in, it's name is loaded in the "data" attribute of the "#loggedUser" element.
     * This name is then passed to the socket connection handshake query
     */

    var time_out=500;//mezzo secondo
    if($("#game-details").length) {
        id_game = $("#game-details").attr("data-id");
    } else {
        id_game = "";
    }

    // socket used for real time games
    //socket = io('http://localhost:3000/match/'+id_game);



    /*
     * Show error message on login failure
     */
    if ($("#loginError").length && !$("#loginError").is(':empty')) {

        Messenger({
            extraClasses: 'messenger-fixed messenger-on-right messenger-on-top'
        }).post({
            message: $("#loginError").html(),
            type: 'error',
            showCloseButton: true,
            hideAfter: 3
        });
    }

    /*
     * Show message on error
     */
    if ($("#errorMessage").length && !$("#errorMessage").is(':empty')) {
        var tipo = ($("#errorMessage").html().substring(0,1)=='1')?'success':'error';

        Messenger({
            extraClasses: 'messenger-fixed messenger-on-right messenger-on-top'
        }).post({
            message: $("#errorMessage").html().substring(1),
            type: tipo,
            showCloseButton: true,
            hideAfter: 3
        });
    }

    /*
     * Game page
     */
    if ($("#game-details").length) {
        var elem = $("#game-details");
        var room = elem.attr('data-id');
        var name = elem.attr('data-user');
        var emit = elem.attr('data-emit');
        var ready = elem.attr('data-ready');
        var status = elem.attr('data-status');
        var rule = elem.attr('data-rule');
        var team = elem.attr('data-team');
        //console.log("******************dentro game page");

        socket = io({ query: "user="+name });

        if (emit=="true"){
          elem.attr('data-emit','false');
          if (rule=="0"){
            $("#buttonIndizio").attr("disabled",true);
            $("#indizio").attr("disabled",true);
            $("#numero").attr("disabled",true);
          } else {
            $("#buttonFatto").attr("disabled",true);
            //console.log("attrDisable: " + $("#buttonFatto").attr("disabled"));
          }
          //console.log(name + ' id: '+ $("#game-details").attr('data-sid'));
          socket.emit('addClients');
          socket.emit('registerGame',$("#game-details").attr('data-sid'),room);
          socket.emit('updateTeam',rule, team, name);
          socket.emit('updateReadyState', ready);
          socket.emit('chatMessage', 'System', '2','<b>' + name + '</b> si è unito alla partita');
        }
        //console.log("id_game: "+id_game);

        $('#form1').on('submit', function (ev) {
            //console.log("submitfunction1");
            var g = $("#game-details");
            var team = g.attr("data-team");
            //var color = (team == 0) ? '#e0676b' : '#67a7e0';
            var from = $('#user').val();
            var message = $('#m').val();
            if(message != '') {
              //console.log("emit "+message+" from "+from);
              socket.emit('chatMessage', from, team, message);
            }
            $('#m').val('').focus();
            return false;
        });

        socket.on('chatMessage', function(from, team, msg){
          //console.log("into client chatMessage");
          //var me = $('#user').val();
          //var team = $('#team').val();
          var color = (team == 0) ? '#e0676b' : (team == 1) ? '#67a7e0' : '#000';
          var align = (team == 1) ? 'left' : 'right';
          /*
          if (team=="1")
            $(".module1").css("text-align","left");
          else
            $(".module1").css("text-align","right");
            */
          //console.log(me + " vs. " + from);
          //color = (from == me) ? 'green' : (team == 0) ? '#e0676b' : '#67a7e0';
          //color = (team == 0) ? '#e0676b' : '#67a7e0';
          //if (from=='System')
            //color = '#000010'
          //var from = (from == me) ? 'Me' : from;
          var m = $('#messages1');
          /*
          if (from=='System'){
            setTimeout(function(){
              m.append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg + '</li>');
              //m.scrollTop(m.outerHeight()+m.offset().top);
              m.scrollTop(10000);
            }, 200);
          } else {
            m.append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg + '</li>');
            //m.scrollTop(m.outerHeight()+m.offset().top);
            m.scrollTop(10000);
          }
          */
          setTimeout(function(){
            m.append('<li><div style="text-align:' + align + '"><b style="color:' + color + '">' + from + '</b>: ' + msg + '</div></li>');
            //m.scrollTop(m.outerHeight()+m.offset().top);
            m.scrollTop(10000);
          }, 200);
        });

        socket.on('registerGame', function(sid,id){
          //console.log("into client registerGame");
          var m1 = $('#messages1').html();
          var m2 = $('#messages2').html();
          var scoreR = $('#game-details').attr("data-scoreR");
          var scoreB = $('#game-details').attr("data-scoreB");
          var turn = $('#game-details').attr("data-turn");
          //console.log(turn);
          //var b = $('.game-board').html();
          var b = grid();
          socket.emit('updateGame',sid,m1,m2,b,scoreR,scoreB,turn);
        });

        socket.on('saveGame', function(){
          console.log("into client saveGame");
          var m1 = $('#messages1').html();
          var m2 = $('#messages2').html();
          var scoreR = $('#game-details').attr("data-scoreR");
          var scoreB = $('#game-details').attr("data-scoreB");
          var turn = $('#game-details').attr("data-turn");
          var status = $('#game-details').attr("data-status");
          //var id = $('#game-details').attr("data-id");
          //var b = $('.game-board').html();
          var b = grid();
          socket.emit('updateDb',room,"",status,m1,m2,b,scoreR,scoreB,turn);
        });

        socket.on('updateGame', function(sid,m1,m2,b,scoreR,scoreB,turn){
          //console.log("into client updateGame");
          var g = $("#game-details");
          $('#messages1').html(m1); //update chat
          $('#messages2').html(m2); //update chat indizi
          g.attr("data-scoreR",scoreR);
          g.attr("data-scoreB",scoreB);
          g.attr("data-turn",turn);
          $("#scorer").html(scoreR);
          $("#scoreb").html(scoreB);
          //abilita pulsanti
          if (turn!=null && turn!='undefined'){
            arr = turn.split("-");
            //console.log(arr);

            if (g.attr("data-team")==arr[1]){
              //console.log("team "+arr[1]);
              if (g.attr("data-rule")=="1"){
                 if (g.attr("data-rule")==arr[0]){
                //console.log("disabled Fatto");
                // disabilita il bottone fatto per tutti gli agenti di quel team
                  $("#buttonFatto").attr("disabled",false);
                } else {
                  $("#buttonFatto").attr("disabled",true);
                }
                //console.log("disable fatto");
              } else {
                if (g.attr("data-rule")==arr[0]){
                //console.log("disable indizio");
                  $("#buttonIndizio").attr("disabled",false);
                  $("#indizio").attr("disabled",false);
                  $("#numero").attr("disabled",false);
                } else {
                  $("#buttonIndizio").attr("disabled",true);
                  $("#indizio").attr("disabled",true);
                  $("#numero").attr("disabled",true);
                }
                //console.log("disable indizio");
              }
            } else {
              if (g.attr("data-rule")=="1"){
                $("#buttonFatto").attr("disabled",true);
              } else {
                $("#buttonIndizio").attr("disabled",true);
                $("#indizio").attr("disabled",true);
                $("#numero").attr("disabled",true);
              }
            }
          }
          // update board
          //console.log(b);
          if (b!=null && b.length>0){
            for (i=0;i<b.length;i++){
              obj = b[i];
              var r = $('.row-'+obj.row+'col-'+obj.col);
              $('.row-'+obj.row+'col-'+obj.col+' .game-row .game-card').attr("data-color",obj.color);
              r.removeClass('border-').addClass('border-' + obj.color);
              if (g.attr("data-rule")=="1"){
                r.children('.color-4').removeClass('color-4').addClass('color-' + $('.row-'+obj.row+'col-'+obj.col+' .game-row .game-card').attr("data-owner")); // colorare il tassello
              }
            }
          }
        });

        socket.on('notifyUser', function(user){
          //console.log("notifyUser");
          var me = $('#user').val();
          if(user != me) {
            $('#notifyUser1').text(user + ' is typing ...');
          }
          setTimeout(function(){ $('#notifyUser1').text(''); }, 200);
        });

        socket.on('updateSid', function(sid){
          //console.log("updateSid: " + sid);
          var g = $("#game-details");
          g.attr("data-sid",sid);
        });

        socket.on('updateReadyState', function(r){
          //console.log("updateReadyState: " + r);
          var g = $("#game-details");
          var creator = g.attr("data-creator");
          var user = g.attr("data-user");
          var status = g.attr("data-status");
          g.attr("data-ready",r);
          if (status=="waiting" && r=="1" && user==creator){
            //$("#start_button").removeAttr("disabled");
            $("#buttonStart").css("display","block");
          }
        });

        socket.on('updateTeam', function(rule,color,user){
          //console.log("updateTeam: " + color);
          var changed = "";
          if (color == "0")
            changed = $("#teamr").html();
          else
            changed = $("#teamb").html();

          if (rule=='0'){
            toadd = '<b>' + user + '</b>';
            //console.log(changed.indexOf(toadd));
            if (changed.indexOf(toadd)<0){
              if (changed == ''){
                changed = toadd;
              } else {
                changed = changed + ', ' + toadd;
              }
            }
          } else {
            if (changed.indexOf(user)<0){
              if (changed == ''){
                changed = user ;
              } else {
                changed = changed + ', ' + user;
              }
            }
          }
          if (color == "0")
            $("#teamr").html(changed);
          else
            $("#teamb").html(changed);
        });

        socket.on('startGame', function(starter,sender){
          //console.log("startGame");
          var g = $("#game-details");
          g.attr("data-status","started");
          scoreb = scorer = 8;
          if (starter=="0")
            scorer = scorer + 1;
          else
            scoreb = scoreb + 1;

          g.attr("data-scoreR",scorer);
          g.attr("data-scoreB",scoreb);
          $("#scorer").html(scorer);
          $("#scoreb").html(scoreb);
          if (g.attr("data-team")==starter && g.attr("data-rule")=="0"){
            //console.log("sblocca");
            $("#buttonIndizio").attr("disabled",false);
            $("#indizio").attr("disabled",false);
            $("#numero").attr("disabled",false);
          }

          var m = $('#messages2');
          var stringa = "<li>Inizia la partita!</li>";
          stringa = stringa + "<li>La squadra ";
          if (starter=="0"){
            stringa = stringa + "<b style='color:#e0676b'>Rossa</b> inizia la mano ";
          } else {
            stringa = stringa + "<b style='color:#67a7e0'>Blu</b> inizia la mano ";
          }
          stringa = stringa + "</li>";
          m.append(stringa);
          setTimeout(function(){
            //m.scrollTop(m.outerHeight()+m.offset().top);
            m.scrollTop(10000);
          }, 200);

          var turn = "0-" + starter + "-0";
          g.attr("data-turn",turn);
          b=[];
          var user = g.attr("data-user");
          //console.log(user);
          //console.log(sender);
          if (user==sender){
            //console.log("into if");

            socket.emit('updateDb',room,"","started",$('#messages1').html(),m.html(),b,scorer,scoreb,turn);
          }
            //$("#indizio_button").removeAttr("disabled");
        });

        socket.on('startSet', function(indizio,numero,team){
          //console.log("startSet");
          var color = (team == 0) ? '#e0676b' : '#67a7e0';
          var g = $("#game-details");
          g.attr("data-indizio",indizio);
          g.attr("data-numero",(Number(numero)+1));
          //console.log("1) tentativi a disposizione: "+g.attr("data-numero"));
          if (g.attr("data-team")==team){
            // abilita il bottone fatto per tutti gli agenti di quel team
            $("#buttonFatto").attr("disabled",false);
          }
          var m = $('#messages2');
          m.append('<li><b style="color:' + color + '">' + indizio + ' - ' + numero + ':</b> </li>');
          setTimeout(function(){
            //m.scrollTop(m.outerHeight()+m.offset().top);
            m.scrollTop(10000);
          }, 200);
          var turn = "1-" + team + "-"+(Number(numero)+1);
          g.attr("data-turn",turn);
        });

        socket.on('updateSet', function(row,col,numero,risultato,team,owner,word,scorer,scoreb){
          //console.log(row + ',' + col + ',' + numero + ',' + risultato + ',' + team + ',' + owner + ',' + word + ',' + scorer + ',' + scoreb);
          var colore = (owner == 0) ? '#e0676b' : (owner == 1) ? '#67a7e0' : (owner == 2) ? '#e0dd67' : '#000016';
          var g = $("#game-details")
          var rule = g.attr("data-rule");
          var creator = g.attr("data-creator");
          var user = g.attr("data-user");
          g.attr("data-numero",numero);
          //console.log("2) tentativi a disposizione: "+g.attr("data-numero"));
          if (owner==0)
            scorer = scorer - 1;
          if (owner==1)
            scoreb = scoreb - 1;

          g.attr("data-scoreR",scorer);
          g.attr("data-scoreB",scoreb);
          $("#scorer").html(scorer);
          $("#scoreb").html(scoreb);
          var m = $('#messages2');
          var stringa = "<li><b style='color:" + colore + "'>&emsp;" + word + "</b>";
          if (risultato>0){
            stringa = stringa + " (errore) ";
          } else {
            stringa = stringa + " (ok) ";
          }
          stringa = stringa + "</li>";
          m.append(stringa);
          setTimeout(function(){
            //m.scrollTop(m.outerHeight()+m.offset().top);
            m.scrollTop(10000);
          }, 200);

          var turn = "1-" + team + "-"+numero;
          g.attr("data-turn",turn);
          $('.row-'+row+'col-'+col).removeClass('border-').addClass('border-' + team); //colorare il bordo
          //$('.row-'+row+'col-'+col).children('.game-card').attr("data-color", team); //non funziona
          $('.row-'+row+'col-'+col+' .game-row .game-card').attr("data-color", team); //memorizza il team nei dati del tassello

          if (rule=="1"){
            $('.row-'+row+'col-'+col).children('.color-4').removeClass('color-4').addClass('color-' + owner); // colorare il tassello
          }
          if (risultato == 0){
            if (scorer==0 || scoreb==0){
              //socket.emit('endGame', team, false);
              endGame(team, false);
              if (user==creator)
                socket.emit('updateDb', room, team, "finished", $('#messages1').html(), m.html(), grid(), scorer, scoreb, g.attr("data-turn"));
            } else if (numero == 0) {
              //console.log("nextTeam for ending step");
              //socket.emit("nextTeam",team);
              nextTeam(team);
            }
          } else {
            if (risultato==2){
              //socket.emit('endGame', team, true);
              endGame(team, true);
              if (user==creator)
                socket.emit('updateDb', room, (team=="1")?"0":"1", "finished", $('#messages1').html(), m.html(), grid(), scorer, scoreb, g.attr("data-turn"));
            } else {
              //console.log("nextTeam for yellow card");
              //socket.emit("nextTeam",team);
              nextTeam(team);
            }
          }
        });

        socket.on('endGame', function(team,opposite){
          //console.log("endGame");
          var squadra = "";
          var g = $("#game-details")
          g.attr("data-numero",numero);
          var m = $('#messages2');
          if (opposite)
            squadra = (team==1)?"Rossa":"Blu";
          else
            squadra = (team==0)?"Rossa":"Blu";
          m.append('<li><b>Vince la squadra ' + squadra + '!</b></li>');
          $("#buttonFatto").attr("disabled",true);
          setTimeout(function(){
            //m.scrollTop(m.outerHeight()+m.offset().top);
            m.scrollTop(10000);
          }, 200);
        });

        socket.on('nextTeam', function(team){
          nextTeam(team);
        });

    }

});
