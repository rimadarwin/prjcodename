var id_game = "";

var socket = io(); //('http://localhost:3000/match/'+id_game);

function notifyTyping() {
  var user = $('#user').val();
  //console.log("notifyTyping: "+user);
  socket.emit('notifyUser', user);
}

function azzera(team){
  //console.log("azzera");
  //g.attr("data-numero","0");
  $("#buttonFatto").attr("disabled",true);
}

function nextTeam(team){
  //console.log("nextTeam");
  var g = $("#game-details");
  var m = $('#messages2');
  var stringa = "<li>La mano passa alla squadra ";
  if (team=="0"){
    stringa = stringa + "<b style='color:#e0676b'>Rossa</b> ";
  } else {
    stringa = stringa + "<b style='color:#67a7e0'>Blu</b> ";
  }
  stringa = stringa + "</li>";
  m.append(stringa);
  m.scrollTop(m.outerHeight()+m.offset().top);

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
    socket.emit('updateSet', row,col,numero-1,risultato,team,owner,word,scorer,scoreb);
  }
});

$('#buttonStart').on('click', function() {
  var details = $('#game-details');
  starter = details.attr('data-starter');
  $("#buttonStart").css("display","none");
  socket.emit('startGame', starter);
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
  socket.emit('startSet',indizio,numero,team);
});

