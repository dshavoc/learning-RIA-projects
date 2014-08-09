var socket,
    username,
    lastSpeaker,
    cardTemplate,
    DMkey;
    
window.onload = function() {
    //Bind player login button
    document.getElementById('login').addEventListener(
        'click',
        function(e) {
            e.preventDefault();	/*inhibits form default function
                            of loading another page via Post */
            
            login(io);
        }
    );
    
    //Bind DM login button
    document.getElementById('loginDM').addEventListener(
        'click',
        function(e) {
            e.preventDefault();	/*inhibits form default function
                            of loading another page via Post */
            
            login(io);
            
            socket.emit('requestDM');
        }
    );
    
    //Bind chat button
    document.getElementById('send').addEventListener(
        'click',
        function(e) {
            
        }
    );
}

function login(io) {
    //Check node server is serving socket.io, and connect
    if(io) {
        socket = io.connect('http://localhost:10002');
        showStatus('Connection established');
    }
    else {
        showStatus('Server not found');
        return;
    }
    if(socket) {
        username = document.getElementById('username').value;
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('chatRoom').classList.remove('hidden');
        document.getElementById('cardBoard').classList.remove('hidden');

        //Define communications with server
        serverListener();
        
        //Request initial parameters (card templates, etc)
        socket.emit('requestParams');
    }
    else {
        showStatus('Sock connection rejected');
    }
}

function serverListener() {
    console.log('configure server listener');
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

            document.getElementById('messages').innerHTML = (
                msg + '<br>' + document.getElementById('messages').innerHTML
            );
        
            lastSpeaker = data.username;
        }
    );
    
    socket.on('params', function(params) {
        cardTemplate = params.cardTemplate;
        console.log('Received card template');
    });
    
    socket.on('grantDM', function(msg) {    //not working
        DMkey = msg.DMkey;
        sysChat('You are the DM');
        console.log('DM assigned');
    });
    
    document.getElementById('send').addEventListener(
	    'click',
	    function() {
	        console.log('message transmitted');
            document.getElementById('message').value=
                document.getElementById('message').value.replace(
                    /[\n\r]/ig,
                    '<br>'
                );

            socket.emit(
                'chat',
                {
                    username: username,
                    msg: document.getElementById('message').value
                }
            );

            document.getElementById('message').value='';
        }
    );
}

function showStatus(msg) {
    document.getElementById('status').innerHTML =
        'Status: ' + msg;
}

function sysChat(msg) {
    document.getElementById('messages').innerHTML =
        "<b>" + msg + "</b>" + document.getElementById('messages').innerHTML;
    console.log('sysChat: ' + msg);
}
