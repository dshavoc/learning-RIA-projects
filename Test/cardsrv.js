//Includes
var fs = require('fs');
var io = require('socket.io').listen(10002);

//Globals
var cardTemplate;
var DMkey = 'DM';   //preferably a random value. This value is given to the
                    //DM, and the DM must respond to the server with this
                    //to prove authority.
var DMsocket;

//Read templates
fs.readFile(
    'cardTemplate.html',
    function (err, data) {
        if(err) throw err;
        
        cardTemplate = data.toString();
        console.log('Imported card template');
    }
);

//Listen for connections
io.sockets.on(
    'connection',
    function(socket) {
        console.log('Connection detected');
        
        //Bind Disconnect event
        socket.on(
            'disconnect',
            function() { }
        );
        
        //Bind chat message
        socket.on(
            'chat',
            function(data) {
                console.log('Chat: ' + data.username + ': ' + data.msg);
                io.sockets.emit('chat', {username: data.username,
                                         msg: cleanTransmission(data.msg)}
                );
            }
        );
        
        //Bind parameter request (initial/general data)
        socket.on(
            'requestParams',
            function() {
                socket.emit('params', {'cardTemplate': cardTemplate});
            }
        );
        
        //Bind DM request
        socket.on(
            'requestDM',
            function() {
                console.log('DM login request:');
                console.log('  DMsocket:');
                console.log(DMsocket);
                if(DMsocket) {
                    console.log('I think DM is already assigned');
                }
                else {
                    console.log('I think DM not yet assigned');
                    DMsocket = socket;
                }
            }
        );
    }    
);

//Strip the data of any forbidden content, such as script tags, for security
function cleanTransmission(data) {
    //Strip any script tags
    data = data.replace(/<script[^<]+>/ig, 'SCRIPT-TAG-BLOCKED');
    
    return data;
}
