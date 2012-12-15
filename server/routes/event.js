var Event = require('../models/models.js').Event
    ,socket_events = require('./socket_events.js')

exports.create = function(req, res)
                 {
					Event.save(req.body, function (err, event) 
								{
							            if (err) {
							                console.log("Error on update");
							                console.log(err);
							                res.send(500);
							            } else {
							            	socket_events.send_notification(event);
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
					Event.getUserEvents(req.params.id, function (err, events) 
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