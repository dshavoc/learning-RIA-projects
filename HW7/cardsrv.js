
//Globals
var cardTemplate;   //html in string
var deck;           //JSON in string
var DMkey = 'DM';   //preferably a random value. This value is given to the
                    //DM, and the DM must respond to the server with this
                    //to prove authority.
var DMsocket;
var DMusername;
var HOST_PORT = 8080;
var SERV_PORT = 10002;
var userlist = [];      //{name: 'Daniel', sock: socket}

//Launch http server host
//(www.github.com/RIAevangelist/node-http-server)
var server=require('./http.js');
server.deploy(
    {
        port: HOST_PORT,
        root: '.'
    }
);
console.log('HTTP hosted on port ' + HOST_PORT);

//Read card template
var fs = require('fs');
fs.readFile(
    '../Test/cardTemplate.html',
    function (err, data) {
        if(err) throw err;
        
        cardTemplate = data.toString();
        console.log('Imported card template');
    }
);

//Read deck data
fs.readFile(
    '../Test/deck.json',
    function (err, data) {
        if(err) throw err;
        
        deck = data.toString();
        console.log('Imported deck data');
    }
);

//Listen for connections
var io = require('socket.io').listen(SERV_PORT);
console.log('Serving game on port ' + SERV_PORT);
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
                else {
                    console.log('A player has left.');
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
            function(data) {
                if(data.username) {
                    console.log('Detected requestParams, username supplied.');
                    socket.emit('params', {
                        'cardTemplate': cardTemplate,
                        'deck': deck
                    });
                    if(userListAddNew(data.username, socket)) {
                        console.log('Registered player ' + data.username);
                        emitUserList();
                    }
                }
                else {
                    console.log('User requested parameters without supplying username. No response given.');
                }
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
        
        function userListAddNew(name, sock) {
            var usrInList = false;
            for(var i = 0; i<userlist.length; i++){
                if(userlist[i].username == name) usrInList = true;
            }
            if(!usrInList) {
                userlist[userlist.length] = {name: name, sock: sock};
                return true;
            }
            else return false;
        }
        
        function emitUserList() {
            console.log('Sending userlist to all players');
            var lst = [];
            for(var i=0; i<userlist.length; i++) {
                lst[i] = userlist[i].name
            }
            io.sockets.emit('userlist', lst);
        }
    }    
);

//Strip the data of any forbidden content, such as script tags, for security
function cleanTransmission(data) {
    //Strip any script tags
    data = data.replace(/<script[^<]+>/ig, 'SCRIPT-TAG-BLOCKED');
    
    return data;
}
