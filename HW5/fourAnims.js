window.onload = function(e) {
	init();
	bindEvents();
	loadUserMedia();
}

function init() {
	var menu = document.getElementById('menu');
	menu.classList.add('menu');
	
	var action = document.getElementById('action');
	action.classList.add('control', 'action', 'hidden');
	
	var vu = document.getElementById('volUp');
	vu.classList.add('control', 'hidden');
	
	var vd = document.getElementById('volDn');
	vd.classList.add('control', 'hidden');
}

function bindEvents(e) {
	var menu = document.getElementById('menu');
	var action = document.getElementById('action');
	var volUp = document.getElementById('volUp');
	var volDn = document.getElementById('volDn');
	var vid = document.querySelector('video');
	var aud = document.querySelector('audio');
  //To fulfill looping requirement
  var divs = document.querySelectorAll('div');
	
	menu.addEventListener('click',
	  function(e) {
	    //Menu closing
 	    if(menu.classList.contains('menu-open')) {
 	      action.classList.remove('ninja');
        action.innerHTML='Play';
	      vid.pause();
 	    }
      //Toggle visibility on all divs after the first one
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
	      //Clicked Play.
	      //Now this becomes the elusive Stop button
	      action.innerHTML='Stop';
	      vid.play();
	      //aud.play();
	    }
	    else {
	      action.innerHTML='Play';
	      vid.pause();
	      //aud.pause();
	    }
	  }
	);
	
	volUp.addEventListener('click',
	  function(e) {
	    vid.volume += 0.1;
	  }
	);
	volDn.addEventListener('click',
	  function(e) {
	    vid.volume -= 0.1;
	  }
	);
}

function loadUserMedia() {
  navigator.getUserMedia = ( navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.msGetUserMedia);

  if (navigator.getUserMedia) {
     navigator.getUserMedia (

        // constraints
        {
           video: true,
           audio: true
        },

        // successCallback
        function(localMediaStream) {
           var vid = document.querySelector('video');
           vid.src = window.URL.createObjectURL(localMediaStream);
           //var aud = document.querySelector('audio');
           //aud.src = window.URL.createObjectURL(localMediaStream);
           //Video and Audio are controlled with #action button
        },

        // errorCallback
        function(err) {
           console.log("The following error occured: " + err);
        }
     );
  } else {
     console.log("getUserMedia not supported");
  }
}
