var horloge		= $("#horloge"),
	temps 		= $("#temps"),
	start 		= $("#start"),
	pause 		= $("#pause"),
	continu 	= $("#continue");
	
var t = 30000;

var lancer = () => {
	start.on("click", (e) => {
		e.preventDefault();
		setTimer(t);
		
		start.hide();
		pause.show();
	});
	
	pause.on("click", function (e) {
		e.preventDefault();
		clearTimeout(window.t);
		
		stop(1, true);
		
		temps.css("opacity", .5);
		$(this).hide();
		continu.show();
	});
	
	continu.on("click", function (e) {
		e.preventDefault();
		temps.css("opacity", 1);
		
		stop(1, false);
		
		setTimeout(() => {
			setTimer(window.intOffset);
		}, 350);
		
		$(this).hide();
		pause.show();
	});
	
	setTimer(t);
};
//lancer();

function fini()
{
	start.show();
	pause.hide();
	continu.hide();
}

// Fonction permettant de changer la couleur en fonction du pourcentage de temps écoulé
function getColor(pourcent) {	
	pourcent = 100-pourcent;
    var r, g, b = 0;
    if(pourcent < 50) {
        r = 255;
        g = Math.round(5.1 * pourcent);
    }
    else {
        g = 255;
        r = Math.round(510 - 5.10 * pourcent);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
}

function setTimer(timer) {
	var debut = new Date();
	debut = debut.getTime();
	debuter(debut, timer);
	horloge.show();
	temps.show();
}

// A modifier
function debuter(debut,timer) {
	var d = new Date();
    // timer = temps total
    // d.getTime() - debut = temps écoulé
	window.intOffset = timer - (d.getTime() - debut);
	temps.html(Math.ceil(window.intOffset / 1000));
    // Trouver le pourcentage
	window.pourcent = ((d.getTime() - debut)*100) / timer;		
	drawHorloge(1);			
	if(window.intOffset <= 0) {
		fini();	
	} else {
		window.t = setTimeout("debuter(" + debut + "," + timer + ")",50);
	}
}

function stop(timeElapsed,pause)
{		
	animeTime = 100;
	
	diff = timeElapsed / animeTime;
	
	if(pause)
	{
		pourcent = 1 - diff;
		if(pourcent < 0)
			pourcent = 0;
	} else {
		pourcent = diff;
		if(pourcent > 1)
			pourcent = 1;
	}				
						
	drawHorloge(pourcent);
	
	if(timeElapsed < animeTime)
	{
		setTimeout(function(){
			stop((timeElapsed + 10),pause);
		},10);
	}
}

// A modifier
function drawHorloge(pourcent) {
	// 'canvas' récupère la div Canvas dans le HTML
    // 'ctx' met en place un contexte de dessin 2D sur la div
    var canvas = document.getElementById("horloge"), ctx = canvas.getContext("2d");
	
    ctx.clearRect(0,0,75,350);
    
    // Zone de fond
    ctx.beginPath(); // Commence le dessin
	ctx.globalAlpha = 1; // Spécifie valeur alpha (transparence)
    ctx.fillStyle = '#929292'; // Définit la couleur en fonction du pourcent
    ctx.rect(0, 0, 75, 350);
    ctx.fill();
	ctx.closePath();

    // Zone colorée + diminution
    ctx.beginPath(); // Commence le dessin
	ctx.globalAlpha = 1; // Spécifie valeur alpha (transparence)
    ctx.fillStyle = getColor(window.pourcent);
    // ctx.rect(0, 0, 75, 350*(100-window.pourcent)*0.01);
    ctx.rect(0, 350, 75, -(350*(100-window.pourcent)*0.01));  // CHANTIER
    ctx.fill();
	ctx.closePath();
}