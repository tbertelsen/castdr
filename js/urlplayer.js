
var autoLaunch = false;

function onload() {
  var url = getUrlParameter("url")
  if (url) {
    $('#url').val(url);
    autoLaunch = true;
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

var player;
var drUrlHandler;

$(function() {
  player = new CastPlayer();
  drUrlHandler = new DrUrlHandler();
  drUrlHandler.onSuccess = _startPlayback;
  drUrlHandler.onError = showTryAgain;
});

function showTryAgain() {
  $('#player_now_playing').html('Please try agian.');
  $('#loading_img').hide();
}

function launchApp() {
  player.launchApp();
}

function getContentType(url) {
  var ext = url.split('.').pop();
  var formats = [
    {ext: 'mkv', type: 'video'},
    {ext: 'webm', type: 'video'},
    {ext: 'mp4', type: 'video'},
    {ext: 'm4v', type: 'video'},
    {ext: 'm4a', type: 'audio'},
    {ext: 'jpeg', type: 'image'},
    {ext: 'jpg', type: 'image'},
    {ext: 'gif', type: 'image'},
    {ext: 'png', type: 'image'},
    {ext: 'bmp', type: 'image'},
    {ext: 'webp', type: 'image'}
  ];
  for (var i = 0; i < formats.length; i++) {
    if (formats[i].ext == ext) {
      return formats[i].type + "/" + ext;
    }
  }
  // it doesn't matter now, as it's unsupported.
  return "";
}

function startPlayback() {
  if (player.session == null || $('#url').val().trim() == "") {
    console.log("Skipping playback")
    return;
  }
  var url = decodeURIComponent($('#url').val());
  $('#player_now_playing').html('Please wait.');
  $('#controls').show();
  $('#loading_img').show();
  drUrlHandler.handleUrl(url);
}

function _startPlayback(mediaUrl, title, imgUrl) {
    var contentType = getContentType(mediaUrl);
    player.loadMedia(mediaUrl, contentType, title, imgUrl);
    $('#player_img').attr("src", imgUrl)
    // $('#player_now_playing').html('Now playing ' + title);
    // $('#player_img').attr("src", imgUrl).show();
    // $('#loading_img').hide();
    // $('#controls').show();
  }

function pause() {
  if (player.session != null) {
    player.pauseMedia();
  }
}

function resume() {
  if (player.session != null) {
    player.playMedia();
  }
}

function seek(is_forward) {
  if (player.session != null) {
    player.seekMedia(parseInt($("#player_seek").val()), is_forward);
  }
}

function seekTo() {	
  if (player.session != null) {
    player.seekTo(parseInt($("#player_seek_range").val()));
  }
}

function stop() {
  var reply = confirm("This will stop playback on the TV. Are you sure?");
  if (reply == true) {
    player.stopApp();
    $('#controls').hide();
  }
}

function volumeDown() {
  if (player.session != null) {
      player.volumeControl(false, false);
  }
}

function volumeUp() {
  if (player.session != null) {
    player.volumeControl(true, false);
  }
}

function volumeMute() {
  if (player.session != null) {
    player.volumeControl(false, true);
  }
}