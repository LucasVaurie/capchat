var img_sing = 14;
var img_neutre = 13;
var select_img_sing = -1;
var tab_images = [];
var tempsMax = 35000; // Démarrage à 35s. pour la première supp. de 5 sec.
var compteurTemps;
var contenu_HTML = "<div class='intro'><h1>Cap'Chat</h1><p>Le but de ce projet est de créer le prototype d’un générateur de captcha dynamique. Ce captcha affiche une série d’images originales parmi lesquelles on distingue des images ‘neutres’ et une image ‘singulière’. À chaque image singulière est associé une question ou un indice unique permettant de l’identifier. Un thermomètre dynamique décompte 30 secondes pour y répondre. L’écoulement du délai provoque le rechargement de Cap’Chat. À chaque échec ou délai dépassé, le délai imparti est réduit de cinq secondes.</p><p>Le projet est programmé à l'aide du framework <i>NodeJS</i>, de <i>HTML</i>, de <i>CSS</i>, et de <i>Javascript</i> dans le cadre d\'une Licence Informatique (Module Systèmes d\'information web)</p><p>Par Lucas Vaurie - 2021</p></div><div class='container zone-principale'><div class='row contenu-global'><div class='col capchat'><p id='explication'></p><p id='consigne'></p><p id='indice'></p><div class='container'><div class='row'><div class='col opt'><a href='#' onclick='validation(event)'><img class='img-capchat' src='#'></a></div><div class='col opt'><a href='#' onclick='validation(event)'><img class='img-capchat' src='#'></a></div><div class='col opt'><a href='#' onclick='validation(event)'><img class='img-capchat' src='#'></a></div><div class='col opt'><a href='#' onclick='validation(event)'><img class='img-capchat' src='#'></a></div></div><div class='row'><div class='col opt'><a href='#' onclick='validation(event)'><img class='img-capchat' src='#'></a></div><div class='col opt'><a href='#' onclick='validation(event)'><img class='img-capchat' src='#'></a></div><div class='col opt'><a href='#' onclick='validation(event)'><img class='img-capchat' src='#'></a></div><div class='col opt'><a href='#' onclick='validation(event)'><img class='img-capchat' src='#'></a></div></div></div></div><div class='col-3 div-compteur'><p>Temps restant :</p><div class='bloc-horloge'><canvas id='horloge' width='75' height='350'></canvas><div id='temps'></div></div></div></div></div>";

function initiate_capchat() {
    let div_principale = document.getElementsByClassName('capchat-area');
    div_principale[0].innerHTML = contenu_HTML;
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

async function rechargement() {
    creation_tableau();
    console.log("création tableau");
    affichage_texte();
    console.log("caffichage texte");

    // Pas de réduction supplémentaire lorsque les 10s. sont atteints
    tempsMax -= 5000;

    if(tempsMax <= 0) {
        echec();
    }
    clearTimeout(compteurTemps);
    console.log("clearTimeout(compteurTemps)");
    clearTimeout(window.t);
    console.log("learTimeout(window.t)");
    setTimer(tempsMax);
    console.log("setTimer" + tempsMax);
    compteurTemps = setTimeout('rechargement()', tempsMax);
}

function creation_tableau() {
    var img_sing = 14;
    var img_neutre = 13;
    select_img_sing = Math.floor(Math.random() * img_sing)+1;

    tab_images = Array.from(document.getElementsByClassName('img-capchat'));
    shuffle(tab_images);
    // Ajout de la src de l'image singulière
    tab_images[0].src = 'http://localhost:8080/singuliers/'+select_img_sing;
    // Ajout des src des img neutres dans les autres cases
    for (i = 1 ; i < 8 ; i++) {
        tab_images[i].src = 'http://localhost:8080/neutres/'+(((select_img_sing+i)%img_neutre)+1);
    }
}

async function affichage_texte() {
    let indice = document.getElementById('indice'), explication = document.getElementById('explication'), consigne = document.getElementById('consigne');
    let text_indice = await fetch("http://localhost:8080/indices/"+select_img_sing).then(data=>data.text());
    let text_explication = "Ce <i>Cap'Chat</i> contient 8 petits chats. L'un d'entre eux est un chat vraiment particulier sur lequel il faut cliquer. Comment le retrouver ?";
    let text_consigne = "D'après l'indice ci-dessous, retrouvez le chat correspondant.";
    indice.innerText = text_indice;
    explication.innerHTML = text_explication;
    consigne.innerHTML = text_consigne;
}

function validation(event) {
    let target = event.target;

    if (event.target.src === tab_images[0].src) {
        // "Suppression" de la div principale
        let div_principale = document.getElementsByClassName("zone-principale");
        let contenu_success = '<div class="alert-success">Vous avez réussi !<div>';
        let bouton_refresh = document.createElement("a");
        bouton_refresh.setAttribute("class", "btn btn-primary fin");
        bouton_refresh.setAttribute("href", "https://www.lyceecharlesdefoucauldsup.fr/");
        bouton_refresh.setAttribute("role", "button");
        bouton_refresh.innerText = "Continuer";
        div_principale[0].innerHTML = contenu_success;
        div_principale[0].classList.add("final-screen");
        div_principale[0].appendChild(bouton_refresh);
    } else {
        rechargement();
    }
}

function echec() {
    let div_principale = document.getElementsByClassName("zone-principale");
    let contenu_echec = '<div class="alert-warning">Vous n\'avez pas complété le Cap\'Chat à temps !<div>';
    let bouton_refresh = document.createElement("a");
    bouton_refresh.setAttribute("class", "btn btn-primary fin");
    bouton_refresh.setAttribute("href", "./cap'chat.html");
    bouton_refresh.setAttribute("role", "button");
    bouton_refresh.innerText = "Continuer.";
    div_principale[0].innerHTML = contenu_echec;
    div_principale[0].classList.add("final-screen");
    div_principale[0].appendChild(bouton_refresh);
}

initiate_capchat();