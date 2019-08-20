var oralHistorySrc = null;

window.onload = function() {
    var data = getData();
    document.getElementById("title").innerHTML = data["title"];
    document.getElementById("text").innerHTML = data["description"];
    var img = new Image();
    img.onload = function () {
        console.log("IMAGE LOADED");
        document.body.style.backgroundImage = "url(" + this.src + ")";
    }
    img.onerror = function() {
        console.log("ERROR LOADING IMAGE");
    };
    img.src = data["background_image"];
    playAudio( data["descriptive_audio"] );
    oralHistorySrc = data["oral_history_audio"];
}

function switchToOralHistory() {
	playAudio( oralHistorySrc );
}

function fadeOutText() {
    var text = document.getElementById("textCtn");

    setTimeout( function() { 
        text.style.opacity = text.style.opacity - 0.1;
    }, 1000 );
}

function playAudio( audioSrc ) {
	var audio = document.getElementById("audio-player");
            
    if ( audioSrc ) {
    	audio.src = audioSrc;
    	var playPromise = audio.play();

        if (playPromise !== undefined) {
        	playPromise.then(function() {

            }).catch(function(error) {
        	   console.log("Error playing music.");
            });
    	}
	}
}

function getData() {
    var vars = {};
    vars = new URLSearchParams(window.location.search);
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    console.log(vars);
    return JSON.parse( decodeURIComponent( vars["data"] ) );
}

function goBack() {
    window.parent.resetIFrame();
}
