(
    function(){
        var moduleName='world';
        
        function render(el){
            
            app.on('renderHere', function(here) {
                if(!here) here=app.data.here;
                var wp = document.getElementById('worldText');
                wp.innerHTML = buildRoomDesc(here) + '<br>' + wp.innerHTML;
                console.log('rendering here:',app.data.world[here].desc);
            });
            
            app.on('move', function(dir) {
                console.log('Move trigger caught', dir);
                if(app.data.world[app.data.here][dir] < 0) {
                    var wp = document.getElementById('worldText');
                    wp.innerHTML = '(!) You cannot go that way.<br>' + wp.innerHTML;
                    return;
                }
                
                var wasHere = app.data.here;
                var newHere = app.data.world[app.data.here][dir];
                //console.log('Moved from ' + app.data.here + ' to ' + newHere);

                //Tell the server where I moved
                socket.emit('move', {from: app.data.here, to: newHere, dir: dir});
                
                //Execute the move
                app.data.here = app.data.world[app.data.here][dir];
                app.trigger('renderHere', app.data.here);

            });
            
            app.on('worldMsg', function(msg) {
                var wp = document.getElementById('worldText');
                wp.innerHTML = msg + '<br>' + wp.innerHTML;
            });

        }
        
        //Frequent use
        function buildRoomDesc(here) {
            var desc;
            var targDesc;
            console.log(app.data.world, here);
            if(app.data.world[here].desc) {
                desc = "You are in <b>" + app.data.world[here].desc + "</b>. " + app.data.world[here].detail + '<br>';
            }
            else{
                desc = "You are in a non-descript corner of the void.<br>";
            }
            if(app.data.world[here].N >= 0) {
                desc += '- To the north, you see ';
                targDesc = app.data.world[app.data.world[here].N].desc;
                if(targDesc) {
                    desc += targDesc + '<br>';
                }
                else {
                    desc += 'void <br>';
                }
            }
            if(app.data.world[here].E >= 0) {
                desc += '- To the east, you see ';
                targDesc = app.data.world[app.data.world[here].E].desc;
                if(targDesc) {
                    desc += targDesc + '<br>';
                }
                else {
                    desc += 'void <br>';
                }
            }
            if(app.data.world[here].S >= 0) {
                desc += '- To the south, you see ';
                console.log(app.data.world[here]);
                targDesc = app.data.world[app.data.world[here].S].desc;
                if(targDesc) {
                    desc += targDesc + '<br>';
                }
                else {
                    desc += 'void <br>';
                }
            }
            if(app.data.world[here].W >= 0) {
                desc += '- To the west, you see ';
                targDesc = app.data.world[app.data.world[here].W].desc;
                if(targDesc) {
                    desc += targDesc + '<br>';
                }
                else {
                    desc += 'void <br>';
                }
            }
            if(app.data.world[here].U >= 0) {
                desc += '- You see stairs up to ';
                targDesc = app.data.world[app.data.world[here].U].desc;
                if(targDesc) {
                    desc += targDesc + '<br>';
                }
                else {
                    desc += 'void <br>';
                }
            }
            if(app.data.world[here].D >= 0) {
                desc += '- You see stairs down to ';
                targDesc = app.data.world[app.data.world[here].D].desc;
                if(targDesc) {
                    desc += targDesc + '<br>';
                }
                else {
                    desc += 'void <br>';
                }
            }
            return desc;
        }
        
        exports(moduleName,render);    
    }
)();