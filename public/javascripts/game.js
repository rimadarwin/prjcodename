/* module for any back end game functions */

var exports = module.exports = {};

//courtesy of http://ninjabunny.github.io/KodeNames/
//var words = ["account","achiever","acoustics","act","action","activity","actor","addition","adjustment","advertisement","advice","aftermath","afternoon","afterthought","agreement","air","airplane","airport","alarm","amount","amusement","anger","angle","animal ","answer","ant","ants ","apparatus","apparel","apple","apples ","appliance","approval","arch","argument","arithmetic","arm","army","art","attack","attempt","attention","attraction","aunt","authority","babies ","baby ","back","badge","bag","bait","balance","ball","balloon","balls ","banana","band","base","baseball","basin","basket","basketball","bat","bath","battle","bead","beam","bean","bear","bears ","beast","bed","bedroom","beds ","bee","beef","beetle","beggar","beginner","behavior","belief","believe","bell","bells ","berry","bike","bikes ","bird","birds ","birth","birthday","bit","bite","blade","blood","blow","board","boat","boats ","body","bomb","bone","book","books ","boot","border","bottle","boundary","box","boy","boys ","brain","brake","branch","brass","bread","breakfast","breath","brick","bridge","brother","brothers ","brush","bubble","bucket","building","bulb","bun","burn","burst","bushes","business","butter","button","cabbage","cable","cactus","cake","cakes ","calculator","calendar","camera","camp","can","cannon","canvas","cap","caption","car ","card","care","carpenter","carriage","cars ","cart","cast","cat","cats ","cattle","cause","cave","celery","cellar","cemetery","cent","chain","chair ","chairs ","chalk","chance","change","channel","cheese","cherries","cherry","chess","chicken ","chickens ","children","chin","church","circle","clam","class","clock","clocks ","cloth","cloud","clouds ","clover","club","coach","coal","coast","coat","cobweb","coil","collar","color","comb","comfort","committee","company","comparison","competition","condition","connection","control","cook","copper","copy","cord","cork","corn ","cough","country","cover","cow","cows ","crack","cracker","crate","crayon","cream","creator","creature","credit","crib","crime","crook","crow","crowd","crown","crush","cry","cub","cup","current","curtain","curve","cushion","dad","daughter","day","death","debt","decision","deer","degree","design","desire","desk","destruction","detail","development","digestion","dime","dinner","dinosaurs ","direction","dirt","discovery","discussion","disease","disgust","distance","distribution","division","dock","doctor","dog","dogs ","doll","dolls ","donkey","door","downtown","drain","drawer","dress","drink","driving","drop","drug","drum","duck ","ducks ","dust","ear","earth","earthquake","edge","education","effect","egg","eggnog","eggs ","elbow","end","engine","error","event","example","exchange","existence","expansion","experience","expert","eye","eyes","face","fact","fairies ","fall","family","fan","fang ","farm","farmer ","father","father","faucet","fear","feast","feather","feeling","feet","fiction","field","fifth","fight","finger","finger","fire ","fireman","fish","flag","flame","flavor","flesh","flight","flock","floor","flower","flowers ","fly","fog","fold","food","foot","force","fork","form","fowl","frame","friction","friend","friends ","frog","frogs ","front","fruit","fuel","furniture","alley","game","garden","gate","geese","ghost","giants ","giraffe","girl","girls ","glass","glove","glue","goat","gold","goldfish","good-bye ","goose","government","governor","grade","grain","grandfather","grandmother","grape","grass","grip","ground","group","growth","guide","guitar","gun","hair","haircut","hall","hammer","hand","hands ","harbor","harmony","hat","hate","head","health","hearing","heart","heat","help","hen","hill ","history","hobbies","hole","holiday","home ","honey","hook","hope","horn","horse","horses ","hose","hospital","hot","hour","house","houses ","humor","hydrant","ice","icicle","idea","impulse","income","increase","industry","ink","insect","instrument","insurance","interest","invention","iron","island","jail","jam","jar","jeans","jelly","jellyfish","jewel","join","joke","journey","judge","juice","jump","kettle","key","kick","kiss","kite","kitten","kittens ","kitty ","knee","knife","knot","knowledge","laborer","lace","ladybug","lake","lamp","land","language","laugh","lawyer","lead","leaf","learning","leather","leg ","legs","letter","letters ","lettuce","level","library","lift","light","limit","line","linen","lip","liquid","list","lizards ","loaf","lock","locket","look","loss","love","low","lumber","lunch","lunchroom","machine","magic","maid","mailbox","man","manager","map","marble","mark","market","mask","mass","match","meal","measure","meat","meeting","memory","men","metal","mice ","middle","milk","mind","mine","minister","mint","minute","mist","mitten","mom","money","monkey","month","moon","morning","mother","motion","mountain","mouth","move","muscle","music","nail","name","nation","neck","need","needle","nerve","nest ","net","news","night","noise","north","nose","note","notebook","number","nut","oatmeal","observation","ocean","offer","office","oil","operation","opinion","orange","oranges ","order","organization","ornament","oven","owl","owner","page","pail","pain","paint","pan","pancake","paper","parcel","parent","park","part","partner","party","passenger","paste","patch","payment","peace","pear","pen","pencil","person","pest","pet","pets ","pickle","picture","pie","pies ","pig","pigs ","pin","pipe","pizzas ","place","plane","planes ","plant","plantation","plants ","plastic","plate","play","playground","pleasure","plot","plough","pocket","point","poison","police","polish","pollution","popcorn","porter","position","pot","potato","powder","power","price","print","prison","process","produce","profit","property","prose","protest","pull","pump","punishment","purpose","push","quarter","quartz","queen","question","quicksand","quiet","quill","quilt","quince","quiver","rabbit ","rabbits ","rail","railway","rain","rainstorm","rake","range","rat","rate","ray","reaction","reading","reason","receipt","recess","record","regret","relation","religion","representative","request","respect","rest","reward","rhythm","rice","riddle","rifle","ring","rings ","river","road","robin ","rock","rod","roll","roof","room","root","rose","route","rub","rule","run","sack","sail","salt","sand","scale","scarecrow","scarf","scene","scent","school","science","scissors","screw","sea","seashore","seat","secretary","seed","selection","self","sense","servant","shade","shake","shame","shape","sheep","sheet","shelf","ship","shirt","shock","shoe","shoes ","shop","show","side","sidewalk","sign","silk","silver","sink","sister","sisters ","size","skate","skin","skirt","sky","slave","sleep","sleet","slip","slope","smash","smell","smile","smoke","snail","snails ","snake","snakes ","sneeze","snow","soap","society","sock","soda","sofa","son","song","songs ","sort","sound","soup","space","spade","spark","spiders ","sponge","spoon","spot","spring","spy","square","squirrel","stage","stamp","star","start","statement","station","steam","steel","stem","step","stew","stick","sticks ","stitch","stocking","stomach","stone","stop","store","story","stove","stranger","straw","stream","street","stretch","string","structure","substance","sugar","suggestion","suit","summer","sun","support","surprise","sweater","swim","swing","system","table","tail","talk","tank","taste","tax","teaching","team","teeth ","temper","tendency","tent","territory","test","texture","theory","thing","things ","thought","thread","thrill","throat","throne","thumb","thunder","ticket","tiger","time","tin","title","toad","toe","toes","tomatoes ","tongue","tooth","toothbrush","toothpaste","top ","touch","town","toy ","toys ","trade","trail","train","trains ","tramp","transport","tray","treatment","tree","trees ","trick","trip","trouble","trousers","truck","trucks ","tub","turkey","turn","twig","twist","umbrella","uncle","underwear","unit","use","vacation","value","van","vase","vegetable","veil","vein","verse","vessel","vest","view","visitor","voice","volcano","volleyball","voyage","walk","wall","war","wash","waste","watch","water","wave","waves ","wax","way","wealth","weather","week","weight","wheel","whip","whistle","wilderness","wind ","window ","wine","wing","winter","wire","wish","woman","women","wood","wool","word","work","worm","wound","wren","wrench","wrist","writer","writing","yak","yam","yard","yarn","year","yoke","zebra ","zephyr","zinc","zipper","zoo"];
var words = ["GUERRA","ROSPO","POLLO","NAVE","PASSO","PECORA","LUPO","SATURNO","CODA","SPIAGGIA","LINEA","NATALE","BERLINO","RAGNO","TORRE","TUBO","INSEGNANTE","MERCURIO","MANTO","COTONE","HOLLYWOOD","ALBERO","GHIACCIO","MASSA","AREA","TURNO","CAPELLI","BERMUDA","VETRO","GAS","RESISTENZA","TOKIO","NOTA","ANELLO","BOTTONE","SVIZZERA","BUCO","ZUCCHERO","GUANTO","ZECCA","CRAVATTA","SCHEDA","TIRO","CORONA","FRUSTA","SQUALO","PIRAMIDE","SUONO","VESTITO","CONDUTTORE","VUOTO","ROMA","SPADA","ATLANTIDE","FREDDO","NAPOLI","STAGNO","OSPEDALE","SANGUE","BASE","VITE","RETE","SENO","CAMBIO","LUNA","VINO","STATO","ASSASSINO","CAVALIERE","RAGGIO","POLO","CAFFÈ","STADIO","BATTUTA","ETICHETTA","DIAVOLO","LINGUA","BANCO","STIVALE","LASER","DINOSAURO","VENEZIA","ZUCCA","PIPA","CAMPO","TOPO","TRAMA","ORSO","FANTASMA","COPPA","SUPEREROE","HOTEL","SOLDATO","GIRO","FATTURA","GENIO","CAROTA","APE","BAFFO","PUNTO","NOCE","MACCHINA","ALPI","PUPAZZO DI NEVE","PORTA","MOTORE","ANNO","AGO","MODELLO","KETCHUP","RADIO","HIMALAYA","CONCERTO","EUROPA","COLLO","OLIMPO","JET","CONTRABBANDIERE","METRO","LEONE","OMBRA","BALENA","DIAMANTE","POSIZIONE","MELA","MONTE","CAPO","PARCO","MARMO","FLUSSO","LAMPO","TAVOLO","PARTE","CORNO","CALCIO","LEGNO","PERA","STELLA","AREA","CORDA","FALANGE","TELESCOPIO","PIANTA","CANGURO","CASINÒ","FOLLETTO","LIBRO","GATTO","FUSTO","CUOCO","TRENO","CERCHIO","NEW YORK","CAMPANA","GUARDIA","PIATTO","DANZA","CELLA","MILIONARIO","AQUILA","CHIESA","PARCO","ISOLA","RIGA","FORTUNA","SACCO","DANTE","TESORO","GELATO","OPERA","TERRA","DOTTORE","BECCHINO","ROSA","RAMO","CINTURA","NOTTE","PANE","FORCHETTA","QUADRO","PRANZO","TESTA","AMBULANZA","RADICE","MORTE","CORSO","PIOVRA","BATTERIA","MESSICO","GRATTACIELO","CAVALLO","GUARNIZIONE","PESO","OCCHIO","ENERGIA","NINJA","INDIA","ANTARTIDE","CHIODO","COPERTA","ACQUA","INCONTRO","PIASTRA","EGITTO","CIMICE","GERMANIA","PIEDE","BANDA","RIVOLUZIONE","LETTO","MAIALE","TEMPO","SALE","SCHERMO","MONETA","OLIO","PALLA","CARTA","FURGONE","LIMONE","BOTTIGLIA","FIGURA","CONIGLIO","CICLO","SPAZIO","SEDIA","GIOVE","SOMMOZZATORE","TASSO","LADRO","BRACCIO","AMO","GIORNO","FETTA","MANO","VIAGGIO","VENTO","BRONZO","RE","ARCO","DRAGO","AFRICA","MOSSA","CANALE","REGINA","FIERA","VOLO","UNICORNO","MOSCA","OMBELICO","AVORIO","CASSA","ANGELO","CAPITALE","ZOCCOLO","BOMBA","CENTRO","COLOMBO","CROCE","MUTANDE","SCALA","FORESTA","CACCIA","AVVOCATO","CORTE","VITA","PIANO","PASTA","ARRESTO","MIGLIO","MINA","PESCE","PRINCIPESSA","SCAMPO","AEREO","NEVE","COLONNA","VELENO","PESCA","TROMBA","RUOTA","BANCA","ORNITORINCO","IRA","UOVO","GRECIA","MAGIA","POLIZIA","ELEFANTE","LONDRA","CENTAURO","IMPOSTA","MALATTIA","INDICE","NEGOZIO","SCIENZIATO","FORZA","ROMBO","YETI","POLLICE","DENTE","ORGANO","CERA","PARACADUTE","VIOLA","PISTOLA","STREGA","RITMO","CATENA","PARTITA","FLAUTO","AMERICA","CANNA","FILM","MORA","SATELLITE","PINGUINO","VERDE","BOCCA","DISCO","GRADO","LIMOUSINE","AUSTRALIA","BAR","NANO","SCUOLA","VERME","BOTTE","ELICOTTERO","SPINA","ITALIA","KIWI","PETTO","TORCIA","ERBA","GIOCO","SPIA","BACINO","CALICE","POSTA","ORO","TRIANGOLO","MIELE","FRANCIA","AGENTE","MICROSCOPIO","CORNICE","PINOCCHIO","TORTA","PIRATA","ASSE","LETTERA","PROFILO","CODICE","RISO","MISSILE","AMBASCIATA","VERSO","ERRORE","CANE","CASA","CARICA","FILA","BLOCCO","BORSA","MURO","PONTE","COLPO","MAZZO","INFERMIERA","GIGANTE","TEMPIO","FORO","ONDA","ROBOT","DADO","TAZZA","PILOTA","ACCORDO","FACCIA","SPIRITO","TEATRO","PECHINO","CIOCCOLATO","GRU","COLTELLO","ROULETTE","PATATA","ALIENO","SCORPIONE","SQUADRA","SCARPA","PORTO","SPAGHETTO","FUOCO","STORIA","PIEGA","CHIAVE","CUORE","SALSA"];
var numWordsPerBoard = 25;
//exports.words = words;

