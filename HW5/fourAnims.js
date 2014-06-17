window.onload = function(e) {
	init();
	bindEvents();
}

function init() {
	var menu = document.getElementById('menu');
	menu.classList.add('menu');
	
	var action = document.getElementById('action');
	action.classList.add('action', 'hidden');
	
	var traveler = document.getElementById('traveler');
	traveler.classList.add('traveler');
	
	var satellite = document.getElementById('satellite');
	satellite.classList.add('satellite');
}

function bindEvents(e) {
	var menu = document.getElementById('menu');
	var action = document.getElementById('action');
	var traveler = document.getElementById('traveler');
	var satellite = document.getElementById('satellite');
	var vid = document.querySelector('video');
  //To fulfill looping requirement
  var divs = document.querySelectorAll('div');
	
	menu.addEventListener('click',
	  function(e) {
	    //Menu closing
 	    if(menu.classList.contains('menu-open')) {
 	      action.classList.remove('ninja');
 	    }
      //Make all divs after the first one visible
      //(The first div is the menu and is never hidden)
      for(var i=1; i < divs.length; i++) {
 	      divs[i].classList.toggle('hidden');
 	    }
 	    vid.classList.toggle('hidden');
 	    menu.classList.toggle('menu-open');
	  }
	);
	

	action.addEventListener('click',
	  function(e) {
	    action.classList.toggle('ninja');
	    if(action.classList.contains('ninja')) {
	      //This has become the elusive Stop button
	      action.innerHTML='Stop';
	    }
	    else {
	      action.innerHTML='Play';
	    }
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
