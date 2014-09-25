(
    function(){
        var moduleName='chat';
        
        function render(el){
            console.log('chat.js render called');
            
            //When user logs in, set up chatroom
            app.on('login', function(username) {
                console.log('chat.js: login event detected');
                //Capture chat input. If Enter key detected, send message.
                document.getElementById('chatInput').addEventListener(
                    'keypress',
                    function(e) {
                        if(e.keyCode != 13)
                            return;
                        //Enter key pressed
                        e.preventDefault();   //Preclude the terminal newline
                        parseInput();
                    }
                );
            });
            
            app.on('updateUserList', function() {
                //userlist data has been stored in app.data.js. Need only update UI.
                var listHTML = '';
                for(var i=0; i<userlist.length; i++) {
                    listHTML += userlist[i] + '<br>';
                }
                document.getElementById('chatLobby').innerHTML = listHTML;
                console.log('chat.js: User list updated');
            });
            
            console.log('chat.js app event listeners defined');
        }
        
        //Frequent
        function parseInput() {
            //Get user input and clear the input area
            var t = document.getElementById('chatInput').value
            var tu = t.toUpperCase();
            document.getElementById('chatInput').value='';
            
            //Parse SAY command
            if(tu.indexOf('SAY ')==0)
                sendChatMessage(t.substr(4));

            //Parse GO command
            var move = tu.match(/^GO\s+([NESWUD])/); //"GO NORTH" -> ["GO N", "N"]
            if(move) {
                app.trigger('move', move[1]);
            }
            
            //Parse LINK NEW command
            var link = tu.match(/^LINK NEW\s+([NESWUD])/);
            if(link) {
                console.log('link new:', link);
                socket.emit('linkNew', {from: app.data.here, dir: link[1]})
            }
            
            //Parse DESCRIBE HERE command
            var desc = tu.match(/^DESCRIBE HERE ([^<>]+)/);
            if(desc) {
                var txt = t.substr(tu.indexOf(desc[1]), desc[1].length);
                console.log('User described here:', txt);
                socket.emit('descHere', {index: app.data.here, desc: txt});
            }
            
            //Parse DETAIL HERE command
            var det = tu.match(/^DETAIL HERE ([^<>]+)/);
            if(det) {
                var txt = t.substr(tu.indexOf(det[1]), det[1].length);
                console.log('User detailed here:', txt);
                socket.emit('detHere', {index: app.data.here, det: txt});
            }
            
            //Parse LINK TO command
            
        }
        
        //Frequent use, so declare in outer scope to dedicate the memory
        function sendChatMessage(m) {
            console.log('message transmitted');
            m=m.replace(/[\n\r]/ig,'<br>');

            socket.emit(
                'chat',
                {
                    username: username,
                    msg: m
                }
            );
        }
        
        exports(moduleName,render);    
    }
)();
