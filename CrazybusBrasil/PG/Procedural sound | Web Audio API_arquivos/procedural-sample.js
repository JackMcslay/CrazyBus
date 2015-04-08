/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This sample is a derivative of work created by 
 *
 * Chris Lowis <chris.lowis at bbc.co.uk>
 * Andrew Nicolaou <andrew.nicolaou at bbc.co.uk>
 * Matthew Paradis <matthew.paradis at bbc.co.uk>
 *
 * (See https://raw.github.com/bbcrd/radiophonics and COPYING)
 */


var VOICE_COUNT = 10;
var FAC = 800;
var RAISE = 0.5;
var FREQ = 25;


function WhiteNoiseGenerated(callback) {
  // Generate a 5 second white noise buffer.
  alert (context.sampleRate);
  var lengthInSamples = Math.round(context.sampleRate / FREQ);
  var buffer = context.createBuffer(1, lengthInSamples, context.sampleRate);
  var data = buffer.getChannelData(0);
  var raiseInc = context.sampleRate * RAISE;
  
  var sign = -1;
  var value = 0;
  for (var i = 0; i < lengthInSamples; i++) {
  	value += sign / lengthInSamples;
  	while (value > 1){
  		value -= 2;
  	}
  	while (value < -1){
  		value += 2;
  	}
  	//FAC-= 0.009;
  	
  	/*while (value > 1){
  		value = 2 - value;
  		sign = -1;
  	}
  	while (value < -1){
  		value = -2 - value;
  		sign = 1;
  	}*/
  	
    data[i] = value * 0.02;
  }

  // Create a source node from the buffer.
  this.node = context.createBufferSource();
  this.node.buffer = buffer;
  this.node.loop = true;
  this.node[this.node.start ? 'start' : 'noteOn'](0);
}

WhiteNoiseGenerated.prototype.connect = function(dest) {
  this.node.connect(dest);
}



function Envelope() {
  this.node = context.createGain()
  this.node.gain.value = 0;
}

Envelope.prototype.addEventToQueue = function() {
  this.node.gain.linearRampToValueAtTime(1, context.currentTime);
};

Envelope.prototype.connect = function(dest) {
  this.node.connect(dest);
};


function ProceduralSample() {
  this.voices = [];
  this.voiceIndex = 0;

  this.noise = new WhiteNoiseGenerated();
  this.onLoaded();
}

ProceduralSample.prototype.shoot = function() {
  this.voiceIndex = (this.voiceIndex + 1) % VOICE_COUNT;
  this.voices[this.voiceIndex].addEventToQueue()
};

ProceduralSample.prototype.onLoaded = function() {
  var filter = context.createBiquadFilter();
  filter.type = 0;
  filter.Q.value = 10;
  filter.frequency.value = 800;

  // Initialize multiple voices.
  for (var i = 0; i < VOICE_COUNT; i++) {
    var voice = new Envelope();
    this.noise.connect(voice.node);
    voice.connect(filter);
    this.voices.push(voice);
  }

  var gainMaster = context.createGain();
  gainMaster.gain.value = 50;
  filter.connect(gainMaster);

  gainMaster.connect(context.destination);
};

