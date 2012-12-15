var Socket = require('../models/models.js').Socket;
// , io = require('socket.io');
// handle socket io


var sockets = {
};

exports.Sockets = sockets;

exports.socketEvent = function(user_id,socket_id){
	Socket.save(user_id,socket_id);
};


exports.send_notification = function(event){
	console.log("got to send_notification");
	var user_ids = []
	event['invited_friends'].forEach(function(friend){
		user_ids.push(friend['id']);
	});
	console.log("collected user_ids " +  user_ids);
	Socket.get(user_ids, function(err,socket_ids){
		console.log("get socket ids " +  socket_ids);
		if(err) return;
		socket_ids.forEach(function(socket_id){
				if(socket_id && sockets[socket_id])
				{	
					console.log("writing to socket with get_response and json = " + JSON.stringify(event));
					sockets[socket_id].emit('get_response', JSON.stringify(event));	
				}
				else
				{
					console.log("not finding socket ids " +  socket_id + " Sockets[socket_id] =" + sockets[socket_id]);
				}

			});		
	});
};

