(
    function(){
        var moduleName='world';
        
        function render(el){
            
            app.on('renderHere', function(here) {
                var wp = document.getElementById('worldText');
                wp.innerHTML = buildRoomDesc(here) + '<br>' + wp.innerHTML;
                console.log(app.data.world[here].desc);
            });
            
            app.on('move', function(to) {
                console.log('Move trigger caught', to);
                if(app.data.world[app.data.here][to] < 0) {
                    var wp = document.getElementById('worldText');
                    wp.innerHTML = '(!) You cannot go that way.<br>' + wp.innerHTML;
                    return;
                }
                
                var newHere = app.data.world[app.data.here][to];
                console.log('Moved from ' + app.data.here + ' to ' + newHere);
                app.data.here = app.data.world[app.data.here][to];
                    
                //Tell the server where I moved
                socket.emit('move', app.data.here);
                
                app.trigger('renderHere', app.data.here);
            
            });

        }
        
        //Frequent use
        function buildRoomDesc(here) {
            var desc = "You are in <b>" + app.data.world[here].desc + "</b>. " +
                app.data.world[here].detail + '<br>';
            if(app.data.world[here].N >= 0)
                desc += '- To the north, you see ' + app.data.world[app.data.world[here].N].desc + '<br>';
            if(app.data.world[here].E >= 0)
                desc += '- To the east, you see ' + app.data.world[app.data.world[here].E].desc + '<br>';
            if(app.data.world[here].S >= 0)
                desc += '- To the south, you see ' + app.data.world[app.data.world[here].S].desc + '<br>';
            if(app.data.world[here].W >= 0)
                desc += '- To the west, you see ' + app.data.world[app.data.world[here].W].desc + '<br>';
            if(app.data.world[here].U >= 0)
                desc += '- You see stairs up to ' + app.data.world[app.data.world[here].U].desc + '<br>';
            if(app.data.world[here].D >= 0)
                desc += '- You see stairs down to ' + app.data.world[app.data.world[here].D].desc + '<br>';
            return desc;
        }
        
        function buildRoomDetail(here) {
            return app.data.world[here].detail;
        }
        
        exports(moduleName,render);    
    }
)();