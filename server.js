var http = require('http');
var url = require('url');
var express = require('express');
var app = express();
var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];
const controller = require('./controller');

app.get('/api/new/:url(*)', function(req, res){
  controller.addUrl(req.params.url, req.get('host'), res);
});

app.get('/:shortUrl', function(req, res){
  controller.findUrlByID(req.params.shortUrl, res);
});

app.get('/', function(req, res){
    res.sendFile("usage.html", {root: './'});
});

app.listen(config.server.port || 8080, function(){
  console.log("App listening on " + config.server.host 
  + ' port: ' + config.server.port);
});

module.exports = app;