var socket,
    username,
    lastSpeaker;

window.onload = function() {	//waits for entire code to be downloaded
    document.getElementById('login').addEventListener(
        'click',
        function(e) {
            e.preventDefault();	/*inhibits form default function
                            of loading another page via Post */
            
            //Check node server is serving socket.io
            if(!io) {
                
                document.getElementById('legend').innerHTML =
                    'Login - SERVER NOT FOUND';
                return;
            }
            else {
                socket = io.connect('http://192.168.1.101:10001');
            }
            
            //Check for socket connection
            if(socket) {
                username = document.getElementById('username').value;
                document.getElementById('loginForm').classList.add('hidden');
                document.getElementById('chatRoom').classList.remove('hidden');
	
                serverListener();
            }
            else {
                document.getElementById('legend').innerHTML =
                    'Login - SOCKET CONNECTION REJECTED';
            }
        }
    );
};

function serverListener() {

    socket.on(
        'chat',
        function(data) {
            var msg = decode(data.msg);

            if(data.username == lastSpeaker) {
                msg = ' : ' + msg;
            }
            else {
                msg = '> ' + data.username + ': ' + msg;
            }

            document.getElementById('messages').innerHTML = (
                msg + '<br>' + document.getElementById('messages').innerHTML
            );
        
            lastSpeaker = data.username;
        }
    );

    function decode(msg) {        
        
        //Special character sequences (smileys)
        msg = msg.replace(/:\)/g, '<img src="img/Happyface.jpg">');
        
        //Hyperlinks
        msg = msg.replace(/<<([^<>])>>\[([^\[\]]+)\]/,
            '<a href="$2">$1</a>');                             //first
        msg = msg.replace(/<<([^<>]+)>>/,
            '<a href="$1">$1</a>');                             //second
        
        //Web images
        msg = msg.replace(/\[([^\[\]]+)\]/, '<img src="$1">');  //third
        return msg;
    }

    document.getElementById('send').addEventListener(
	    'click',
	    function() {	//won't use data passed in, so omit it
	        console.log('message transmitted');
            document.getElementById('message').value=
                document.getElementById('message').value.replace(
                    /[\n\r]/ig,
                    '<br>'
                );

            socket.emit(
                'message',
                {
                    username: username,
                    message: document.getElementById('message').value
                }
            );

            document.getElementById('message').value='';
        }
    );
}
