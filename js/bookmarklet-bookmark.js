javascript:(function () {
		console.log("load bookmarklet");
		if (!document.getElementById('drcastbookmarklet')) {
			console.log('Injecting code');
			var jsCode = document.createElement('script'); 
	    jsCode.setAttribute('src', 'http://http://tbertelsen.dk/castdr/js/bookmarklet.js');
  	  jsCode.setAttribute('id', 'drcastbookmarklet');
  	  jsCode.setAttribute('type','text/javascript');
  	  document.body.appendChild(jsCode); 
  	  console.log(jsCode);
		} else {
			runCastdrBookmarklet();			
		}
 }());