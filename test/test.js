let assert = require('chai').assert;
let shortener = require('../urlparser').getJSON Response;
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('URL Parser', function() {
  describe('shorten()', function() {
    it('should return a shortened url if valid', function() {
      var shortenerJSON = shortener('https://www.google.com', 'http://localhost');
      var expected = '{"original_url":"https://www.google.com","short_url":"http://localhost';
      assert.include(shortenerJSON, expected);
    });
  });
});

describe('/GET http://www.freecodecamp.com', () => {
      it('return json with the url that was shortened', (done) => {
        chai.request(server)
            .get('/api/new/http://www.freecodecamp.com')
            .end((err, res) => {
                res.text.should.include('http://www.freecodecamp.com');
                res.text.should.include("original_url");
              done();
            });
      });
  });

describe('/GET localhost:8080', () => {
      it('return json with the url that was shortened', (done) => {
        chai.request(server)
            .get('/api/new/localhost:8080')
            .end((err, res) => {
                res.text.should.include('localhost:8080');
                res.text.should.include("original_url");
              done();
            });
      });
  });

  describe('/GET invalid url', () => {
      it('return error msg if invalid url', (done) => {
        const some_invalid_url =  'dummy_data';
        chai.request(server)
            .get('/api/new/' + some_invalid_url)
            .end((err, res) => {
                res.text.should.include("error");
              done();
            });
      });
  });


  //to-write

  /*
  given a db error I get correct Response, eg add, access error

  given a invalid url i get correct warning

  