const express = require("express");
const https = require('https');
const fs = require('fs');

const path = require('path');

var options = {
    key: fs.readFileSync('server/key.pem'),
    cert: fs.readFileSync('server/cert.pem')
};  

const PORT = process.env.PORT || 80;

const dbModel = require('../models/dbModel')

const app = express();
const httpsServer = https.createServer(options, app);

app.use(express.json())
/*app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});*/

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/query/:cmd', (req, res) => {
    console.log(req.params.cmd);
    dbModel.getQuery(req.params.cmd)
    .then(response => { res.status(200).send(response); })
    .catch(error => { res.status(500).send({error: error}); })
});

app.get('/404', function(req, res){

});

app.get('*', function(req, res){
    console.log(req.path);
    res.redirect('/404');
});

app.listen(PORT);
httpsServer.listen(443);

  