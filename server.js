var http = require('http');
var url = require('url');
var express = require('express');
var app = express();
var fileSystem = require('fs');
var path = require('path');
var mysql = require('mysql');

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

// Gestion de la route d'affichage d'une image singulière
app.get('/singuliers/:id', function(req, res) {
    var chemin_img = path.join('./singuliers/', req.params.id+'.jpg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, {
        'statut': 'Image send',
        'Content-Type': 'img',
    });
    var readStream = fileSystem.createReadStream(chemin_img);
    readStream.pipe(res);
});

// Gestion de la route d'affichage d'une image neutre
app.get('/neutres/:id', function(req, res) {
    var chemin_img = path.join('./neutres/', req.params.id+'.jpg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, {
        'statut': 'Image send',
        'Content-Type': 'img',
    });
    var readStream = fileSystem.createReadStream(chemin_img);
    readStream.pipe(res);
});

// Gestion affichage des indices
app.get('/indices/:id', function(req, res) {
    var indices = JSON.parse(fileSystem.readFileSync(path.join('./indices.json')));
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, {
        'statut': 'Text send',
        'Content-Type': 'text/plain',
    });
    res.end(indices[req.params.id+".jpg"]);
});

// Créer artiste
app.post('/artistes', function(req, res) {
    let sql = `INSERT INTO \`artiste\`(\`nomArtiste\`) VALUES ("${req.body.nom_artiste}")`;
    console.log(sql);
    con.query(sql, function(err) {
        if (err) {
            res.status(400).end("Artist adding has failed.");
            return 400;
        }
        res.status(200).end("Adding with success");
    });
});

// MàJ artiste
app.put('/artistes/:id', function(req, res) {
    let sql = `UPDATE \`artiste\` SET \`nomArtiste\` = "${req.body.nom}" WHERE \`idArtiste\` = "${req.params.id}"`;
    console.log(sql);

    con.query(sql, function(err) {
        if (err) {
            res.status(400).end("Artist modification has failed.");
            return 400;
        }
        res.status(200).end("Modification success.");
    });
});

// Supprimer artiste
app.delete('/artistes/:id', function(req, res) {
    let sql = `DELETE FROM \`artiste\` WHERE \`idArtiste\` = "${req.params.nom}"`;
    con.query(sql, function(err) {
        if (err) {
            res.status(400).end("Artist deletion has failed.");
            return 400;
        }
        res.status(200).end("Deleted with success.");
    });
});

// Lister artistes
app.get('/artistes', function(req, res) {
    let sql = `SELECT * FROM \`artiste\``;
    console.log(sql);
    con.query(sql, function(err, resultat) {
        if (err) {
            res.status(400).end("Listing has failed.");
            return 400;
        }
        res.status(200).end(JSON.stringify(resultat));
    });
});

// Lister thèmes
app.get('/themes', function(req, res) {
    let sql = `SELECT * FROM \`theme\``;
    console.log(sql);
    con.query(sql, function(err, resultat) {
        if (err) {
            res.status(400).end("Listing has failed.");
            return 400;
        }
        res.status(200).end(JSON.stringify(resultat));
    });
});

// Créer thème
app.post('/themes', function(req, res) {
    let sql = `INSERT INTO \`theme\`(\`nomTheme\`) VALUES ("${req.body.nom_theme}")`;
    console.log(sql);
    con.query(sql, function(err) {
        if (err) {
            res.status(400).end("Theme adding has failed.");
            return 400;
        }
        res.status(200).end("Adding with success");
    });
});

app.use(function(req, res, next){
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(404).send('Adresse inconnue :'+req.originalUrl);
});

var con = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "capchat"
});
con.connect(function(err) {
    if(err) {
        res.status(500).send('Database connection failed.');
        return 500;
    }
});
app.listen(8080);

/*

==> Créer jeu d'images
POST /gamesets

==> Modifier jeu d'images
PUT /gamesets/id/:old_name/:new_name/:new_id_theme/

==> Supprimer jeu d'images
DELETE /gamesets/id

==> Lister jeu d'images
GET /gamesets/


==> Penser à l'ajout indices ?
*/