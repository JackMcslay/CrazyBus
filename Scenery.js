function Scenery(roadId,cityId) {
	this.road = document.getElementById(roadId);
	this.city = document.getElementById(cityId);
	
	this.road.setAttribute("transform","translate(0,0)");
	
	this.city.setAttribute("transform","translate(0,0)");
}

Scenery.prototype.setX = function (xPos) {
	var roadX = xPos % Scenery.ROAD_INTERVAL;
	var backX = (xPos / Scenery.BACKGROUND_DIV) % Scenery.BACKGROUND_INTERVAL;
	
	while (roadX < 0){
		roadX += Scenery.ROAD_INTERVAL;
	}
	while (backX < 0){
		backX += Scenery.BACKGROUND_INTERVAL;
	}
	
	this.road.transform.baseVal[0].setTranslate(-roadX, 0);
	this.city.transform.baseVal[0].setTranslate(-backX, 0);
};

Scenery.BACKGROUND_DIV = 23;
Scenery.ROAD_INTERVAL = 130;
Scenery.BACKGROUND_INTERVAL = 320;