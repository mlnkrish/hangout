exports.config = {

  port: function() {
  	 return process.env.PORT || 3000;
  	},

  redis_client : function(){

  	if (process.env.REDISTOGO_URL){
  		console.log('******************* connecting to redistogo url');
  		return require('redis-url').connect(process.env.REDISTOGO_URL);
  	}
  	else{
  		console.log('******************* connecting to local redis');
  		return require("redis-url").connect();
	}	
  }

}