//app.data is an empty object you can use that all modules will have access to.

var socket,
    username,
    userlist,   //string array
    lastSpeaker,
    cardTemplate,
    deck,           //JSON Object
    DMkey;
    
function setupBoard() {
    document.getElementById('cardBoard').innerHTML += card2html(0);
    document.getElementById('cardBoard').innerHTML += card2html(0);
}

//function login(io) {
app.on('login', function() {
    console.log('app.data.js: login event detected');
    //Check node server is serving socket.io, and connect
    if(io) {
        socket = io.connect('http://localhost:10002');
        console.log('Socket connected');
    }
    else {
        showStatus('Server not found');
        return;
    }
    if(socket) {
        username = document.getElementById('username').value;
        //document.getElementById('loginForm').classList.add('hidden');
        //document.getElementById('chatRoom').classList.remove('hidden');
        //document.getElementById('cardBoard').classList.remove('hidden');

        //Define communications with server
        serverListener();
        
        //Request initial parameters (card templates, etc)
        socket.emit('requestParams', {username: username});
    }
    else {
        showStatus('Sock connection rejected');
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
        cardTemplate = params.cardTemplate;
        deck = JSON.parse(params.deck);
        console.log('Received card template and deck.');

        //setupBoard();   //Now that the card data has arrived
    });
   
    socket.on('userlist', function(lst) {
        console.log('app.data.js: Received user list from server');
        userlist = data;
        app.trigger('updateUserList');  //app.trigger seems not to work here.
    });

    socket.on('answerDM', function(msg) {
        console.log(msg);
        if(msg.isGranted == 'y') {
            DMkey = msg.DMkey;
            sysChat('You are the DM');
            console.log('DM assigned');
        }
        else {
            sysChat('DM seat has already been assigned to: ' + msg.DMusername);
        }
    });
}

/*function showStatus(msg) {
    document.getElementById('status').innerHTML =
        'Status: ' + msg;
}*/

function sysChat(msg) {
    document.getElementById('messages').innerHTML =
        "<b>" + msg + "</b><br>" + document.getElementById('messages').innerHTML;
    console.log('sysChat: ' + msg);
}

function card2html(index) {
    var cardHtml = cardTemplate;
    cardHtml = cardHtml.replace(/\${title}/, deck.cards[index].title);
    cardHtml = cardHtml.replace(/\${clas}/, deck.cards[index].clas);
    cardHtml = cardHtml.replace(/\${img}/, deck.cards[index].img);
    cardHtml = cardHtml.replace(/\${num}/, deck.cards[index].num);
    
    return cardHtml;
}
