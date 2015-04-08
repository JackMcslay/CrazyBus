
var KEY_ACCEL = 39;
var KEY_BRAKE = 37;
var KEY_HORN = 32;



// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// create Oscillator and gain node
var oscillator = audioCtx.createOscillator();
var oscillator2 = audioCtx.createOscillator();
var oscillator3 = audioCtx.createOscillator();


var gainNode = audioCtx.createGain();
// connect oscillator to gain node to speakers
oscillator.connect(gainNode);
oscillator2.connect(gainNode);
oscillator3.connect(gainNode);
gainNode.connect(audioCtx.destination);
// create initial theremin frequency and volumn values
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var maxFreq = 6000;
var maxVol = 0.02;
var initialFreq = 10;
var initialVol = 0.25;
var ENABLEDVOLUME = 0.1;
var volume = ENABLEDVOLUME;



// set options for the oscillator
oscillator.type = 'sawtooth';
oscillator2.type = 'sine';
oscillator3.type = 'square';


oscillator.frequency.value = initialFreq / 2.25; // value in hertz
oscillator2.frequency.value = initialFreq; // value in hertz
oscillator3.frequency.value = initialFreq; // value in hertz
oscillator.detune.value = 100; // value in cents
oscillator2.detune.value = 100; // value in cents
oscillator3.detune.value = 100; // value in cents
oscillator.start();
//oscillator2.start();
oscillator3.start();
oscillator.onended = function () {
	console.log('Your tone has now stopped playing!');
}
gainNode.gain.value = initialVol;

function setFreq(freq) {
//initialFreq = initialFreq % 20+10;
//console.log(initialFreq);

	oscillator.frequency.value = freq / 2.25; // value in hertz
	oscillator2.frequency.value = freq; // value in hertz
	oscillator3.frequency.value = freq; // value in hertz
}

setInterval(function () {
	//setFreq( (Math.random() * 900) + 100);	
	gainNode.gain.value = ((Math.random() * 0.3) + 0.2) * volume;
	gainNode.gain.value = volume;
}, 200);

function enableAudio(enable) {
	volume = enable ? ENABLEDVOLUME : 0;
}

var Bus = function () {
	this.sprite = document.getElementById('Bus');
	this.pos = 0;
	console.log(this);
	var This = this;
	setInterval(function () {
		var cur = Date.now();
		var diff = (cur - This.timer) / 1000;
		This.timer = cur;

		var max = This.acceleration >= 0 ? This.MAXSPEED : -This.MAXSPEED_REV;



		This.speed += (This.acceleration * diff) * ((max - This.speed) / max);

		//console.log(This);

		//calculate drag
		This.speed -= This.speed * This.DRAG * diff;

		if (This.acceleration !== 0) {
			setFreq((Math.abs(This.speed) % This.GEAR) + 10);
		}
		else {
			setFreq(10);
		}

		Speedometer.Label.textContent = Math.round(Math.abs(This.speed));

		This.pos += This.speed * diff;

		This.sprite.style.left = '' + This.pos + 'px';
		//console.log(This.sprite.style);

	}, 1 / 60);

	window.addEventListener('keydown', function (evt) {
		switch (evt.keyCode) {
			case KEY_ACCEL:
				This.acceleration = Bus.ACCELERATIONVALUE;
				break;
			case KEY_BRAKE:
				This.acceleration = -Bus.ACCELERATIONVALUE;
				break;
		}
	});

	window.addEventListener('keyup', function (evt) {
		switch (evt.keyCode) {
			case KEY_ACCEL:
			case KEY_BRAKE:
				This.acceleration = 0;
				break;
		}
	});
}

Bus.ACCELERATIONVALUE = 10;
Bus.prototype.speed = 0;
Bus.prototype.acceleration = 0;
Bus.prototype.timer = Date.now();
Bus.prototype.GEAR = 30;
Bus.prototype.DRAG = 0.01;
Bus.prototype.MAXSPEED = 150;
Bus.prototype.MAXSPEED_REV = 10;


var Speedometer;
window.addEventListener('load', function () {
	Speedometer = document.getElementById('Speed');
	Speedometer.Label = document.createTextNode('0');
	Speedometer.insertBefore(Speedometer.Label, Speedometer.firstChild);

	new Bus();
});
