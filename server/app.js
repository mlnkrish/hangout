
/**
 * Module dependencies.
 */

var express = require('express')
  , controller = require('./controller')
  , user = require('./controller/user')
  , app_event = require('./controller/event')
  , path = require('path')
  , config = require('./config').config;

var app = express()
  , server = require('http').createServer(app);

module.exports = app;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', "GET, PUT, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-FB-TOKEN")

    next();
}

app.configure(function(){
  app.set('port', config.port());
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(allowCrossDomain);
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, '../clients/src')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', controller.index);
app.post('/users', controller.authenticate, user.create);
app.get('/users/:fb_id', controller.authenticate, user.get);
app.get('/users/:fb_id/events', controller.authenticate, app_event.getUserEvents);
app.get('/users/:fb_id/events/:id', controller.authenticate, app_event.get);
app.post('/users/:fb_id/events', controller.authenticate, app_event.create);
app.post('/users/:fb_id/events/:id/comments', controller.authenticate, app_event.createComment);


server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

