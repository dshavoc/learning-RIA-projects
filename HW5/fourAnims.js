window.onload = function(e) {
	init();
	bindEvents();
}

function init() {
	var ninja = document.getElementById('ninja');
	ninja.classList.add('ninja');
	
	var bloop = document.getElementById('bloop');
	bloop.classList.add('bloop');
	
	var traveler = document.getElementById('traveler');
	traveler.classList.add('traveler');
	
	var satellite = document.getElementById('satellite');
	satellite.classList.add('satellite');
}

function bindEvents(e) {
	var bloop = document.getElementById('bloop');
	var ninja = document.getElementById('ninja');
	var traveler = document.getElementById('traveler');
	var satellite = document.getElementById('satellite');
	
	bloop.addEventListener('click',
	  function(e) {
	    bloop.classList.toggle('bloop-end');
	  }
	);
	ninja.addEventListener('click',
	  function(e) {
	    bloop.classList.toggle('bloop-end');
	  }
	);
}

function bounceEnable(e) {
	var myBall = document.getElementById('theBall');
	myBall.classList.add('bouncy');
}

function bounceDisable(e) {
	var myBall = document.getElementById('theBall');
	myBall.classList.remove('bouncy');
}