//test function
exports.sayHello = function() {
	console.log("Hello");
};

//code to get a new board state
var getWords = function() {
	var j = 0;
	var ret = [];
	for(var i = 0; i < numWordsPerBoard; i++) {
		j = Math.floor((Math.random()*words.length)); //0 - (words.legnth-1)
		ret.push(words[j]);
	}
	return ret;
};

//Fisher-Yates, in place shuffle
var shuffleArray = function(array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
};

exports.generateBoard = function() {
	console.log("generateBoard");
	var words = getWords();					//get 20 random words
	var team = Math.floor(Math.random()*2); //0 or 1
	var board = [];
	var curr = [];
	var starter = 0;
	var assignments = [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,3,2,2,2,2,2,2,2];//ownership
	if(Math.floor(Math.random()*2) >0) {
		assignments.push(1);
		starter = 1;
	}
	else
		assignments.push(0);

	shuffleArray(assignments);				//shuffle

	//for each word
	var j = 0;
	for(var i = 0; i < 5; i++) {		//for each row
		for(k = 0; k < 5; k++) {		//for each col of each row
			board.push({
				"row": i,
				"col": k,
				"word": words[j],				//word string
				"owner_team": assignments[j],	//owner of card (team)
				"color": ""						//current color of card
			});
			j++;						//increment inner counter
		}								//5 cards now in curr

		//board.push(curr);
		//curr = [];
	}

	return [starter,board];
};

