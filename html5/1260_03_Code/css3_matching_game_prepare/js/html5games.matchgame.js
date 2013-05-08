/*!
 * CSS3 Card Games Example
 * http://gamedesign.cc/html5games/CSS3-matching-game/
 * 
 * This is an example game for the book HTML5 Games Development: A Beginning Guide.
 * 
 * Copyright 2010, Thomas Seng Hin Mak
 * makzan@gmail.com
 *   
 * All Right Reserved.
 */


// every code inside $(function(){}) will be run 
// after the DOM is loaded and ready.
$(function(){
	
	// clone 12 copies of the card
	for(var i=0;i<11;i++){
		$(".card:first-child").clone().appendTo("#cards");
	}
	
	// initialize each card's position
	$("#cards").children().each(function(index) {		
		// align the cards to be 4x3 ourselves.
		$(this).css({
			"left" : ($(this).width()  + 20) * (index % 4),
			"top"  : ($(this).height() + 20) * Math.floor(index / 4)
		});
				
	});	
});
