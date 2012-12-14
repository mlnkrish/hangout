var redis = require("redis"),
        client = redis.createClient();

var User = function() { };

User.save = function(user,fn){
     client.set("user:" + user['id'], JSON.stringify(user),fn);
}

User.get = function(id,fn){
     client.get("user:" + id,fn);
}

var flushdb = function(fn){
  client.flushdb(fn);
};


var Event = function() { };

Event.save = function(event,fn){
     client.set("event:" + event['id'], JSON.stringify(event),fn);
}

Event.get = function(id,fn){
     client.get("event:" + id,fn);
}



exports.User = User;
exports.Event = Event;
exports.clearDb = flushdb;
