
//Globals
var world = {
    data: '',
    loadFile: 'world.json',
    saveFile: 'worldSave.json'
};

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

//Read world data
var fs = require('fs');
fs.readFile(                //non-blocking
    world.loadFile,
    function (err, data) {  //called after file has been completely read in
        if(err) throw err;
        
        try {
            world.data = JSON.parse(data.toString());
        }
        catch(e) {
            console.log('Error loading or JSON parsing world data: ', e);
            return;
        }
        console.log('Imported world data.');
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
                console.log('A player has left.');
                removePlayer(socket);
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
                        'world.data': world.data,
                        'origin': 0,
                        'respawn': 1
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
        
        socket.on(
            'linkNew',
            function(data) {
                if(linkToNewNode(data.from, data.to, data.dir)) {
                    io.emit('params', {
                        'world.data': world.data,
                        'origin': 0,
                        'respawn': 0
                    });
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

function removePlayer(sock) {
    //console.log('leaving socket: ', sock);
    for(var i = 0; i < userlist.length; i++) {
        if(userlist[i].sock == sock) {
            console.log('Removing player ' + userlist[i].name);
            userlist.splice(i,1);   //Remove 1 element at i-th index
            emitUserList();
        }
    }
}

function userListAddNew(name, sock) {
    var usrInList = false;
    for(var i = 0; i<userlist.length; i++){
        if(userlist[i].username == name) usrInList = true;
    }
    if(!usrInList) {
        userlist[userlist.length] = {name: name, sock: sock};
        console.log('new user added to list');
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

//
// WORLD EDITING FUNCTIONS
//

//Returns the opposite direction: N-S, E-W, U-D
function oppositeOf(dir) {
    var op = "NEUSWD";
    op[(op.indexOf(dir)+3)%6];
}

function linkToNewNode(fromNode, toDir) {
    if(toDir.find(/^[NESWUD]/)<0) return false;
    toDir = toDir[0];   //sanitize
   
    var toNode = world.data.length;
    world.data[toNode] = {
        desc: '',
        detail: '',
        N:-1,E:-1,S:-1,W:-1,U:-1,D:-1
    }
    linkBetween(fromNode, toNode, toDir, true);
    return true;    
}

function createDesc(at, desc) {
    if(world.data[at].desc) return false;
    world.data[at].desc = desc;
}

function createDetail(at, det) {
    if(world.data[at].detail) return false;
    world.data[at].detail = det;
}

function linkBetween(from, to, dir, force) {
    if(dir.find(/^[NESWUD]/)<0) return false;
    dir = dir[0];   //sanitize
    if(force || world.data[from][dir] == -1) {
        world.data[from][dir]=to;
        world.data[to][oppositeOf(dir)]=from;
    }
    return true;
}

function saveWorld() {
    console.log('World is being saved to ' + world.saveFile);
    //fs.writeFile()
}