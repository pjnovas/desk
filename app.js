
/**
 * Module dependencies.
 */

var 
    express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , MongoStore = require('connect-mongo')(express)
  , config = require('./app.config.json');

mongoose.connect(config.db.url || ('mongodb://' + config.db.host + '/'+ config.db.name));

var app = express();

// all environments
app.set('config', config);
app.set('port', process.env.PORT || config.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser(app.get('config').session));

app.use(express.cookieSession());

/*
//TODO: CHECK WHY THIS DOESN'T WORK
app.use(express.session({
    secret: app.get('config').session
  , store: new MongoStore({db: app.get('config').db.name, url: app.get('config').db.url}) 
  , cookie: { maxAge: 365 * 24 * 60 * 60 * 1000, path: '/', domain: '.' + app.get('config').host }
}));
*/

app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./models')(app);
require('./auth')(app);
require('./router')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
