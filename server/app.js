
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , app_event = require('./routes/event')
  , path = require('path');

var app = express()
  , server = require('http').createServer(app);

module.exports = app;

app.configure(function(){
  app.set('port', 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, '../clients/src')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users/:id', user.get);
app.post('/users',user.create);
app.get('/users/:id/events', app_event.getUserEvents);
app.get('/events/:id', app_event.get);
app.post('/events',app_event.create);
app.post('/events/:id/comments', app_event.createComment);


server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

