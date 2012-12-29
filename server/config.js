exports.config = {

  port: function() {
  	 return process.env.PORT || 3000;
  	},

  redis_client : function(){
  	if (process.env.REDISTOGO_URL){
  		return require('redis-url').connect(process.env.REDISTOGO_URL);
  	}
  	else{
  		return require("redis-url").connect();
	}	
  }

}