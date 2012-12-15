
var User = require('../models/models.js').User;

exports.create = function(req, res)
                 {
					User.save(req.body, function (err, user) 
								{
							            if (err) {
							                console.log("Error on update");
							                console.log(err);
							                res.send(500);
							            } else {
							                console.log("updated");
							                res.setHeader('Content-Type', 'application/json');
							                res.send(200,JSON.stringify(user));
							            }
							    }
							   ); 
				  };


exports.get = function(req, res)
                 {
					User.get(req.params.id, function (err, user) 
								{
							            if (err) {
							                console.log("Error on get");
							                console.log(err);
							                res.send(500);
							            } else {
							                res.setHeader('Content-Type', 'application/json');
							                res.send(200,JSON.stringify(user));
							            }
							    }
							   ); 
				  };				  