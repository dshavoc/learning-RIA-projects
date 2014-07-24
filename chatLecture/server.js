var io = require('socket.io').listen(10001);
//.listen starts a server that does two things
// 1. It listens at port 3000
// 2. It will host the socket.io for the client to retrieve

//Any port under 10000 can be problematic unless you have root privileges

console.log('server started');

io.sockets.on(
	'connection',
	function(socket) {
		console.log('connection detected');
		socket.on(
			'message',
			function(data) {
				io.sockets.emit('message', data);
				//io.socket would emit to one.
				//io.sockets is a structure representing
				//all sockets connected to this server
			}
		);
	}
);
