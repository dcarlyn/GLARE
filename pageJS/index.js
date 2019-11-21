var isAudioPlayingOnStart = false;

window.onload = function() {
    //introscreen.addEventListener("touchend", requestBegin);
    //introscreen.addEventListener("click", requestBegin);
}

function loadpage(html) {
    console.log("Loading page: " + html);
    var iframe = document.getElementById('iframe');
    iframe.id='iframe';
    iframe.src = html;
    iframe.style.position = "absolute";
    iframe.style.zIndex= "12";
    document.body.appendChild(iframe);
    //window.location.href = html;
    requestBegin();
    console.log('iframe.contentWindow =', iframe.contentWindow);
    console.log("Page loaded");
    var lockFunction =  window.screen.orientation.lock;
    if (lockFunction.call(window.screen.orientation, 'landscape')) {
        console.log('Orientation locked')
    } else {
        console.error('There was a problem in locking the orientation')
    }
}

function requestBegin() {
    setFullScreen();

    if ( isAudioPlayingOnStart ) {
        playAudio();
        isAudioPlayingOnStart = false;
    }
}

function playAudio() {
    var promise = document.getElementById("my_audio").play();

    if ( promise !== undefined ) {
        promise.then( function() {
            // Automatically Plays
        } ).catch( function ( error ) {
            //Failed
            console.log("Home Page Audio Error: " + error);
        } );
    }
}

function stopaudio() {
    //var startaudio =  document.getElementById('stream');
    //startaudio.pause();
    //startaudio.currentTime = 0;
    var elem = document.getElementById("stream");
    elem.parentNode.removeChild(elem);
    
    //test to ask for motion sensor access
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
  	// iOS 13+
  	DeviceOrientationEvent.requestPermission()
	.then(response => {
  	if (response == 'granted') {
    	// permission granted
    	loadpage('./tours.html');
 	 } 
 	 else {
    	// permission not granted
	alert("Motion access is required to view this site, Please delete your website cache in Settings -> Safari and reload.");
  	}
      })
	.catch(console.error);
      } else {
  	// non iOS 13+
  	loadpage('./tours.html');
      }
}

function setFullScreen() {
    if( (window.fullScreen) 
        || (window.innerWidth == screen.width && window.innerHeight == screen.height)
        || ((screen.availHeight || screen.height-30) <= window.innerHeight) ) {
        return;
    }

    var docElm = document.documentElement;
    if (docElm.requestFullscreen) {
    	docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
    	docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullscreen) {
    	docElm.webkitRequestFullscreen();
    } else if (docElm.msRequestFullscreen) {
    	docElm.msRequestFullscreen();
    }
    scrollToTop();
    scrollToBottom();
}

function scrollToTop() {
    window.scrollTo( 0, 0 );
    window.scrollTo( 0, 1 );
}

function scrollToBottom() {
    window.scrollTo( 0,document.body.scrollHeight );   
}
