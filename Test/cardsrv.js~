//Includes
var fs = require('fs');
var io = require('socket.io').listen(10002);

//Globals
var cardTemplate;   //html in string
var deck;           //JSON in string
var DMkey = 'DM';   //preferably a random value. This value is given to the
                    //DM, and the DM must respond to the server with this
                    //to prove authority.
var DMsocket;
var DMusername;

//Read card template
fs.readFile(
    'cardTemplate.html',
    function (err, data) {
        if(err) throw err;
        
        cardTemplate = data.toString();
        console.log('Imported card template');
    }
);

//Read deck data
fs.readFile(
    'deck.json',
    function (err, data) {
        if(err) throw err;
        
        deck = data.toString();
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
            function() {
                if(socket == DMsocket) {
                    console.log('The DM has left!');
                    io.emit('chat', {username: 'Sys', msg: 'The DM has left'});
                }
            }
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
                socket.emit('params', {
                    'cardTemplate': cardTemplate,
                    'deck': deck
                });
            }
        );
        
        //Bind DM request
        socket.on(
            'requestDM',
            function(data) {
                console.log('DM login request:');
                if(DMsocket) {
                    console.log('  Rejected');
                    
                    socket.emit('answerDM', 
                        {isGranted: 'n', DMusername: DMusername}
                    );
                }
                else {
                    DMusername = data.username;
                    console.log('DM position assigned to: ' + DMusername);
                    DMsocket = socket;
                    
                    socket.emit('answerDM', {isGranted: 'y', DMkey: DMkey});
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
