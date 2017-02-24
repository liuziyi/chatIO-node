var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var usernames = []

app.get('/', function(req,res,next){
	res.sendFile(__dirname + '/index.html')
});	

io.sockets.on('connection', function(socket){
	console.log('Socket connected')

	//Users
	socket.on('new user', function(data,callback){
		if(usernames.indexOf(data) != -1){
			callback(false)
		}else{
			callback(true)
			socket.username = data;
			usernames.push(socket.username);
			updateUsernames();
		}
	});

	function updateUsernames(){
		io.sockets.emit('usernames', usernames);
	}

	//Messages
	socket.on('send chat message', function(data){
		io.sockets.emit('new chat message', {msg: data, user: socket.username});
	});	

	//Disconnect
	socket.on('disconnect', function(data){
		if(!socket.username){
			return
		}
		usernames.splice(usernames.indexOf(socket.username), 1);
		updateUsernames();
	});

});

server.listen(3000);