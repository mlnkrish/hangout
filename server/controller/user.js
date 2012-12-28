
var User = require('../models/models.js').User;

exports.create = function(req, res)
                 {
					User.save(req.body)
					.then(function (user){
			                res.setHeader('Content-Type', 'application/json');
			                res.send(200,JSON.stringify(user));
					    })
					.fail(function (err){
			                console.log("Error on update");
			                console.log(err);
			                res.send(500);
					    }); 
				  };


exports.get = function(req, res)
                 {
					User.get(req.params.fb_id)
					.then(function (user){
							        res.setHeader('Content-Type', 'application/json');
							        res.send(200,JSON.stringify(user));
							    })
					.fail(function (err){
					                console.log("Error on get");
					                console.log(err);
					                res.send(500);
							    }); 
				  };				  