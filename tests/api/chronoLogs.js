

var expect = require('expect.js')
  , _ = require('underscore')
  , request = require('request')
  , mongoose = require('mongoose')
  , moment = require('moment');

request = request.defaults({ json: true });

var Chrono, ChronoLog;
var chrona, chronb, chronc;
var chronoLoga, chronoLogb, chronoLogc, chronoLogd;

module.exports = function(uri, userAuthA, userAuthB){

  uri = uri + '/chronologs';

  describe('/chronologs', function(){
    
    before(function(done){
      
      Chrono = mongoose.model('Chrono');
      ChronoLog = mongoose.model('ChronoLog');

      createChronos(userAuthA._id, userAuthB._id, function(){
        createChronoLogs(userAuthA._id, done);
      });

    });

    it('GET: should retrieve all Today Logs for the logged in user', function(done){
      
      request.get(uri, _.clone(userAuthA), function (error, response, body) {
        expect(error).to.not.be.ok();
        expect(response.statusCode).to.be.equal(200);
        
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.equal(3);

        done();
      });
    });

    it('GET: should retrieve all Today Logs for a Chrono', function(done){
      
      request.get(uri + '?cid=' + chronoa._id, _.clone(userAuthA), function (error, response, body) {
        expect(error).to.not.be.ok();
        expect(response.statusCode).to.be.equal(200);
        
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.equal(2);

        done();
      });
    });

    it('POST: should create a Log for a Chrono', function(done){
      
      var start =  moment(4, "HH").format();
      var end =  moment(7, "HH").format();

      request({
        uri: uri, 
        auth: _.clone(userAuthA.auth),
        method: "POST",
        body: { 
          chrono: chronoa._id,
          start: start,
          end: end
        }
      }, function (error, response, body) {
        expect(error).to.not.be.ok();
        expect(response.statusCode).to.be.equal(200);
        
        expect(response.body).to.be.an('object');

        expect(response.body._id).to.be.ok();
        expect(response.body.chrono).to.be.equal(chronoa._id.toString());

        expect(moment(response.body.start).format()).to.be.equal(start);
        expect(moment(response.body.end).format()).to.be.equal(end);

        expect(response.body.owner).to.be.eql(userAuthA._id.toString());

        done();
      });  
    });

    describe('/:chronoLogId', function(){ 

      it('GET: should retrieve a Log by Id', function(done){
        var uriId = uri + "/" + chronoLoga._id;

        request.get(uriId, _.clone(userAuthA), function (error, response, body) {
          expect(error).to.not.be.ok();
          expect(response.statusCode).to.be.equal(200);
          
          expect(response.body).to.be.an('object');
          expect(response.body._id).to.be.equal(chronoLoga._id.toString());

          done();
        });
      });

      it('PUT: should update a Chrono Log by Id', function(done){
        var uriId = uri + "/" + chronoLoga._id;

        var end = moment(15, "HH").format();

        request({
          uri: uriId, 
          auth: _.clone(userAuthA.auth),
          method: "PUT",
          body: { end: end }
        }, function (error, response, body) {
          expect(error).to.not.be.ok();
          expect(response.statusCode).to.be.equal(200);
          
          expect(response.body).to.be.an('object');
          expect(response.body._id).to.be.equal(chronoLoga._id.toString());
          expect(moment(response.body.end).format()).to.be.equal(end);

          done();
        });
      });

      it('DELETE: should remove a Chrono Log by Id', function(done){
        var uriId = uri + "/" + chronoLoga._id;

        request.del(uriId, _.clone(userAuthA), function (error, response, body) {
          expect(error).to.not.be.ok();
          expect(response.statusCode).to.be.equal(204);

          ChronoLog.findById(chronoLoga._id, function(err, chrono){
            expect(chrono).to.not.be.ok();
            done();
          });

        });
      });
    });

  });

};

function createChronos(usera, userb, done){
  chronoa = new Chrono({ title: "chrono FA", owner: usera });
  chronob = new Chrono({ title: "chrono FB", owner: usera });

  chronoc = new Chrono({ title: "chrono FC", owner: userb });

  chronoa.save(function(){ 
    chronob.save(function(){
      chronoc.save(function(){
        done();
      });
    });
  });
}

function createChronoLogs(usera, done){

  function getDateTime(hours, days){
    days = days || 0;
    return moment(hours, "HH").add('days', days).format();
  }

  //Today
  chronoLoga = new ChronoLog({ start: getDateTime(1), end: getDateTime(2), chrono: chronoa._id, owner: usera });
  chronoLogb = new ChronoLog({ start: getDateTime(4), end: getDateTime(6), chrono: chronoa._id, owner: usera });
  
  //Yestarday
  chronoLogc = new ChronoLog({ start: getDateTime(6, -1), end: getDateTime(8, -1), chrono: chronoa._id, owner: usera });

  //Other Chrono
  chronoLogd = new ChronoLog({ start: getDateTime(4), end: getDateTime(6), chrono: chronob._id, owner: usera });

  chronoLoga.save(function(){ 
    chronoLogb.save(function(){
      chronoLogc.save(function(){
        chronoLogd.save(function(){
          done();
        });
      });      
    });
  });
}
