var redis = require("redis"),
    client = redis.createClient();

var User = function() { };

User.save = function(user,fn){
	 var user_json = JSON.stringify(user);
     client.set("user:" + user['id'],user_json,function(err){
     		fn(err,user);
     });
}

User.get = function(id,fn){
     client.get("user:" + id,function(err,user_json){
     	if (err) fn(err);
     	fn(err,JSON.parse(user_json));
     });
}

var flushdb = function(fn){
  client.flushdb(fn);
};


var Event = function() { };

Event._save_given_id = function(id,event,fn){
		  event['id'] = id;
		  var event_json = JSON.stringify(event);
	      client.multi()
                .set("event:" + event['id'],event_json)
                .sadd("event:created_by:" + event['created_by'], event['id'])
                .exec(function(err,replies){
                  	fn(err,event);
                });
};

Event._set_event_count = function(count,fn){
	client.set("event:count",count,fn);
};

Event.save = function(event,fn){
	if(event['id'] != undefined)
	{
		Event._save_given_id(event['id'],event,fn);
	}
	else{
		client.incr("event:count", function(err,value){
		  if(err) fn(err,null);
		  Event._save_given_id(value,event,fn);
    	});
	}
};

Event.get = function(id,fn){
     client.get("event:" + id,function(err,event_json){
     	if (err) fn(err);
     	fn(err,JSON.parse(event_json));
     });
};



exports.User = User;
exports.Event = Event;
exports.clearDb = flushdb;
