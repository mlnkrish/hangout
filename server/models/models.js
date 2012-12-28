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

Event._save_given_id = function(id,event){
  var d = Q.defer();
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
            if(err) {
               d.reject(err);
            } else {
              d.resolve(event);
            }
        });
  return d.promise;
};

Event._set_event_count = function(count){
    var d = Q.defer();
	client.set("event:count",count,function(err,data){
                    if(err) {
                       d.reject(err);
                    } else {
                      d.resolve(data);
                    }        
    });
    return d.promise;
};

Event._increment_event_count = function(){
    var d = Q.defer();
    client.incr("event:count", function(err,value){
            if(err) {
                d.reject(err);
            } else {
                d.resolve(value);
            }
    });
    return d.promise;
}

Event.save = function(event){
	if(event['id'] != undefined)
	{
		return Event._save_given_id(event['id'],event);
	}
	else{
		return Event._increment_event_count()
                .then(function(value){		  
		              return Event._save_given_id(value,event);
    	        });
	}
};

Event.get = function(id){
    var d = Q.defer();
     client.get("event:" + id,function(err,event_json){
     	if (err){
            d.reject(err);
     	} else {
            d.resolve(JSON.parse(event_json));
        }
     });
     return d.promise;
};

Event._get_invited_event_ids = function(id){
                    var d = Q.defer();
                    var current_date_score = new Date() - START_DATE;                    
                    client.zrangebyscore("user:" + id + ":invited", 
                                          current_date_score, MAX_TIME_IN_MILLI_SEC, 
                                          'limit' , 0, 100 ,function(err,event_ids){
                                          if (err) {
                                            d.reject(err);
                                           }else{
                                            d.resolve(event_ids)
                                           }
                                       });
                    return d.promise;
                }
Event._get_events_given_ids = function(event_ids) {
                        var d = Q.defer();
                        var redis_event_ids = [];
                        event_ids.forEach(function(id){
                           redis_event_ids.push("event:" + id);
                        });
                        if (redis_event_ids.length == 0 ) {
                          d.resolve([]);
                            return;
                        }
                        client.mget(redis_event_ids, function(err,event_jsons){
                                var events = [];
                                event_jsons.forEach(function(event){
                                    events.push(JSON.parse(event));
                                });
                                if (err) {
                                    d.reject(err);
                                }else{
                                    d.resolve(events);  
                                }
                        });
                        return d.promise;
              }

Event.getUserEvents = function(id){
    return Event._get_invited_event_ids(id)
              .then(Event._get_events_given_ids)
};


exports.User = User;
exports.Event = Event;
exports.clearDb = flushdb;
