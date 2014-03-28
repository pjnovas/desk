

var expect = require('expect.js')
  , _ = require('underscore')
  , request = require('request')
  , mongoose = require('mongoose')
  , moment = require('moment');

request = request.defaults({ json: true });

var Chrono;
var chrona, chronb, chronc;

module.exports = function(uri, userAuthA, userAuthB){

  uri = uri + '/chronos';

  describe('/chronos', function(){
    
    before(function(done){
      
      Chrono = mongoose.model('Chrono');

      createChronos(userAuthA._id, userAuthB._id, done);
    });

    it('GET: should retrieve all current Chronos for logged in user', function(done){
      
      request.get(uri, _.clone(userAuthA), function (error, response, body) {
        expect(error).to.not.be.ok();
        expect(response.statusCode).to.be.equal(200);
        
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.equal(2);

        done();
      });
    });

    it('POST: should create a Chrono for the logged in user', function(done){
      
      request({
        uri: uri, 
        auth: _.clone(userAuthB.auth),
        method: "POST",
        body: { title: "hell yeah" }
      }, function (error, response, body) {
        expect(error).to.not.be.ok();
        expect(response.statusCode).to.be.equal(200);
        
        expect(response.body).to.be.an('object');

        expect(response.body._id).to.be.ok();
        expect(response.body.title).to.be.equal("hell yeah");
        expect(response.body.owner).to.be.eql(userAuthB._id.toString());

        done();
      });  
    });

    describe('/:chronoId', function(){ 

      it('GET: should retrieve a Chrono by Id', function(done){
        var uriId = uri + "/" + chronoa._id;

        request.get(uriId, _.clone(userAuthA), function (error, response, body) {
          expect(error).to.not.be.ok();
          expect(response.statusCode).to.be.equal(200);
          
          expect(response.body).to.be.an('object');
          expect(response.body._id).to.be.equal(chronoa._id.toString());

          done();
        });
      });

      it('PUT: should update a Chrono by Id', function(done){
        var uriId = uri + "/" + chronoa._id;

        var start =  moment(4, "HH").format();
        var end =  moment(7, "HH").format();

        request({
          uri: uriId, 
          auth: _.clone(userAuthA.auth),
          method: "PUT",
          body: { 
            title: "some cool update",
            start: start,
            end: end
          }
        }, function (error, response, body) {
          expect(error).to.not.be.ok();
          expect(response.statusCode).to.be.equal(200);
          
          expect(response.body).to.be.an('object');
          expect(response.body._id).to.be.equal(chronoa._id.toString());
          expect(response.body.title).to.be.equal('some cool update');
          expect(moment(response.body.start).format()).to.be.equal(start);
          expect(moment(response.body.end).format()).to.be.equal(end);

          done();
        });
      });

      it('DELETE: should remove a Chrono by Id', function(done){
        var uriId = uri + "/" + chronoa._id;

        request.del(uriId, _.clone(userAuthA), function (error, response, body) {
          expect(error).to.not.be.ok();
          expect(response.statusCode).to.be.equal(204);

          Chrono.findById(chronoa._id, function(err, chrono){
            expect(chrono).to.not.be.ok();
            done();
          });

        });
      });

    });

  });

};

function createChronos(usera, userb, done){
  chronoa = new Chrono({ title: "chrono A", owner: usera });
  chronob = new Chrono({ title: "chrono B", owner: usera });

  chronoc = new Chrono({ title: "chrono C", owner: userb });

  chronoa.save(function(){ 
    chronob.save(function(){
      chronoc.save(function(){
        done();
      });
    });
  });
}
