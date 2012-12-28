var redis = require("redis"),
    client = redis.createClient(),
    Q = require("q");;

var START_DATE = new Date(2000,1,1);
var MAX_TIME_IN_MILLI_SEC = new Date(2112,1,1) - new Date(2000,1,1);

var User = function() { };

User.save = function(user){
     var d = Q.defer();
	 var user_json = JSON.stringify(user);
     client.set("user:" + user['id'],user_json,function(err){
            if(err) {
                d.reject(err);
            } else {
                d.resolve(user);
            }
     });
     return d.promise;
}

User.get = function(id,fn){
    var d = Q.defer();
     client.get("user:" + id,function(err,user_json){
        if(err) {
            d.reject(err);
        } else {
     	    d.resolve(JSON.parse(user_json));
        }
     });
     return d.promise;
}

var flushdb = function(fn){
  client.flushdb(fn);
};


var Event = function() { };

Event._save_given_id = function(id,event,fn){
		  event['id'] = id;
		  var commands = [];
		  var date_score = new Date(event['event_date_time']) - - START_DATE;
		  commands.push(['set',"event:" + event['id'],JSON.stringify(event)]);
		  commands.push(['zadd',"event:created_by:" + event['created_by'], date_score,event['id']]);
		  event['invited_friends'].forEach(function(friend){
		  	commands.push(['zadd',"user:" + friend['id'] + ":invited", date_score,event['id']]);
		  });
	      client.multi(commands)
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

Event.getUserEvents = function(id,fn){
	var current_date_score = new Date() - START_DATE;
     client.zrangebyscore("user:" + id + ":invited", current_date_score, MAX_TIME_IN_MILLI_SEC, 'limit' , 0, 100 ,function(err,event_ids){
     	if (err) fn(err);
     	var redis_event_ids = [];
     	event_ids.forEach(function(id){
	  		redis_event_ids.push("event:" + id);
		  });
     	if (redis_event_ids.length == 0 ) return fn(null,[]);
     	client.mget(redis_event_ids, function(err,event_jsons){
     		var events = [];
     		event_jsons.forEach(function(event){
     			events.push(JSON.parse(event));
     		});
     		fn(err,events);	
     	});     	
     });
};


exports.User = User;
exports.Event = Event;
exports.clearDb = flushdb;
