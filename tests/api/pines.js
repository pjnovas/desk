

var expect = require('expect.js')
  , _ = require('underscore')
  , request = require('request')
  , mongoose = require('mongoose');

request = request.defaults({ json: true });

var Pin;
var pina, pinb, pinc;

module.exports = function(uri, userAuthA, userAuthB){

  uri = uri + '/pins';

  describe('/pins', function(){
    
    before(function(done){
      
      Pin = mongoose.model('Pin');

      createPins(userAuthA._id, userAuthB._id, done);
    });

    it('GET: should retrieve all current Pins for logged in user', function(done){
      
      request.get(uri, _.clone(userAuthA), function (error, response, body) {
        expect(error).to.not.be.ok();
        expect(response.statusCode).to.be.equal(200);
        
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.equal(2);

        done();
      });
    });

    it('POST: should create a Pin for the logged in user', function(done){
      
      request({
        uri: uri, 
        auth: _.clone(userAuthB.auth),
        method: "POST",
        body: { text: "hell yeah" }
      }, function (error, response, body) {
        expect(error).to.not.be.ok();
        expect(response.statusCode).to.be.equal(200);
        
        expect(response.body).to.be.an('object');

        expect(response.body._id).to.be.ok();
        expect(response.body.text).to.be.equal("hell yeah");
        expect(response.body.owner).to.be.eql(userAuthB._id.toString());

        done();
      });  
    });

    describe('/:pinId', function(){ 

      it('GET: should retrieve a Pin by Id', function(done){
        var uriId = uri + "/" + pina._id;

        request.get(uriId, _.clone(userAuthA), function (error, response, body) {
          expect(error).to.not.be.ok();
          expect(response.statusCode).to.be.equal(200);
          
          expect(response.body).to.be.an('object');
          expect(response.body._id).to.be.equal(pina._id.toString());

          done();
        });
      });

      it('GET: should throw 403 if user not owner', function(done){
        var uriId = uri + "/" + pina._id;

        request.get(uriId, _.clone(userAuthB), function (error, response, body) {
          expect(error).to.not.be.ok();
          expect(response.statusCode).to.be.equal(403);
          
          done();
        });
      });

      it('PUT: should update a Pin by Id', function(done){
        var uriId = uri + "/" + pina._id;

        request({
          uri: uriId, 
          auth: _.clone(userAuthA.auth),
          method: "PUT",
          body: { text: "some cool update" }
        }, function (error, response, body) {
          expect(error).to.not.be.ok();
          expect(response.statusCode).to.be.equal(200);
          
          expect(response.body).to.be.an('object');
          expect(response.body._id).to.be.equal(pina._id.toString());
          expect(response.body.text).to.be.equal('some cool update');

          done();
        });
      });

      it('PUT: should throw 403 if user not owner', function(done){
        var uriId = uri + "/" + pina._id;

        request.put(uriId, _.clone(userAuthB), function (error, response, body) {
          expect(error).to.not.be.ok();
          expect(response.statusCode).to.be.equal(403);
          
          done();
        });
      });

      it('DELETE: should throw 403 if user not owner', function(done){
        var uriId = uri + "/" + pina._id;

        request.del(uriId, _.clone(userAuthB), function (error, response, body) {
          expect(error).to.not.be.ok();
          expect(response.statusCode).to.be.equal(403);
          
          done();
        });
      });

      it('DELETE: should remove a Pin by Id', function(done){
        var uriId = uri + "/" + pina._id;

        request.del(uriId, _.clone(userAuthA), function (error, response, body) {
          expect(error).to.not.be.ok();
          expect(response.statusCode).to.be.equal(204);

          Pin.findById(pina._id, function(err, pin){
            expect(pin).to.not.be.ok();
            done();
          });

        });
      });

    });

  });

};

function createPins(usera, userb, done){
  pina = new Pin({ text: "PIN A", owner: usera });
  pinb = new Pin({ text: "PIN B", owner: usera });

  pinc = new Pin({ text: "PIN C", owner: userb });

  pina.save(function(){ 
    pinb.save(function(){
      pinc.save(function(){
        done();
      });
    });
  });
}
