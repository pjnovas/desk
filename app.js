
/**
 * Module dependencies.
 */

var 
    express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , MongoStore = require('connect-mongo')(express);

var app = express();

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.methodOverride());

switch(app.get('env')){
  case "development":
    app.set('config', require('./app.config.dev')); 
    app.use(express.errorHandler());
    break;
  case "test":
    app.set('config', require('./app.config.test')); 
    break;
}

var config = app.get('config');

mongoose.connect(config.db.url || ('mongodb://' + config.db.host + '/'+ config.db.name));

app.set('port', process.env.PORT || config.port);

app.use(express.cookieParser(config.session));

app.use(express.session({
    secret: config.session
  , store: new MongoStore({db: config.db.name, url: config.db.url}) 
  , cookie: { maxAge: 365 * 24 * 60 * 60 * 1000, path: '/', domain: '.' + config.host }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


require('./models')();
require('./auth')(app);
require('./router')(app);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