exports.updateBoard = function(board, updates, team) {
	var rc = null;
	for(var i = 0; i < updates.length; i++) {
		rc = updates[i].split("-");				//row col

		//update color to team color
		var pos = parseInt(rc[0])*5+parseInt(rc[1])
		board[pos].color = team;
		//board[parseInt(rc[0])][parseInt(rc[1])].color = team;
	}
	return board;
};

exports.updateTeam= function(users) {
		var team_r = "";
		var team_b = "";
		var rules = "";
		var ready = "0";
		var hasBlueMaster = false;
		var hasRedMaster = false;
		var hasBlueAgent = false;
		var hasRedAgent = false;

		for (i=0;i<users.length;i++){
			var user = users[i];
			//console.log(user);
			//console.log(user.rule);
			//console.log(user.color);
			if (user.rule=='0'){
				//console.log("0");
				if (user.color=='0'){
					//console.log("1");
					hasRedMaster = true;
					if (team_r == ''){
						team_r = '<b>' + user.alias + '</b>';
					} else {
						team_r = team_r + ', <b>' + user.alias + '</b>';
					}
				} else {
					//console.log("2");
					hasBlueMaster = true;
					if (team_b == ''){
						team_b = '<b>' + user.alias + '</b>';
					} else {
						team_b = team_b + ', <b>' + user.alias + '</b>';
					}
				}
			} else {
				//console.log("3");
				if (user.color=='0'){
					hasRedAgent = true;
					//console.log("4");
					if (team_r == ''){
						team_r = user.alias ;
					} else {
						team_r = team_r + ', ' + user.alias;
					}
				} else {
					hasBlueAgent = true;
					//console.log("5");
					if (team_b == ''){
						team_b = user.alias;
					} else {
						team_b = team_b + ', ' + user.alias;
					}
				}
			}

		}
		//console.log(team_r);
		//console.log(team_b);
		if (!hasRedMaster){
			rules = rules + "<option value='00'>Maestro Rosso</option>";
		}
		if (!hasBlueMaster){
			rules = rules + "<option value='10'>Maestro Blu</option>";
		}
		rules = rules + "<option value='01'>Agente Rosso</option><option value='11'>Agente Blu</option>";
		if (hasRedMaster && hasBlueMaster && hasRedAgent && hasBlueAgent)
			ready = "1";

		return [team_r,team_b,rules,ready];
}
