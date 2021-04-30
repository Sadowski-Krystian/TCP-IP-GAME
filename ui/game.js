// let pakiet = "#tcp";
let gSett = {
	match: 'tcp',
	answTime: 5000,
	startTime: 10000	//czas na odpowiedź: 5s
}
// PLAYER
const Player = {
	name: null,
	points: 0,
setName: ( value )=>{
	
	
	console.log('Ustaw nazwę gracza');
	if( value!==null ){
		Player.name = value;
		return true;
	} else
		return false;
},
getName: ()=>{
	console.log('Player name is: '+Player.name);
	return Player.name;
},
addPoints: ( value=0 )=>{
	Player.points = parseInt(Player.points)+parseInt(value);
},
subtractPoints: ( value=0 )=>{
	Player.points = parseInt(Player.points)-parseInt(value);
},
getPoints: ()=>{
	return parseInt(Player.points)
},
eol: null
}
// MATCH
let target = null; // tutaj dynamicznie będziemy przypisywać elementy
const fields = [
    { offset:"0064", label:"Ack number", no:39 },
    { offset:"0096", label:"Data offset", no:41 },
    { offset:"0016", label:"Destination port", no:35 },
    { offset:"0106", label:"Flags", no:43 },
    { offset:"0128", label:"Header and Data checksum", no:46 },
    { offset:"0160", label:"Options", no:49 },
    { offset:"0100", label:"Reserved", no:42 },
    { offset:"0032", label:"Sequence number", no:37 },
    { offset:"0000", label:"Source port", no:34 },
    { offset:"0144", label:"Urgent pointer", no:47 },
    { offset:"0112", label:"Window size", no:44 },
    ];
// TIMER
const Timer = {
	t1: null,	// match Time
	t2: null,	// answer Time
	t3: null,
countDown: ()=>{
	var t = gSett.answTime;
	Timer.t2 = setInterval( ()=>{
		console.log(t);
		
			if( t<=0 ){

			clearInterval(Timer.t2);
			if (Game.paused != true) {
				if (Game.end==true) {
				return;
				}else{
					drawTarget();
				}
			
			
			}else{
				Game.pausing();
			}
			
			
		}
		t = t-100;
		Timer.t1 = Timer.t1+100;
		
		Timer.shrinkLine(t);
		
		
	}, 100);
	
},
countDownStart: ()=>{
	Game.end=false;
	var q = gSett.startTime;
	Timer.t3 = setInterval( ()=>{
		console.log(q);
		
			if( q==10000 ){
				document.querySelector('#start').style.display = "none"
			document.querySelector("#przygotuj").style.display="flex";
			
			
		}else if(q==3000){
			document.querySelector("#przygotuj").style.display="none";
			document.querySelector("#Gotow").style.display="flex";
		}else if (q==1000) {
			document.querySelector("#Gotow").style.display="none";
			document.querySelector("#sta").style.display="flex";
		}else if (q==0) {
			document.querySelector("#sta").style.display="none";
			Game.start();
			
			
		}
		q = q-100;
		
		
		
		
		
	}, 100);
	
},
countWidth: (value)=>{
	var full = gSett.answTime;
	return value*100/full;
},
shrinkLine: (value)=>{
	var line = document.querySelector("#nextItem").querySelector("hr");
	var correct = Timer.countWidth(value);
	line.style.width = correct+"%";
}
}
let clearTimer =()=>{
	Timer.t1 = null;
	Timer.t2 = null;
}
// ?MATCH?
let drawTarget = ()=>{
	clearInterval(Timer.t2);
	var trgtNo = randomize(fields.length-1);
	if(trgtNo!==false){
		Timer.countDown();				// odliczanie czasu na odpowiedź
		target = fields[trgtNo];	// przypisanie wylosowanego elementu
	console.log(trgtNo);
	console.log(fields[trgtNo]);
	console.log(haveIt);
		var fndNode = document.querySelector("#nextItem").querySelector("output");
		fndNode.textContent = target.label;	// wyświetlenie elementu
	}
}
let withdrawLastTarget =()=>{
	haveIt.pop();
}
let haveIt = [];
let randomize = (maxNr)=>{
    //Generate random number
    let random = (Math.random() * maxNr).toFixed();

    //Coerce to number by boxing
    random = Number(random);

    if(!haveIt.includes(random)) {
        haveIt.push(random);
        return random;
    } else {
        if(haveIt.length <= maxNr) {
          //Recursively generate number
         return  randomize(maxNr);
        } else {
          console.log('No more numbers available.')
		  Game.finish();
          return false;
        }
    }
}
// GAME
const Game = {
	started: false,
	paused: false,
	end: false,
start: ()=>{
	haveIt = [];
	let naz =document.querySelector('#naz').value;
	Player.setName(naz);
	
	Player.points = 0;
	// clear haveIt[];
	clearPoints();	// wyzerowanie punktów
	buildZone();	// wyświetlenie obszaru gry
	Game.started = true;
	drawTarget();
	Player.getName();
	Player.getPoints();
	
},
pause: ()=>{
	if (Game.paused == true) {
		drawTarget();
		document.querySelector('#paused').style.display = "none";
	}else{
		document.querySelector('#pausing').style.display = "flex";
		
	}
	Game.paused = !Game.paused;
	
	console.log('Stan pauzowania gry: '+Game.paused);
	
},
pausing: ()=>{
	document.querySelector('#pausing').style.display = "none";
	document.querySelector('#paused').style.display = "flex";
},
isPaused: ()=>{
	return Game.paused;
},
finish: ()=>{
	console.log(document.querySelectorAll('[data-cell="hdg"]'));
	let tcpp = document.querySelectorAll('[data-cell="hdg"]');
	for(let at in tcpp){
		tcpp[at].textContent ="";
	}
	document.querySelector('#end').style.display = "flex";
	document.querySelector("#end output").textContent = "Gracz: "+Player.name+" osiągnoł wynik: "+Player.getPoints()+"/11 w czasie: "+Timer.t1/1000+" sekund";
	
	// clear Pocket #tcp
	// clear Element #nextItem
	// clear ?
	
},
eol: null
}
let procCell = (e)=>{
	if( e.target.dataset.cell != "hdr"){
		
		if(compareValues(getNoneNo(e.target))){
			displayElement(target, e.target);
			Player.addPoints(1);
			displayPoints();
		}else {
		//	decsPoints();
		// usuń poprzednio wylosowany element
		withdrawLastTarget();
		}
		target = null;
		drawTarget();
	}
}

