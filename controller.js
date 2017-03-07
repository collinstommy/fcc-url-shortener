const MongoClient = require('mongodb').MongoClient;
const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];
const mongoose = require('mongoose');
const Url = require('./models/url');


mongoose.connect(config.mongo_uri);

exports.addUrl = function (newUrl, reqhost, response) {
  if(isValidUrl(newUrl)){
    Url.findOne().sort('-id').exec(function(err, url){ 
      const id = 1;
      if(url !== null){
        id = url.id + 1;
      }
      return SaveToDB(err, id, newUrl, response, reqhost)});
  }
  else{
    const msg = getJSONResponse(null, null, null, newUrl + ' is not a valid Url. Url should be in format http://www.google.com');
    response.send(msg);
  }
}

exports.findUrlByID = function (id, res) {
  Url.findOne({ id: id }, (err, url) => {
    if (err){
      res.status(500);
      res.send(getJSONError('access'));
    }
    else if(url === null){
      res.status(404);
      res.send(getJSONError('find'));
    }
    else{
      res.redirect(url.url);
      res.end();
    }
  });
}


function SaveToDB(err, newId, newUrl, res, reqhost){
    Url({ id: newId, url: newUrl }).save(function (err) {
      if (err){
        res.status(500);
        const msg = getJSONError('add');
        res.body = msg
        res.send(msg);
      }
      else{
        const msg = getJSONResponse(newUrl, reqhost, newId);
        res.send(msg);
      }
    });
}


function isValidUrl(url){
  const startWithHttp = url.startsWith('http://') || url.startsWith('https://');
  if(!startWithHttp)
    return false;

  const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  return urlRegex.test(url);
  
}

function getJSONError(operation){
  return JSON.stringify({'error': `Could not ${operation} record. Database error`});
}

function getJSONResponse(url, host, urlID) {
    return JSON.stringify({
      "original_url": url,
      "short_url": host + '/' + urlID
    });
}



