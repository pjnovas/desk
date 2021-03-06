
/**
 * Module dependencies.
 */

var 
    express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , mongoose = require('mongoose')
  /*, RedisStore = require('connect-redis')(express)*/;

var app = express();

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.methodOverride());

//for test
//process.env.TZ = 'Europe/Amsterdam';

switch(app.get('env')){
  case "development":
    app.set('config', require('./app.config.dev')); 
    //app.use(express.errorHandler());
    break;
  case "test":
    app.set('config', require('./app.config.test')); 
    break;
  case "production":
    app.set('config', require('./app.config.prod')); 
    break;
}

var config = app.get('config');

mongoose.connect(config.db.url || ('mongodb://' + config.db.host + '/'+ config.db.name));

app.set('port', process.env.PORT || config.port);

app.use(express.cookieParser(config.session));

app.use(express.session({
    secret: config.session
}));

/*
app.use(express.session({
    secret: config.session
  , store: new RedisStore(config.redis) 
  , cookie: { maxAge: 365 * 24 * 60 * 60 * 1000, path: '/', domain: '.' + config.host }
}));
*/

app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(error);

function error(err, req, res, next) {
  console.error(err.stack);
  res.send(500);
}

require('./models')();
require('./auth')(app);
require('./router')(app);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
