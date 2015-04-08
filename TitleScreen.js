function TitleScreen(audioCtx,titleScreenId) {
	this.titleScreen = 	document.getElementById(titleScreenId);	

	// Create an empty two second stereo buffer at the
// sample rate of the AudioContext
	var frameCount = audioCtx.sampleRate * TitleScreen.TONESIZE * TitleScreen.TONECOUNT;
	var toneframes = audioCtx.sampleRate * TitleScreen.TONESIZE;
	var fadeIn = toneframes * TitleScreen.FADE;
	var fade = toneframes * (1 - TitleScreen.FADE);

	var audioBuffer = audioCtx.createBuffer(TitleScreen.CHANNELS, frameCount, audioCtx.sampleRate);

	for (var channel = 0; channel < TitleScreen.CHANNELS; channel++) {
		var v1 = 0;
		var v2 = 0;
		// This gives us the actual ArrayBuffer that contains the data
		var nowBuffering = audioBuffer.getChannelData(channel);
		var fi = 0;
		for (var j = 0; j < TitleScreen.TONECOUNT; j++) {
			var freq1 = (Math.random() * 1500) + 500;

			var s1 = (freq1 * Math.PI * 2) / audioCtx.sampleRate;
			var s2 = s1 / 5.19;

			for (var i = 0; i < toneframes; i++) {
				var a1 = Math.sin(v1);
				var a2 = ((v2 * 2) % 2) - 1;

				nowBuffering[fi] = (a1 + a2) / 2;
				if (i > fade) {
					var fac = 1 - ((fade - i) / (fade - toneframes));
					nowBuffering[fi] *= fac;
				} else if (i < fadeIn) {
					var fac = (i) / (fadeIn);
					nowBuffering[fi] *= fac;
				}
				v1 += s1;
				v2 -= s2;
				fi++;
			}
		}
	}

	var src = audioCtx.createBufferSource();

	src.loop = true;
	// set the buffer in the AudioBufferSourceNode
	src.buffer = audioBuffer;
	// connect the AudioBufferSourceNode to the
	// destination so we can hear the sound
	src.connect(audioCtx.destination);
	// start the source playing
	src.start();

	this.source = src;

}

TitleScreen.prototype.close = function () {
	this.source.stop();
	this.titleScreen.style.display = 'none';
};

TitleScreen.CHANNELS = 1;
TitleScreen.TONECOUNT = 400;
TitleScreen.TONESIZE = 0.15;
TitleScreen.FADE = 0.05;