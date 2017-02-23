const MongoClient = require('mongodb').MongoClient;
const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];
const {host, port, db} = config.database
const mongoose = require('mongoose');
const Url = require('./models/url');

mongoose.connect(`mongodb://${host}/${db}`);

exports.addUrl = function (newUrl, reqhost, response) {
  if(isValidUrl(newUrl)){
    Url.findOne().sort('-id').exec(function(err, url){ 
      return SaveToDB(err, url, newUrl, response, reqhost)});
  }
  else{
    const msg = getJSONResponse(null, null, null, newUrl + ' is not a valid Url. Url should be in format http://www.google.com');
    response.send(msg);
  }
}

exports.findUrlByID = function (id, response) {
  Url.findOne({ id: id }, (err, url) => {
    if (err){
      response.status(500);
      response.send(databaseError('access'));
    }
    else{
      response.redirect(url.url);
      response.end();
    }
  });
}


function SaveToDB(err, url, newUrl, res, reqhost){
    const newId = url.id + 1;
    Url({ id: newId, url: newUrl }).save(function (err) {
      if (err){
        res.status(500);
        const msg = databaseError('add');
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

function databaseError(operation){
  return getJSONResponse(null, null, null, `Could not ${operation} record. Database error`);     
}

function getJSONResponse(url, host, urlID, error) {
  if(error)
    return JSON.stringify({'error': error});

    return JSON.stringify({
      "original_url": url,
      "short_url": host + '/' + urlID
    });
}



