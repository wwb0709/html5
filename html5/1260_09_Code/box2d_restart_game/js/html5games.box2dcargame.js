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
	
	
	// Keyboard event
	$(document).keydown(function(e){			
		switch(e.keyCode) {
			case 88: // x key to apply force towards right
				var force = new b2Vec2(10000000, 0);
				carGame.car.ApplyForce(force, carGame.car.GetCenterPosition());
				break;
			case 90: // z key to apply force towards left
				var force = new b2Vec2(-10000000, 0);
				carGame.car.ApplyForce(force, carGame.car.GetCenterPosition());
				break;
			case 82: // r key to restart the game
				restartGame();
				break;
		}
	});
	
	
	
	// start new game
	restartGame();
	
	
	console.log("The world is created. ", carGame.world);
	
	// get the reference of the context
	canvas = document.getElementById('game');  
	ctx = canvas.getContext('2d');
	canvasWidth = parseInt(canvas.width);
	canvasHeight = parseInt(canvas.height);
	
	// start advancing the step
	step();

});


function step() {
	carGame.world.Step(1.0/60, 1);
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	
	drawWorld(carGame.world, ctx);
	
	setTimeout(step, 10);
	
	
	// loop all contact list to check if the car hits the winning wall
	for (var cn = carGame.world.GetContactList(); cn != null; cn = cn.GetNext())
	{				
		var body1 = cn.GetShape1().GetBody();
		var body2 = cn.GetShape2().GetBody();
		if ((body1 == carGame.car && body2 == carGame.gamewinWall) ||
			(body2 == carGame.car && body1 == carGame.gamewinWall))
		{
			console.log("Level Passed!");
			restartGame();	
		}
		
	}
}

function restartGame()
{
	// create the world
	carGame.world = createWorld();
	
	// create the ground
	createGround(250, 270, 250, 25, 0);
	
	// create a ramp
	createGround(500, 250, 65, 15, -10);
	createGround(600, 225, 80, 15, -20);
	createGround(1100, 250, 100, 15, 0);
	
	// create a destination ground
	carGame.gamewinWall = createGround(1200, 215, 15, 25, 0);
	
	
	// create a car
	carGame.car = createCarAt(50, 210);
}

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

function createGround(x, y, width, height, rotation) {
	// box shape definition
	var groundSd = new b2BoxDef();
	groundSd.extents.Set(width, height);
	groundSd.restitution = 0.4;
	
	// body definition with the given shape we just created.
	var groundBd = new b2BodyDef();
	groundBd.AddShape(groundSd);
	groundBd.position.Set(x, y);
	groundBd.rotation = rotation * Math.PI / 180;
	var body = carGame.world.CreateBody(groundBd);
	
	return body;
}

function createCarAt(x, y) {
	// the car box definition
	var boxSd = new b2BoxDef();
	boxSd.density = 1.0;
	boxSd.friction = 1.5;
	boxSd.restitution = .4;
	boxSd.extents.Set(40, 20);
	
	// the car body definition
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);		
	var carBody = carGame.world.CreateBody(boxBd);
	
	// creating the wheels
	var wheelBody1 = createWheel(carGame.world, x-25, y+20);
	var wheelBody2 = createWheel(carGame.world, x+25, y+20);
	
	// create a joint to connect left wheel with the car body
	var jointDef = new b2RevoluteJointDef();
	jointDef.anchorPoint.Set(x-25, y+20);
	jointDef.body1 = carBody;
	jointDef.body2 = wheelBody1;
	carGame.world.CreateJoint(jointDef);
	
	// create a joint to connect right wheel with the car body
	var jointDef = new b2RevoluteJointDef();
	jointDef.anchorPoint.Set(x+25, y+20);
	jointDef.body1 = carBody;
	jointDef.body2 = wheelBody2;
	carGame.world.CreateJoint(jointDef);
	
	return carBody;
				
}

function createWheel(world, x, y) {
	// wheel circle definition
	var ballSd = new b2CircleDef();
	ballSd.density = 1.0;
	ballSd.radius = 10;
	ballSd.restitution = 0.1;
	ballSd.friction = 4.3;
	
	// body definition
	var ballBd = new b2BodyDef();
	ballBd.AddShape(ballSd);
	ballBd.position.Set(x,y);
	return world.CreateBody(ballBd);
}



// drawing functions
function drawWorld(world, context) {
	for (var b = world.m_bodyList; b != null; b = b.m_next) {
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
			drawShape(s, context);
		}
	}
}

// drawShape function directly copy from draw_world.js in Box2dJS library
function drawShape(shape, context) {
	context.strokeStyle = '#003300';
	context.beginPath();
	switch (shape.m_type) {
	case b2Shape.e_circleShape:
		var circle = shape;
		var pos = circle.m_position;
		var r = circle.m_radius;
		var segments = 16.0;
		var theta = 0.0;
		var dtheta = 2.0 * Math.PI / segments;
		// draw circle
		context.moveTo(pos.x + r, pos.y);
		for (var i = 0; i < segments; i++) {
			var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
			var v = b2Math.AddVV(pos, d);
			context.lineTo(v.x, v.y);
			theta += dtheta;
		}
		context.lineTo(pos.x + r, pos.y);

		// draw radius
		context.moveTo(pos.x, pos.y);
		var ax = circle.m_R.col1;
		var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
		context.lineTo(pos2.x, pos2.y);
		break;
	case b2Shape.e_polyShape:
		var poly = shape;
		var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
		context.moveTo(tV.x, tV.y);
		for (var i = 0; i < poly.m_vertexCount; i++) {
			var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
			context.lineTo(v.x, v.y);
		}
		context.lineTo(tV.x, tV.y);
		break;
	}
	context.stroke();
}

