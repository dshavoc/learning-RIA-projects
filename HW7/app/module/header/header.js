(
    function(){
        var moduleName='header';
        
        function render(el){
            console.log('header render called');

            //Bind player login button
            document.getElementById('login').addEventListener(
                'click',
                function(e) {
                    e.preventDefault();
                    app.trigger('login');   //TODO: pass the login data with this call
                    //setupBoard();
                }
            );
                
            //Bind DM login button
            document.getElementById('loginDM').addEventListener(
                'click',
                function(e) {
                    e.preventDefault();
                    app.trigger('login');
                    //login(io);
                    //socket.emit('requestDM', {username: username});
                    //setupBoard();   //Card data (parameters) not necessarily arrived
                }
            );
            
            //Bind Logout button
            document.getElementById('logout').addEventListener(
                'click',
                function(e) {
                    e.preventDefault();
                }
            );
        }  
        exports(moduleName,render);    
    }
)();
