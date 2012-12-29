var User = require('../models/models.js').User,
   https = require('https'),
   uuid = require('node-uuid');;

exports.DEBUG_FLAG = true;

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.authenticate = function (req,res,next){
  if (exports.DEBUG_FLAG){
  	next();
  	return;
  }
  var token = req.header('token');
  var route = req.route;
  if(route.path == "/users" && route.method == 'post' ){
  	authenticate_create_user(token,req,res,next);
  } else {
  	authenticate_others(token,req.fb_id,req,res,next);
  }

};


function authenticate_create_user(token,req,res,next){
	var fb_id = req.body.id
	if(!token){
		validate_fb_token_and_generate_user_token(req,res,next);
	}else{
		authenticate_others(token,fb_id,req,res,next);
	}
}


exports.validate_fb_token = function(fb_token,req,res,next){
	https.get('https://graph.facebook.com/me?access_token=' + fb_token,function(result){
		result.on('data',function(d){
			var fb_data = JSON.parse(d);
			if (fb_data.id != req.body.id){
				send_unauthorized(res,'access denied');
			} else {
				var token = uuid.v1();
				User.set_token(token,req.body.id)
					.then(function(){
						req.body.token = token;
						next();
					})
					.fail(function(err){
						send_unauthorized(res,'access denied');		
					});
			}
		});
		result.on('error',function(e){
			send_unauthorized(res,'access denied');
		})
	});
}

function validate_fb_token_and_generate_user_token(req,res,next){
	var fb_token = req.header('X-FB-TOKEN');
	if(!fb_token){
		send_unauthorized(res,'access denied');
	} else{
		exports.validate_fb_token(fb_token,req,res,next);
	}
}

function send_unauthorized(res,msg){
  	// res.setHeader('Content-Type', 'application/json');
	res.send(403,msg);
}

function authenticate_others(token,request_fb_id,req,res,next){
  User.get_fb_id(token)
  	  .then(function(fb_id){
  	  	if(request_fb_id == fb_id){
  	  		next();
  	  	} else{
			send_unauthorized(res,"Unauthorized access");
  	  	}
  	  });
}