var LEFT = 37;
var HORN = 32;
var RIGHT = 39;
var START = 13;

var playing = false;

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

window.addEventListener('load', function () {
	var titleScreen = new TitleScreen(audioCtx, "TitleScreen");
	var bus;
	var scenery;
	var prevTS = 0;

	var xp = 0;

	window.addEventListener("keydown", function (event) {
		try {
			if (playing) {
				switch (event.keyCode) {
					case RIGHT:
						bus.accelerate();
						break;
					case LEFT:
						bus.brake();
						break;
					case HORN:
						bus.horn();
						break;
				}
			} else {
				if (event.keyCode === START) {
					titleScreen.close();
					scenery = new Scenery("Rua", "Cidade");
					prevTS = Date.now();
					setInterval(function () {
						var curTS = Date.now();
						var diff = (curTS - prevTS) / 1000;

						bus.update(diff);
						prevTS = curTS;

						scenery.setX(bus.pos);
					}, 1000 / 60);


					bus = new Bus(audioCtx);
					playing = true;
				}
			}
		} catch (ex) {
			console.log(ex);
		}
	});

	window.addEventListener("keyup", function (event) {
		if (playing) {
			switch (event.keyCode) {
				case RIGHT:
				case LEFT:
					bus.idle();
					break;
				case HORN:
					bus.hornRelease();
					break;
			}

		}
	});
});