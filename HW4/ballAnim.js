window.onload = function(e) {
	//init();
	bindEvents();
}

function init() {
	//empty for now
}

function bindEvents(e) {
	var myBall = document.getElementById('theBall');
	myBall.addEventListener('click', bounceEnable);
	
	var btnReset = document.getElementById('reset');
	btnReset.addEventListener('click', bounceDisable);
}

function bounceEnable(e) {
	var myBall = document.getElementById('theBall');
	myBall.classList.add('bouncy');
}

function bounceDisable(e) {
	var myBall = document.getElementById('theBall');
	myBall.classList.remove('bouncy');
}