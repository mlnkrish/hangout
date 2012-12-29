exports.config = {

  port: function() {
  	 return process.env.PORT || 3000;
  	},

  redis_client : function(){

  	if (process.env.REDISTOGO_URL){
  		console.log('******************* +++++++++++ should come here url =' + process.env.REDISTOGO_URL );
  		return require('redis-url').connect(process.env.REDISTOGO_URL);
  	}
  	else{
  		console.log('******************* should not come here');
  		// return require("redis-url").connect();
	}	
  }

}