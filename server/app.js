
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , app_event = require('./routes/event')
  , socket_events = require('./routes/socket_events.js')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io');

var app = express()
  , server = require('http').createServer(app)
  , io = io.listen(server);

var RedisStore = require('socket.io/lib/stores/redis')
  , redis  = require('socket.io/node_modules/redis')
  , pub    = redis.createClient()
  , sub    = redis.createClient()
  , client = redis.createClient();

io.set('store', new RedisStore({
  redisPub : pub
, redisSub : sub
, redisClient : client
}));


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
  app.use(express.static(path.join(__dirname, '../clients/android/assets/www')));
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

io.sockets.on('connection', function (socket) {

  socket.on("register", function(user_id,msg) {
    socket_events.Sockets[socket.id] = socket;
    console.log('I received a private message with socket_id = ' + socket.id + " by user_id " , user_id, ' saying ', msg);
    console.log("Sockets length = " + Object.keys(socket_events.Sockets).length);
    socket_events.socketEvent(user_id, socket.id);
  });

  socket.on('disconnect', function(){
    console.log('******** removing socket_id = ' + socket.id );
    delete socket_events.Sockets[socket.id];
  });


});



