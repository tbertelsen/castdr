function DrUrlHandler () {
    this.mediaUrl = "";
    this.title = "";
    this.imgUrl = ""
}
 
DrUrlHandler.prototype.getInfo = function() {
    return this.color + ' ' + this.type + ' apple';
};

DrUrlHandler.prototype.handleUrl = function(url) {
	try {
		var slugs = interpretDrUrl(url);
		this.fetchProgramCard(slugs.episodeSlug);
	} catch (e) {
		console.log(e)
		alert("Ooops!\n" + e)
		this.onError(e)
	}
}

DrUrlHandler.prototype.fetchProgramCard = function(slug) {
	var url = "http://www.dr.dk/mu/api/1.1/programcard/" + slug;
	return fetchJson(url, this.fetchManifest.bind(this));
}

DrUrlHandler.prototype.fetchManifest = function(programCard) {
	console.log("programCard")
	console.log(programCard)
	asset = programCard.PrimaryAsset;
	console.log("asset")
	console.log(asset)
	if (asset.Kind != "VideoResource") {
		throw "Not a video link";
	}
	if (asset.RestrictedToDenmark) {
		console.log("Denmark only program! Unkown international behaviour.")
	}
	this.title = programCard.Title;
	this.imgUrl = programCard.PrimaryImageUri;

	var url = asset.Uri;
	return fetchJson(url, this.selectVideoUrl.bind(this));
}

DrUrlHandler.prototype.selectVideoUrl = function(manifest) {
	console.log("manifest")
	console.log(manifest)
	for (i in manifest.Links) {
		link = manifest.Links[i]
		if (link.Target == "HLS") {
			this.mediaUrl = link.Uri;
			this.success();
			return;
		}
	}
}

DrUrlHandler.prototype.success = function() {
	this.onSuccess(this.mediaUrl, this.title, this.imgUrl);
}

/**
 * Callback for clients.
 */
DrUrlHandler.prototype.onSuccess = function(mediaUrl, title, imgUrl) {
	console.log("Successfully fetched DR URL:")
	console.log(this)
	console.log(mediaUrl)
	console.log(title)
	console.log(imgUrl)
}

/**
 * Callback for clients.
 */
DrUrlHandler.prototype.onError = function(errorMsg) {
	
}


function xhrSuccess () { this.callback(JSON.parse(this.responseText)); }

function xhrError () { console.error(this.statusText); }

function fetchJson (sURL, fCallback) {
	console.log("Getting " + sURL)
  var oReq = new XMLHttpRequest();
  oReq.callback = fCallback;
  oReq.arguments = Array.prototype.slice.call(arguments, 2);
  oReq.onload = xhrSuccess;
  oReq.onerror = xhrError;
  oReq.open("get", sURL, true);
  oReq.send(null);
}

function interpretDrUrl(url) {
	var index = url.search(/dr.dk\//i)
	if (index == -1) {
		throw  "Not a dr.dk url";
	}
	var pathStart = index + "dr.dk/".length;
	var path = url.substring(pathStart).split(/[\/#?~!*()';]/);
	
  if (path.length < 4) {
  	throw "URL is not long enough"
  }

	if (!("tv" == path[0] && "se" == path[1])) {
		throw "URL path must start with /tv/se";
  }

  // Ensure no bad characters in ids
  if (!(encodeURIComponent(path[2]) == path[2] &&
  	encodeURIComponent(path[3]) == path[3])) {
  	throw "Bad characters in URL"
  }

  return {	
	  seriesSlug : path[2],
	  episodeSlug : path[3]
  };
}


