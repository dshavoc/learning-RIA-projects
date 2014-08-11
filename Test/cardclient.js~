var socket,
    username,
    lastSpeaker,
    cardTemplate,
    deck,           //JSON Object
    DMkey;
    
window.onload = function() {
    //Bind player login button
    document.getElementById('login').addEventListener(
        'click',
        function(e) {
            e.preventDefault();	/*inhibits form default function
                            of loading another page via Post */
            
            login(io);
            setupBoard();
        }
    );
    
    //Bind DM login button
    document.getElementById('loginDM').addEventListener(
        'click',
        function(e) {
            e.preventDefault();	/*inhibits form default function
                            of loading another page via Post */
            
            login(io);
            
            socket.emit('requestDM', {username: username});
            
            //setupBoard();   //Card data (parameters) not necessarily arrived
        }
    );
    
    //Chat button is bound in serverListener, after connection established

    //Add test card to table (NOT HERE, because card data hasn't necessarily
    //arrived yet from server connection...
}

function setupBoard() {
    document.getElementById('cardBoard').innerHTML += card2html(0);
    document.getElementById('cardBoard').innerHTML += card2html(0);
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
        deck = JSON.parse(params.deck);
        console.log('Received card template and deck.');

        setupBoard();   //Now that the card data has arrived
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
