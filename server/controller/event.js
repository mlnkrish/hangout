var Event = require('../models/models.js').Event;

function send_notification (event,notification_type){
	console.log("got to send_notification");
}


exports.create = function(req, res)
                 {
					Event.save(req.body, function (err, event) 
								{
							            if (err) {
							                console.log("Error on update");
							                console.log(err);
							                res.send(500);
							            } else {
							            	send_notification(event,'event');
							                console.log("updated event =" + event['id']);
							                res.setHeader('Content-Type', 'application/json');
							                res.send(200,JSON.stringify(event));
							            }
							    }
							   ); 
				  };


exports.get = function(req, res)
                 {
					Event.get(req.params.id, function (err, event) 
								{
							            if (err) {
							                console.log("Error on get");
							                console.log(err);
							                res.send(500);
							            } else {
							            	console.log("get event = " + req.params.id);
							                res.setHeader('Content-Type', 'application/json');
							                res.send(200,JSON.stringify(event));
							            }
							    }
							   ); 
				  };				  

exports.getUserEvents = function(req, res)
                 {
					Event.getUserEvents(req.params.fb_id, function (err, events) 
								{
							            if (err) {
							                console.log("Error on get");
							                console.log(err);
							                res.send(500);
							            } else {
							            	console.log("get user event = " + req.params.id);
							                res.setHeader('Content-Type', 'application/json');
							                res.send(200,JSON.stringify(events));
							            }
							    }
							   ); 
				  };				  

exports.createComment = function(req, res)
                 {
					Event.get(req.params.id, function (err, anEvent) 
								{
							            if (err) {
							                console.log("Error on get");
							                console.log(err);
							                res.send(500);
							            } else {
							            	var comment = req.body;
							            	if (anEvent['comments'])
							            		anEvent['comments'].push(comment);
							            	else
							            		anEvent['comments'] = [comment];

							            		Event.save(anEvent, function (err, event) {
   									        	    if (err) {
									            	    console.log("Error on get");
									                	console.log(err);
									                	res.send(500);
									            	} else {
							            				send_notification(event,'comment');
							                			console.log("updated comment for event=" + event['id']);
							                			res.setHeader('Content-Type', 'application/json');
							                			res.send(200,JSON.stringify(event));
							            			}
							            		});
							    		}
							    });
				 };
				
				  
