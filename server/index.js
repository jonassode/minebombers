var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
});
server.listen(1337, function() { });

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

// playerlist
var clients = [ ];

function player(connection,guid){
    return {'connection': connection, 'guid': guid}
}

// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {
    console.log('Incoming message');

    if (message.type === 'utf8') {
      // process WebSocket message
        console.log('Process message');

        console.log(message);

        try {
            var msg = JSON.parse(message.utf8Data);
          } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ',
                message.data);
            return;
          }

          switch(msg.type) {
            case 'connect':
              // connecting users
              console.log('Connecting user ' + msg.data);
              
              clients.push(player(connection,msg.data));

              connection.send(
                JSON.stringify({ type: 'connected', data: 'hurra'} )
            )

            // Get player list
            var playerlist = '';
            for (var i=0; i < clients.length; i++) {
                
                playerlist += clients[i].guid + ",";
              }           

            // Send to all the player list
            for (var i=0; i < clients.length; i++) {
                
                clients[i].connection.send(JSON.stringify({ type: 'playerlist', data: playerlist, 'playersonline' : clients.length} ));
              }

              break;
          }


    }
  });

  connection.on('close', function(connection) {
    // close user connection
    console.log('Connected Closed!');

  });
})