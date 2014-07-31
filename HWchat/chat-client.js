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
            if(io) {
                socket = io.connect('http://192.168.1.168:10001');
            }
            else {
                document.getElementById('legend').innerHTML =
                    'Login - SERVER NOT FOUND';
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
        'message',
        function(data) {
            var theMessage;
            if(data.username == lastSpeaker) {
                theMessage = ' : ' + data.message;
            }
            else {
                theMessage = '> ' + data.username + ': ' + data.message;
            }
            
            //Convert keywords to html img tags
            theMessage = decode(theMessage);

            document.getElementById('messages').innerHTML = (
                theMessage + '<br>' + document.getElementById('messages').innerHTML
            );
        
            lastSpeaker = data.username;
        }
    );

    function decode(msg) {
        if(msg.contains('blue')) {
            document.getElementById('messages').style =
                'background-color:cornflowerblue;';
        } else if(msg.contains('white')) {
            document.getElementById('messages').style =
                'background-color:white;';
        }
        
        
        //Special character sequences (smileys)
        msg = msg.replace(':)', '<img src="img/Happyface.jpg">');
        
        //Hyperlinks
        msg = msg.replace(/<<(.+)>>\[(.+)\]/, '<a href="$2">$1</a>');     //first
        msg = msg.replace(/<<(.+)>>/, '<a href="$1">$1</a>');             //second
        
        //Web images
        msg = msg.replace(/\[(.+)\]/, '<img src="$1">');                //third
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
