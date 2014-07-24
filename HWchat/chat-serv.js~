//Start a server listening on given port, that will host socket.io API
var io = require('socket.io').listen(10001);

console.log('Chat server started');

//When a new connection is requested remotely...
io.sockets.on(
    'connection',
    
    //... bind this connection handling function to a socket-connected event
    function(socket) {
        console.log('Connection detected');
        socket.on(
            'message',
            
            //Bind received 'message' event to message-handling function
            function(data) {
                console.log(data);
                
                //Re-transmit out all data received as a 'message'
                io.sockets.emit('message', data);
   	            //io.socket would emit to one.
                //io.sockets is a structure representing
                //all sockets connected to this server
            }
        );
    }
);
