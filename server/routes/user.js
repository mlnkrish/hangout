
var User = require('../models/models.js').Models;

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send('list of users {"name":"ciaran"}');
};

exports.create = function(req, res)
                 {
					User.findOneAndUpdate({'_id' : req.body.id }, req.body, { 'upsert':true}, function (err, doc) 
								{
							            if (err) {
							                console.log("Error on update");
							                console.log(err);
							                res.send(500);
							            } else {
							                console.log("updated ");
							                res.send(200);
							            }
							    }
							   ); 
				  };