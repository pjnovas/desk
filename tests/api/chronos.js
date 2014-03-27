

var expect = require('expect.js')
  , _ = require('underscore')
  , request = require('request')
  , mongoose = require('mongoose');

request = request.defaults({ json: true });

var Chrono, ChronoLog;
var chrona, chronb, chronc;
var chronLoga, chronLogb;

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

        request({
          uri: uriId, 
          auth: _.clone(userAuthA.auth),
          method: "PUT",
          body: { title: "some cool update" }
        }, function (error, response, body) {
          expect(error).to.not.be.ok();
          expect(response.statusCode).to.be.equal(200);
          
          expect(response.body).to.be.an('object');
          expect(response.body._id).to.be.equal(chronoa._id.toString());
          expect(response.body.title).to.be.equal('some cool update');

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

function createChronoLogs(usera, done){

  function getDateTime(hours){
    var dt = new Date();
    var hours = dt.setHours(dt.getHours() + hours);
    return dt;
  }

  chronoLoga = new ChronoLog({ start: getDateTime(+1), end: getDateTime(+2), chrono: chronob._id, owner: usera });
  chronoLogb = new ChronoLog({ start: getDateTime(+4), end: getDateTime(+6), chrono: chronob._id, owner: usera });

  chronoLoga.save(function(){ 
    chronoLogb.save(function(){
      done();
    });
  });
}
