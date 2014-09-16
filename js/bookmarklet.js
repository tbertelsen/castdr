var castDrHomeUrl = 'http://tbertelsen.dk/castdr/'

function runCastdrBookmarklet() {
	console.log("Running CastDr bookmarklet")
	try {
		_runCastdrBookmarklet();
	} catch (e) {
		alert(e);
		console.log(e);
		console.log(e.stack);
	}
}

function _runCastdrBookmarklet() {
	var url = location.href
	var index = url.search(/dr.dk\//i)
	if (index == -1) {
		throw "Please use this on dr.dk.";
	}
	var pathStart = index + "dr.dk/".length;
	var path = url.substring(pathStart).split(/[\/#?~!*()';]/);

	switch (path[0].toLowerCase()) {
		case "tv":
			handleTv();
			break;
		case "bonanza":
			handleBonanza();
			break;
		default:
			throw "Please use on eiher dr.dk/tv or dr.dk/Bonanza";
	}
}

function handleTv() {
	location.href = castDrHomeUrl + '?url=' + encodeURIComponent(location.href)
}

function handleBonanza() {
	// We cannot handle rtmp feeds that Bonanza provides
	alert("Sorry. Chromecast cannot stream Bonanza.");
	return;

	var onClickStart = 'bonanzaFunctions.newPlaylist(';
	var onClickEnd = ");";

	var asset = nowPlayingOnBonanza;
	if (!asset) {
		throw 'Please select an episode to play';
	}
	var listEntry = document.getElementById("" + asset)
	var onClickString = listEntry.getAttribute("onClick").trim();
	if (!(startsWith(onClickString, onClickStart) && endsWith(onClickString, onClickEnd))) {
		throw "Whoops. Something whent wrong.\n\nGeek-info: onClick not as expected."
	}

	var jsonString = onClickString.substring(onClickStart.length, onClickString.length - onClickEnd.length);
	var drData = JSON.parse(jsonString);
	var castdrData = extractData(drData);

	location.href = castDrHomeUrl + '?directData' +
		'&mediaUrl=' + encodeURIComponent(castdrData.mediaUrl) +
		'&imageUrl=' + encodeURIComponent(castdrData.imageUrl) +
		'&title=' + encodeURIComponent(castdrData.title);
}

function extractData(drData) {
	var low, medium, high, thumb, audio, still;
	for (var i = 0; i < drData.Files.length; i++) {
		switch (drData.Files[i].Type) {
			case "VideoLow":
				low = drData.Files[i].Location;
				break;
			case "VideoMid":
				medium = drData.Files[i].Location;
				break;
			case "VideoHigh":
				high = drData.Files[i].Location;
				break;
			case "Thumb":
				thumb = drData.Files[i].Location;
				break;
			case "Audio":
				audio = drData.Files[i].Location;
				break;
			case "Still":
				still = drData.Files[i].Location;
				break;
		}
	}

	var mediaUrl = high;
	mediaUrl = mediaUrl ? mediaUrl : medium;
	mediaUrl = mediaUrl ? mediaUrl : low;
	mediaUrl = mediaUrl ? mediaUrl : audio;
	imageUrl = still ? still : thumb;

	return {
		title : drData.Title,
		mediaUrl : mediaUrl,
		imageUrl : imageUrl
	}
}

function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function startsWith(str, prefix) {
	return str.indexOf(prefix) == 0;
};

runCastdrBookmarklet();