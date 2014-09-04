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
                        if(e.charCode != 13)
                            return;
                        //Enter key pressed
                        e.preventDefault();   //Preclude the terminal newline
                        sendChatMessage();
                    }
                );
            });
            
            app.on('updateUserList', function(e) {
                //userlist data has been stored in app.data.js. Need only update UI.
                var listHTML;
                for(var i=0; i<userlist.length; i++) {
                    listHTML += '<p>' + userlist[i] + '</p>';
                }
                document.getElementById('chatLobby').innerHTML = listHTML;
                console.log('chat.js: User list updated', e);
            });
            
            console.log('chat.js app event listeners defined');
        }
        
        //Frequent use, so declare in outer scope to dedicate the memory
        function sendChatMessage() {
            console.log('message transmitted');
            document.getElementById('chatInput').value=
                document.getElementById('chatInput').value.replace(
                    /[\n\r]/ig,
                    '<br>'
                );

            socket.emit(
                'chat',
                {
                    username: username,
                    msg: document.getElementById('chatInput').value
                }
            );
            document.getElementById('chatInput').value='';
        }
        
        exports(moduleName,render);    
    }
)();
