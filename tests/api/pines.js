

var expect = require('expect.js')
  , request = require('request')
  , config = require('../../app.config.test')
  , baseURL = "http://" + config.host + ":" + config.port + "/api";

request = request.defaults({ json: true });

var uri = baseURL + '/pins';

describe('/pins', function(){
  
  it('GET - should retrieve all current Pins', function(done){
    
    request.get(uri, {
      'auth': {
        'user': 'test',
        'pass': 'test',
        'sendImmediately': false
      }
    }, function (error, response, body) {
      expect(error).to.not.be.ok();
      expect(response.statusCode).to.be.equal(200);
      
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.equal(0);

      done();

    });
    
  });

});
