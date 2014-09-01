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

function interpretUrl(url) {
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


function log(o) {
	console.log(o)
}

function fetchProgramCard(slug) {
	var url = "http://www.dr.dk/muTest/api/1.1/programcard/" + slug;
	return fetchJson(url, fetchManifest);
}

function fetchManifest(programCard) {
	asset = programCard.PrimaryAsset;
	console.log(asset)
	if (asset.Kind != "VideoResource") {
		throw "Not a video link";
	}
	if (asset.RestrictedToDenmark) {
		console.log("Denmark only program! Unkown international behaviour.")
	}

	var url = asset.Uri;
	return fetchJson(url, selectVideoUrl);
}

function selectVideoUrl(manifest) {
	log(manifest)
	var maxBitrate = 0;
  var videoUrl = null;
	for (i in manifest.Links) {
		link = manifest.Links[i]
		if (link.Target == "Download" && maxBitrate < link.Bitrate) {
			videoUrl = link.Uri;
			maxBitrate = link.Bitrate;
		}
	}
	log(videoUrl)
	log(encodeURIComponent(videoUrl))
	var vidCastUrl = "https://dabble.me/cast/?video_link=" + encodeURIComponent(videoUrl);

	location.href = vidCastUrl
}


function handleUrl(url) {
	try {
		var slugs = interpretUrl(url);
		fetchProgramCard(slugs.episodeSlug)
	} catch (e) {
		console.log(e)
		alert("Ooops!\n" + e)
	}
}

function params() {
  var url = getUrlParameter("url")
  var stay = getUrlParameter("stay")
  if (url) {
    document.getElementById('urlBox').value = url;
    if (!stay) {
      handleUrl(url)
    }
  }
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)  {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return decodeURIComponent(sParameterName[1]);
        }
    }
}
