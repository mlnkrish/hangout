exports.config = {

  port: function() {
  	 return process.env.PORT || 3000;
  	},

  redis_client : function(){
  	if (process.env.REDISTOGO_URL){
  		console.log('******************* connecting to redistogo url');
  		return require('redis-url').connect(process.env.REDISTOGO_URL);
  	}
	else {
    if(process.env.REDISCLOUD_URL){
  		console.log('******************* connecting to rediscloud url');
                var redis = require('redis');
                var url = require('url');
                var redisURL = url.parse(process.env.REDISCLOUD_URL);
                var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
                client.auth(redisURL.auth.split(":")[1]);
                return client
        }
  	else{
  		console.log('******************* connecting to local redis');
  		return require("redis-url").connect();
	   }	
   }
  }

}
