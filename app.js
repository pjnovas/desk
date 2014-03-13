
/**
 * Module dependencies.
 */

var 
    express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , config = require('./app.config.json');

mongoose.connect(config.db.url || ('mongodb://' + config.db.host + '/'+ config.db.name));

var app = express();

// all environments
app.set('port', process.env.PORT || config.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

//app.use(express.cookieParser(config.session));
//app.use(express.session());

app.use(app.router);

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//require('./models')(app);
require('./router')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
