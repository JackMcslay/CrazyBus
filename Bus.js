

function Bus(audioCtx) {
	this.sprite = document.getElementById('Bus');
	this.pos = 0;

	this.oscillator = audioCtx.createOscillator();
	this.oscillator2 = audioCtx.createOscillator();
	this.oscillator3 = audioCtx.createOscillator();

	this.gainNode = audioCtx.createGain();
	this.hornGain = audioCtx.createGain();
	this.hornGain.gain.value = 0;
	this.gainNode.gain.value = 0.5;

	this.oscillator.connect(this.gainNode);
	this.oscillator2.connect(this.hornGain);
	this.oscillator3.connect(this.gainNode);
	this.gainNode.connect(audioCtx.destination);
	this.hornGain.connect(audioCtx.destination);


// set options for the oscillator
	this.oscillator.type = 'sawtooth';
	this.oscillator2.type = 'sine';
	this.oscillator3.type = 'square';
	
	this.setFreq(Bus.INITIALFREQ);

	this.oscillator.detune.value = 100; // value in cents
	this.oscillator2.detune.value = 100; // value in cents
	this.oscillator3.detune.value = 100; // value in cents
	this.oscillator.start();
	this.oscillator2.start();
	this.oscillator3.start();
	
	this.oscillator2.frequency = 1000;
}

Bus.prototype.accelerate = function () {
	this.acceleration = Bus.ACCELERATIONVALUE;
};

Bus.prototype.brake = function () {
	this.acceleration = -Bus.ACCELERATIONVALUE;
};

Bus.prototype.idle = function () {
	this.acceleration = 0;
};

Bus.prototype.update = function (delta) {
	var max = this.acceleration >= 0 ? Bus.MAXSPEED : -Bus.MAXSPEED_REV;

	this.pos += (this.speed * delta) * 5;

	//accelerate
	this.speed += (this.acceleration * delta) * ((max - this.speed) / max);

	//calculate drag
	this.speed -= this.speed * Bus.DRAG * delta;

	if (this.acceleration !== 0) {
		this.setFreq((Math.abs(this.speed) % Bus.GEAR) + Bus.INITIALFREQ);
	}
	else {
		this.setFreq(Bus.INITIALFREQ);
	}
};


Bus.prototype.setFreq = function(freq) {
	this.oscillator.frequency.value = freq / 2.25; // value in hertz
	this.oscillator3.frequency.value = freq; // value in hertz
};

Bus.prototype.horn = function(){
	this.hornGain.gain.value = 1;
};

Bus.prototype.hornRelease = function(){
	this.hornGain.gain.value = 0;
};


Bus.ACCELERATIONVALUE = 10;
Bus.prototype.pos = 0;
Bus.prototype.speed = 0;
Bus.prototype.acceleration = 0;
Bus.GEAR = 45;
Bus.DRAG = 0.01;
Bus.MAXSPEED = 150;
Bus.MAXSPEED_REV = 10;
Bus.MAXFREQ = 6000;
Bus.MAXVOL = 0.05;
Bus.INITIALFREQ = 10;
Bus.INITIALVOL = 0.25;
