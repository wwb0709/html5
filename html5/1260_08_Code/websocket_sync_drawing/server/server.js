// Constants
var LINE_SEGMENT = 0;
var CHAT_MESSAGE = 1;

var ws = require(__dirname + '/lib/ws/server');
var server = ws.createServer();

server.addListener("connection", function(conn){
	// init stuff on connection
	console.log("A connection established with id",conn.id);
	var message = "Welcome "+conn.id+" joining the party. Total connection:"+server.manager.length;
	var data = {};
	data.dataType = CHAT_MESSAGE;
	data.sender = "Server";
	data.message = message;
	
	server.broadcast(JSON.stringify(data));
	
	// listen to the message
	conn.addListener("message", function(message){
		console.log("Got data '"+message+"' from connection "+conn.id);
		var data = JSON.parse(message);
		if (data.dataType == CHAT_MESSAGE)
		{
			// add the sender information into the message data object.
			data.sender = conn.id;
		}
		server.broadcast(JSON.stringify(data));
	});
});

server.listen(8000);

console.log("WebSocket server is running.");
console.log("Listening to port 8000.");