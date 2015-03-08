var castDrHomeUrl = 'http://tbertelsen.dk/'

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
}

runCastdrBookmarklet();