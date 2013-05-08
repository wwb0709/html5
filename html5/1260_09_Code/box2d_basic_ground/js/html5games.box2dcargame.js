/*!
 * Box2D Car Game Example
 * http://42games.net/html5games/box2d-car-game/
 * 
 * This is an example game for the book HTML5 Games Development: A Beginning Guide.
 * 
 * Copyright 2010, Thomas Seng Hin Mak
 * makzan@42games.net
 *   
 * All Right Reserved.
 */

var carGame = {	
}

var canvas;
var ctx;
var canvasWidth; 
var canvasHeight;
		
$(function() {
	
	// create the world
	carGame.world = createWorld();
	
	// create the ground
	createGround();
	
	console.log("The world is created. ",carGame.world);
	
	// get the reference of the context
	canvas = document.getElementById('game');  
	ctx = canvas.getContext('2d');
	canvasWidth = parseInt(canvas.width);
	canvasHeight = parseInt(canvas.height);
});


function createWorld() {
	
	// set the size of the world
	var worldAABB = new b2AABB();
	worldAABB.minVertex.Set(-4000, -4000);
	worldAABB.maxVertex.Set(4000, 4000);
	
	// Define the gravity
	var gravity = new b2Vec2(0, 300);
	
	// set to ignore sleeping object
	var doSleep = false;
	
	// finally create the world with the size, graivty and sleep object parameter.
	var world = new b2World(worldAABB, gravity, doSleep);
	
	return world;
}

function createGround() {
	// box shape definition
	var groundSd = new b2BoxDef();
	groundSd.extents.Set(250, 25);
	groundSd.restitution = 0.4;
	
	// body definition with the given shape we just created.
	var groundBd = new b2BodyDef();
	groundBd.AddShape(groundSd);
	groundBd.position.Set(250, 370);
	var body = carGame.world.CreateBody(groundBd);
	
	return body;
}