$('#buttonFatto').on('click', function() {
  //console.log("buttonFatto click");
  var g = $('#game-details');
  team = g.attr('data-team');
  //console.log("nextTeam for click");
  nextTeam(team);
  socket.emit('nextTeam', team);
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
    });

    /*
     * When the user is logged in, it's name is loaded in the "data" attribute of the "#loggedUser" element.
     * This name is then passed to the socket connection handshake query
     */

    var time_out=300;//5 minutes in seconds
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
            hideAfter: 4
        });
    }

    /*
     * Show message on success

    if ($("#successMessage").length && !$("#successMessage").is(':empty')) {

        Messenger({
            extraClasses: 'messenger-fixed messenger-on-right messenger-on-top'
        }).post({
            message: $("#successMessage").html(),
            type: 'success',
            showCloseButton: true,
            hideAfter: 4
        });
    }
    */

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
            hideAfter: 4
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
        //var creator = elem.attr("data-creator");

        /* disabilita la chat della partita (form2) se sei un agente
        disabilita_agente(ruolo);
        */

        /* controlla status:
            se status == created && ready == 0
                disabilita click su board;
                se sei un agente:
                se sei un master: abilita pulsante inizio partita = disabled;
            se status == created && ready == 1
                se sei un master: abilita pulsante inizio partita = enabled;
            se status == started
                abilita click su board;
                esamina variabile turno;
        */



        //console.log('room: '+room);
        //console.log('user: '+name);
        /*
         * When the game page is loaded, fire a join event to join the game room

        socket.emit('socketMatch', {
            'room': room,
            'name': name
        });
        */
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
          socket.emit('chatMessage', 'System', '<b>' + name + '</b> si è unito alla partita');
          //console.log(name + ' id: '+ $("#game-details").attr('data-sid'));
          socket.emit('registerGame',$("#game-details").attr('data-sid'));
          socket.emit('updateTeam',rule, team, name);
          socket.emit('updateReadyState', ready);
        }
        //console.log("id_game: "+id_game);

        $('#form1').on('submit', function (ev) {
            //console.log("submitfunction1");
            var from = $('#user').val();
            var message = $('#m').val();
            if(message != '') {
              //console.log("emit "+message+" from "+from);
              socket.emit('chatMessage', from, message);
            }
            $('#m').val('').focus();
            return false;
        });

        socket.on('chatMessage', function(from, msg){
          //console.log("into client chatMessage");
          var me = $('#user').val();
          var team = $('#team').val();
          //console.log(me + " vs. " + from);
          //color = (from == me) ? 'green' : (team == 0) ? '#e0676b' : '#67a7e0';
          color = (team == 0) ? '#e0676b' : '#67a7e0';
          if (from=='System')
            color = '#000010'
          //var from = (from == me) ? 'Me' : from;
          var m = $('#messages1');
          m.append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg + '</li>');
          m.scrollTop(m.outerHeight()+m.offset().top);
        });

        socket.on('registerGame', function(sid){
          //console.log("into client registerGame");
          var m1 = $('#messages1').html();
          var m2 = $('#messages2').html();
          var scoreR = $('#game-details').attr("data-scoreR");
          var scoreB = $('#game-details').attr("data-scoreB");
          //var b = $('.game-board').html();
          var b = [];
          for (i=0;i<5;i++){
            for (j=0;j<5;j++){
              var bordo = $('.row-'+i+'col-'+j).children('.game-card').attr("data-color");
              if (bordo!=null && bordo!='undefined' && bordo!=''){
                var obj = {};
                obj.row=i;
                obj.col=j;
                obj.color=bordo;
                b.push(obj);
              }
            }
          }
          socket.emit('updateGame',sid,m1,m2,b,scoreR,scoreB);
        });

        socket.on('updateGame', function(sid,m1,m2,b,scoreR,scoreB){
          //console.log("into client updateGame");
          $('#messages1').html(m1); //update chat
          $('#messages2').html(m2); //update chat indizi
          $('#game-details').attr("data-scoreR",scoreR);
          $('#game-details').attr("data-scoreR",scoreB);
          // update board
          for (i=0;i<b.length;i++){
            obj = b[i];
            var g = $('.row-'+obj.row+'col-'+obj.col);
            g.children('.game-card').attr("data-color",obj.color);
            g.children('.game-row').removeClass('color-').addClass('color-' + g.children('.game-card').attr("data-owner"));
            g.removeClass('border-').addClass('border-' + obj.color);
          }
        });

        socket.on('notifyUser', function(user){
          //console.log("notifyUser");
          var me = $('#user').val();
          if(user != me) {
            $('#notifyUser1').text(user + ' is typing ...');
          }
          setTimeout(function(){ $('#notifyUser1').text(''); }, 10000);
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
            //console.log("dentro");
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

        socket.on('startGame', function(starter){
          //console.log("startGame");
          var g = $("#game-details")
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
          m.scrollTop(m.outerHeight()+m.offset().top);
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
          m.scrollTop(m.outerHeight()+m.offset().top);
        });

        socket.on('updateSet', function(row,col,numero,risultato,team,owner,word,scorer,scoreb){
          //console.log(row + ',' + col + ',' + numero + ',' + risultato + ',' + team + ',' + owner + ',' + word + ',' + scorer + ',' + scoreb);
          var colore = (owner == 0) ? '#e0676b' : (owner == 1) ? '#67a7e0' : (owner == 2) ? '#e0dd67' : '#000016';
          var g = $("#game-details")
          var rule = g.attr("data-rule");
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
          m.scrollTop(m.outerHeight()+m.offset().top);

          $('.row-'+row+'col-'+col).children('.game-card').attr("data-color", team);
          //$('.row'+row+'col'+col+' game-card').html("<div class='game-card' data-row='" + row + "' data-col='" + col + "' data-owner='" + owner + "' data-color='" + team + "' >" + word + "</div>");
          $('.row-'+row+'col-'+col).removeClass('border-').addClass('border-' + team); //colorare il bordo
          if (rule=="1"){
            // $('.row-'+row+'col-'+col).children('.game-row').removeClass('color-4').addClass('color-' + owner); // colorare il tassello
            $('.row-'+row+'col-'+col).children('.color-4').removeClass('color-4').addClass('color-' + owner); // colorare il tassello
          }
          if (risultato == 0){
            if (scorer==0 || scoreb==0){
              socket.emit('endGame', team, false);
            } else if (numero == 0) {
              //console.log("nextTeam for ending step");
              //socket.emit("nextTeam",team);
              nextTeam(team);
            }
          } else {
            if (risultato==2){
              socket.emit('endGame', team, true);
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
          m.append('<li><b>Vince la squadra ' + squadra + ' !</b></li>');
          m.scrollTop(m.outerHeight()+m.offset().top);
        });

        socket.on('nextTeam', function(team){
          nextTeam(team);
        });

    }

/*
    if ($("#searchGroupForm")) {
        $( "#searchGroupFormSubmit" ).on("click", function( event ) {
            //console.log('*****Click: ');
            $.ajax({
                type: "POST",
                url: "http://localhost:3000/search",
                data: {
                    name: $( "input[name$='name']" ).val()
                },
                success: function (data){
                    var groups = data.groups;
                    //console.log('*****elementi: '+groups.length);
                    //console.log('*****photo: '+groups[0].photo);
                    $('#foundGroupsTable tbody tr').remove();
                    for (var i = 0; i < groups.length; i++) {
                        //console.log('*****elementi: '+groups[i].stringify);
                        var group = "<tr>" +
                            "<td>" + groups[i].photo + "</td>" +
                            "<td>" + groups[i].name + "</td>" +
                            "<td>" + groups[i].alias_creator + "</td>" +
                            "<td>" + groups[i].tot_user + "</td>" +
                            "<td>" + groups[i].tot_prof + "</td>" +
                            "<td>" + "<a href='/group/groupJoin/"+groups[i]._id+"' class='btn btn-info' role='button'> Join </a>" + "</td>" +
                            "</tr>";
                        $('#foundGroupsTable tbody').append(group);
                    }
                    $('#totalFoundGroups').html(groups.length);
                    $("#searchResult").show();
                },
                error: function() {
                    alert("Error while searching groups!");
                }
            });
            event.preventDefault();
        });
    }


    if ($("#newProfileForm")) {
        $( "#addWord" ).on("click", function( event ) {
            but = "<a href='#' id='" + $("#word").val() + "' class='btn btn-info' role='button'>" + $("#word").val() + "</a>"
            $('#words_show').append(but);

            Messenger({
                extraClasses: 'messenger-fixed messenger-on-right messenger-on-top'
            }).post({
                message: 'Added word: ' + $("#word").val(),
                type: 'success',
                showCloseButton: true,
                hideAfter: 10
            });
            $("#word").val("");
            $("#word").focus();
            var i = 1;
            var insieme = "";
            $("#words_show a").each(function() {
              if (i == 1) {
                insieme = $(this).html();
              } else {
                insieme = insieme + '|' + $(this).html();
              }
              i = i + 1;
            });
            $("#words").val(insieme);
        });
    }


    $("#words_show").on("click", function( event ) {
        Messenger({
            extraClasses: 'messenger-fixed messenger-on-right messenger-on-top'
        }).post({
            message: 'Word removed: ' + $("#" + event.target.id).html(),
            type: 'error',
            showCloseButton: true,
            hideAfter: 10
        });
        $("#" + event.target.id).remove();
        var i = 1;
        var insieme = "";
        $("#words_show a").each(function() {
          if (i == 1) {
            insieme = $(this).html();
          } else {
            insieme = insieme + '|' + $(this).html();
          }
          i = i + 1;
        });
        $("#words").val(insieme);

        event.preventDefault();
    });


    $("#changeFolder").on("click", function( event ) {
        parole = $("#words").val();
        vettore = parole.split('|');
        var risultato = [];
        for (var i = 0; i < 5; i++) {
            var pos = Math.floor(Math.random() * vettore.length);
            var randomWord = vettore[pos];
            vettore.splice( pos, 1 );
            risultato.push(randomWord);
        }
        $.each(risultato, function (index, value){
//          alert(index + ':' + value);
        });


        event.preventDefault();
    });
*/

/*
    if ($("#newProfileForm")) {
        $( "#newProfileFormSubmit" ).on("click", function( event ) {
            var i = 1;
            var insieme = "";
            $("#words_show a").each(function() {
              if (i == 1) {
                insieme = $(this).html();
              } else {
                insieme = insieme + '|' + $(this).html();
              }
              i = i + 1;
            });
            $("#words").val(insieme);
            $.ajax({
                type: "POST",
                url: "http://localhost:3000/profileNew",
                data: {
                    photo: $( "input[name$='photo']" ).val(),
                    name: $( "input[name$='name']" ).val(),
                    words: $( "input[name$='words']" ).val(),
                    id_group: $( "input[name$='id_group']" ).val()
                },
                success: function (data){
                    //console.log('data: ('+data.redirect+')');
                    window.location = data.redirect;
                        //window.location.replace(data.redirect);

                    //alert("Success while creating new profile!");
                },
                error: function() {
                    alert("Error while creating new profile!");
                }
            });
            event.preventDefault();
        });
    }
*/
});
