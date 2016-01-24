
//Globals
var world = {
    data: '',   //{desc: "a place", detail: "A complete visual sentence.", N:-1,E:2,S,W,U,D}
    origin: 0,
    loadFile: 'world.json',
    saveFile: 'worldSave.json'
};

var HOST_PORT = 8080;
var SERV_PORT = 10002;
var userlist = [];      //{name: 'Daniel', sock: socket, loc: 0}

var dirNameMap = {  N:'north',
                    E:'east',
                    S:'south',
                    W:'west',
                    U:'up',
                    D:'down'
}

//Launch http server host
//(www.github.com/RIAevangelist/node-http-server)
var server=require('./node_modules/node-http-server/server/http.js');
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
        testWorldGen();
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
                        'worldData': world.data,
                        'origin': world.origin,
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
        
        socket.on('move', function(m) {
            //m{from, to, dir}
            //Identify which user moved, and notify other users that could see it.
            //Player identified by socket.id moved.
            //Players saw it if they are NOT this player, and they are either in m.from or m.to
            var name = sockId2UsrName(socket.id);
            for(var i = 0; i < userlist.length; i++) {
                if(userlist[i].sock.id == socket.id) {
                    //Move this player
                    userlist[i].loc = m.to;
                    var usrsHere = fgetUsrsHereNot(m.to,i); 
                    if(!usrsHere) usrsHere = 'nobody else';
                    sendWorldMessage(i, 'You see '+usrsHere+' in the room.');
                }
                else if (userlist[i].loc == m.from) {
                    //Tell this player that the moving player exited
                    sendWorldMessage(i, '<span class=userName>'+name+'</span> left '+dirNameMap[m.dir]+' toward '+world.data[m.to].desc+'.');
                }
                else if (userlist[i].loc == m.to) {
                    //Tell this player that the moving player entered
                    sendWorldMessage(i, '<span class=userName>'+name+'</span> came '+dirNameMap[m.dir]+' from '+world.data[m.from].desc+'.');
                }
            }
        });
        
        socket.on('linkNew', function(data) {
            var newNode = linkToNewNode(data.from, data.dir);
            if(newNode > -1) {
                updateUserWorld(data.from);
                updateUserWorld(newNode);
            }
        });
        
        socket.on('descHere',
            function(data) {
                createDesc(data.index, data.desc);
                updateUserWorld(data.index);
            }
        );
        
        socket.on('detHere',
            function(data) {
                createDetail(data.index, data.det);
                updateUserWorld(data.index);
            }
        );
    }    
);

//
// USER INTERFACE FUNCTIONS
//

function sendWorldMessage(usrI, msg) {
    userlist[usrI].sock.emit('worldMsg', msg);
}

//Returns a comma-separated list of users at here, with CSS styles
function fgetUsrsHereNot(here, usrI) {
    var usrs='';
    for(var i=0;i<userlist.length;i++){
        if(i!=usrI && userlist[i].loc==here) {
            usrs += '<span class=userName>'+userlist[i].name+'</span>, ';
        }
    }
    if(usrs) usrs.slice(0,-2);   //If non-empty list, cut trailing ', '
    return usrs;
}

//Sends a packet to update the world at a single node
function updateUserWorld(index) {
    io.emit('modWorld', {
        index: index,
        data: world.data[index]
    });
}

//Strip the data of any forbidden content, such as script tags, for security
function cleanTransmission(data) {
    //Strip any script tags
    data = data.replace(/<script[^<]+>/ig, 'SCRIPT-TAG-BLOCKED');
    
    return data;
}

//
// USER LIST CONTROLS
//

function removePlayer(sock) {
    //console.log('leaving socket: ', sock.id);
    for(var i = 0; i < userlist.length; i++) {
        if(userlist[i].sock.id == sock.id) {
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
        userlist[userlist.length] = {name: name, sock: sock, loc: world.origin};
        console.log('new user added to list');
        return true;
    }
    else return false;
}

function emitUserList() {
    console.log('Sending userlist to all players');
    var lst = [];
    for(var i=0; i<userlist.length; i++) {
        lst[i] = userlist[i].name;
    }
    io.sockets.emit('userlist', lst);
}

function sockId2UsrName(sid) {
    for(var i = 0; i < userlist.length; i++) {
        if(userlist[i].sock.id == sid) return userlist[i].name;
    }
}

//
// WORLD EDITING FUNCTIONS
//

//Returns the opposite direction: N-S, E-W, U-D
function oppositeOf(dir) {
    var op = "NEUSWD";
    return op[(op.indexOf(dir)+3)%6];
}

function linkToNewNode(fromNode, toDir) {
    if(toDir.search(/^[NESWUD]/)<0) return false;
    toDir = toDir[0];   //sanitize
   
    var toNode = world.data.length;
    world.data[toNode] = {
        desc: '',
        detail: '',
        N:-1,E:-1,S:-1,W:-1,U:-1,D:-1
    };
    console.log('New node '+toNode+' created. Linking now...');
    linkBetween(fromNode, toNode, toDir, true);
    //saveWorld();
    return toNode;    
}

function createDesc(at, desc) {
    if(world.data[at].desc) return false;
    world.data[at].desc = desc;
}

function createDetail(at, det) {
    if(world.data[at].detail) {
        console.log('Detail already exists at node '+at+'!');
        return false;
    }
    console.log('Added detail to node '+at);
    world.data[at].detail = det;
}

function linkBetween(from, to, dir, force) {
    if(dir.search(/^[NESWUD]/)<0) return false;
    dir = dir[0];   //sanitize
    if(force || world.data[from][dir] == -1) {
        world.data[from][dir]=to;
        world.data[to][oppositeOf(dir)]=from;
        console.log('Node '+from+' linked to node '+to+' in '+dir+' direction');
    }
    return true;
}

function saveWorld() {
    fs.writeFile(world.saveFile, JSON.stringify(world.data), function (err) {
        if (err) throw err;
        console.log('World saved to ' + world.saveFile);
    });
}

function testWorldGen() {
    console.log('Running procedural world editing functions ...');
    
    //Testing linkBetween... WORKS
    //linkBetween(0,1,'W',0);
    
    //Testing linkToNewNode... WORKS
    var newNode = linkToNewNode(1, 'D');
    createDesc(newNode, 'a secret pantry');
    createDetail(newNode, 'There are honey pots lining the musty walls. Some of them are cracked, empty, and abandoned, but some appear to hold promise still.');
    
    //Testing saveWorld()... WORKS, but output is on one line human readable. I could use .replace to add CR after desc, detail, D.
    saveWorld();
}