let getNoneNo = (node)=>{
	console.log(Array.from(node.parentNode.children).indexOf(node));
	return Array.from(node.parentNode.children).indexOf(node);
}

let compareValues = (value)=>{
	
	console.log(target);
	return (value == target.no) ? true : false;
}
// UI
let dspMessage = (text)=>{
	console.log(text);
}
let buildZone = ()=>{
	let pNode = document.getElementById("tcp");
	if( pNode!==null ){
	var divs = pNode.querySelectorAll("div");
		for(let i=0; i<divs.length; i++){
			divs[i].addEventListener('click',procCell);
		}
		pNode.style.display = "grid";
	} else {
		dspMessage("Brak węzła TCP");
	}
}
let displayElement = (what, where)=>{
	where.textContent = what.label;
}
let displayPoints = (e)=>{
	var val = 1;
	var ptsNode = document.querySelector("#points").querySelector("output");
	ptsNode.textContent = Player.getPoints();//parseInt(ptsNode.textContent)+val;
}
let clearPoints = ()=>{
	var ptsNode = document.querySelector("#points").querySelector("output");
	ptsNode.textContent = 0;
}
let init = ()=>{
	//Game.finish();	// DEBUGOWANIE
	//drawTarget();	// DEBUGOWANIE
	document.querySelector('#start').style.display = "flex"
    document.querySelector('#zacznij').addEventListener('click', Timer.countDownStart);
	document.getElementById("btnNewGame").addEventListener('click',newGame);
	document.getElementById("btnRematch").addEventListener('click',drawTarget);
	document.getElementById("btnPause").addEventListener('click',Game.pause);
}

let newGame =()=>{
	Game.end = true;
	Timer.t1 = null;
	document.querySelector('#start').style.display = "flex";
	document.querySelector('#end').style.display = "none";
    document.querySelector('#zacznij').addEventListener('click', Timer.countDownStart);
}
window.addEventListener('load',init);
