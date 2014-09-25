//app.data is an empty object you can use that all modules will have access to.

var socket,
    username,
    userlist,   //string array
    lastSpeaker;
    
app.data.config = {
    hostAddr: 'http://' + document.location.hostname + ':10002',
    socketIoHost: 'http://' + document.location.hostname + ':10002/socket.io/socket.io.js'
}

//app.data.world
//app.data.here


function connectSocketIO() {
    //Inject socket.io into the html. Adding it as a DOM element instead of
    //appending innerHTML prevents the page from re-rendering.
    var socketIoElement = document.createElement('script');
    socketIoElement.src = app.data.config.socketIoHost;
    document.head.appendChild(socketIoElement);
    console.log('Injected socket io source');
}
connectSocketIO();

//function login(io) {
app.on('login', function() {
    console.log('app.data.js: login event detected');
    //Check node server is serving socket.io, and connect
    if(io) {
        socket = io.connect(app.data.config.hostAddr); //'http://' + document.location.hostname + ':10002');
        console.log('Socket connected');
    }
    else {
        sysChat('Game server not found (but HTTP server is up)');
        return;
    }
    if(socket) {
        username = document.getElementById('username').value;

        //Define communications with server
        serverListener();
        
        //Request initial parameters (card templates, etc)
        socket.emit('requestParams', {username: username});
    }
    else {
        sysChat('Sock connection rejected');
    }
});

function serverListener() {
    console.log('serverListener called. Configuring protocol');
    
    socket.on('chat',
        function(data) {
            var msg;
            if(data.username == lastSpeaker) {
                msg = ' : ' + data.msg;
            }
            else {
                msg = '> ' + data.username + ': ' + data.msg;
            }
            console.log(msg);
            
            //Convert keywords to html img tags
            //theMessage = decode(theMessage);

            document.getElementById('chatText').innerHTML = (
                msg + '<br>' + document.getElementById('chatText').innerHTML
            );
        
            lastSpeaker = data.username;
        }
    );
    
    socket.on('params', function(params) {
        app.data.world = params.worldData;
        console.log('Received world data: ', params.worldData);
        sysChat('World data received');

        if(params.respawn == 1) {
            app.data.here = params.origin;
            app.trigger('renderHere', app.data.here);
        }
    });
   
    socket.on('userlist', function(lst) {
        console.log('app.data.js: Received user list from server', lst);
        userlist = lst;
        app.trigger('updateUserList');
    });
    
    socket.on('modWorld', function(mod) {
       app.data.world[mod.index] = mod.data;
       //app.data.world[mod.index1] = mod.data1;
       sysChat('World node '+mod.index+' updated');
       app.trigger('renderHere');
    });

    socket.on('worldMsg', function(msg) {
        app.trigger('worldMsg', msg);
    });
}

function sysChat(msg) {
    document.getElementById('chatText').innerHTML =
        "<code>" + msg + "</code><br>" + document.getElementById('chatText').innerHTML;
    console.log('sysChat: ' + msg);
}

