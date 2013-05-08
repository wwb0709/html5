// Constants
var LINE_SEGMENT = 0;
var CHAT_MESSAGE = 1;
var GAME_LOGIC = 2;


// Constant for game logic state
var WAITING_TO_START = 0;
var GAME_START = 1;
var GAME_OVER = 2;
var GAME_RESTART = 3;

//var ws = require(__dirname + '/lib/ws/server');
var ws = require('websocket-server');
var server = ws.createServer();

// the current turn of player index.
var playerTurn = 0;

var wordsList = ['apple','idea','wisdom','angry'];
var currentAnswer = undefined;

var currentGameState = WAITING_TO_START;

var gameOverTimeout;

server.addListener("connection", function(conn){
	// init stuff on connection
	console.log("A connection established with id",conn.id);
	var message = "Welcome "+conn.id+" joining the party. Total connection:"+server.manager.length;
	var data = {};
	data.dataType = CHAT_MESSAGE;
	data.sender = "Server";
	data.message = message;	
	server.broadcast(JSON.stringify(data));
	
	// send the game state to all players.
	var gameLogicData = {};
	gameLogicData.dataType = GAME_LOGIC;
	gameLogicData.gameState = WAITING_TO_START;
	server.broadcast(JSON.stringify(gameLogicData));
	
	// start the game if there are 2 or more connections
	if (currentGameState == WAITING_TO_START && server.manager.length >= 2)
	{
		startGame();
	}
	
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
		
		// check if the message is guessing right or wrong
		if (data.dataType == CHAT_MESSAGE)
		{
			if (currentGameState == GAME_START && data.message == currentAnswer)
			{
				var gameLogicData = {};
				gameLogicData.dataType = GAME_LOGIC;
				gameLogicData.gameState = GAME_OVER;
				gameLogicData.winner = conn.id;
				gameLogicData.answer = currentAnswer;
				server.broadcast(JSON.stringify(gameLogicData));
				
				currentGameState = WAITING_TO_START;
				
				// clear the game over timeout
				clearTimeout(gameOverTimeout);
			}
		}
		
		
		if (data.dataType == GAME_LOGIC && data.gameState == GAME_RESTART)
		{
			startGame();
		}
	});
});

function startGame()
{
	// pick a player to draw
	playerTurn = (playerTurn+1) % server.manager.length;	
	
	// pick an answer
	var answerIndex = Math.floor(Math.random() * wordsList.length);
	currentAnswer = wordsList[answerIndex];
	
	// game start for all players
	var gameLogicData1 = {};
	gameLogicData1.dataType = GAME_LOGIC;
	gameLogicData1.gameState = GAME_START;
	gameLogicData1.isPlayerTurn = false;
	server.broadcast(JSON.stringify(gameLogicData1));
	
	// game start with answer to the player in turn	
	var index = 0;	
	server.manager.forEach(function(connection){
		if (index == playerTurn)
		{
			var gameLogicData2 = {};
			gameLogicData2.dataType = GAME_LOGIC;
			gameLogicData2.gameState = GAME_START;
			gameLogicData2.answer = currentAnswer;
			gameLogicData2.isPlayerTurn = true;
			server.send(connection.id, JSON.stringify(gameLogicData2));
		}
		index++;						
	});
	
	// game over the game after 1 minute.
	gameOverTimeout = setTimeout(function(){
		var gameLogicData = {};
		gameLogicData.dataType = GAME_LOGIC;
		gameLogicData.gameState = GAME_OVER;
		gameLogicData.winner = "No one";
		gameLogicData.answer = currentAnswer;
		server.broadcast(JSON.stringify(gameLogicData));
		
		currentGameState = WAITING_TO_START;
	},60*1000);

	currentGameState = GAME_START;
}


server.listen(8000);

console.log("WebSocket server is running.");
console.log("Listening to port 8000.");