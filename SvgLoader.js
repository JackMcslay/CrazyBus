

function XmlLoader(href) {
	this.href = href;
}

XmlLoader.prototype.load = function () {
	var request = new XMLHttpRequest();
	var This = this;
	request.onreadystatechange = function (event) {
		if (event.target.readyState === XMLHttpRequest.DONE) {
			if (event.target.responseXML) {
				This.data = event.target.responseXML;
				
				if (This.onload){
					This.onload(event);
				}

			} else {
				if (This.onerror){
					This.onerror(event);
				}
			}
		}
	};


	request.open("GET", this.href, true);
	request.send();
};

XmlLoader.prototype.onerror = null;
XmlLoader.prototype.onload = null;
XmlLoader.prototype.data = null;

