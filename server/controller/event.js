var Event = require('../models/models.js').Event;

function send_notification (event,notification_type){
	console.log("got to send_notification");
}


exports.create = function(req, res)
                 {
					Event.save(req.body)
					.then(function (event) 
								{
					            	send_notification(event,'event');
					                console.log("updated event =" + event['id']);
					                res.setHeader('Content-Type', 'application/json');
					                res.send(200,JSON.stringify(event));
							    })
					.fail(function(err){
					                console.log("Error on update");
					                console.log(err);
					                res.send(500);
							    }); 
				  };


exports.get = function(req, res)
                 {
					Event.get(req.params.id)
					.then(function (event){
					            	console.log("get event = " + req.params.id);
					                res.setHeader('Content-Type', 'application/json');
					                res.send(200,JSON.stringify(event));
							    })
					.fail(function (err) {
					                console.log("Error on get");
					                console.log(err);
					                res.send(500);
							    }
							   ); 
				  };				  

exports.getUserEvents = function(req, res)
                 {
					Event.getUserEvents(req.params.fb_id)
					.then(function (events){
					            	console.log("get user event = " + req.params.id);
					                res.setHeader('Content-Type', 'application/json');
					                res.send(200,JSON.stringify(events));
							    })
					.fail(function (err){
					                console.log("Error on get");
					                console.log(err);
					                res.send(500);
							    }); 
				  };				  

exports.createComment = function(req, res)
                 {
					Event.get(req.params.id)
					.then(function (anEvent){
					            	var comment = req.body;
					            	if (anEvent['comments'])
					            		anEvent['comments'].push(comment);
					            	else
					            		anEvent['comments'] = [comment];

					            	return Event.save(anEvent);
					            })
					.then(function (event){								        	    
		            				send_notification(event,'comment');
		                			console.log("updated comment for event=" + event['id']);
		                			res.setHeader('Content-Type', 'application/json');
		                			res.send(200,JSON.stringify(event));
							    })
					.fail(function (err){
					                console.log("Error on get");
					                console.log(err);
					                res.send(500);
							    });
				 };
				
				  
