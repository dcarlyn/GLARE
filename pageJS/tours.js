var isMenuShowing = false;
var isMusicMenuShowing = false;
var backgroundImage1URL;
var backgroundImage2URL;
var currentBackgroundImageURL;

var renderer;
var spheremap;
var sphere;
var controls;
var camera;
var effect;
var scene;

var mainmenu = 1;

window.addEventListener("keydown", function() {}, false);

window.addEventListener("click", function() {
    //renderer.setSize(window.innerHeight, window.innerWidth);
    //effect.setSize( window.innerWidth, window.innerHeight );
    //fullscreen();
    //renderer.setSize(window.innerHeight, window.innerWidth);
    //effect.setSize( window.innerWidth, window.innerHeight );
    //click();
}, false);

$(document).ready(function() {
    setUp();
    buildScene();
});

function setUp() {
    document.getElementById('iframe_a').onload = function() {
        if(mainmenu < 1) {
            document.getElementById('iframe_a').style.zIndex = '29';
            mainmenu = 1;
        } else {
            document.getElementById('iframe_a').style.zIndex = '0'
            mainmenu = 0;
        }
    }

    addPositionListener( ( position ) => {
        console.log("Latitude:");
        console.log(position.latitude);
        console.log("Longitude:");
        console.log(position.longitude);
    });

    addMarkerListener( updatePage );
}

function createMainPageButton( page ) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = page.title;
    btn.onclick = () => loadPage( './pages/main/main.html', page );
    btn.className = "menu-button";
    return btn;
}

function createMediaPageButton( page ) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = page.title;
    btn.onclick = () => loadPage( './pages/media/media.html', page );
    btn.className = "menu-button";
    return btn;
}

function createToggleImageButton() {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Toggle Image";
    btn.onclick = () => toggleStartImage();
    btn.className = "menu-button";
    return btn;
}

function updateMenuButtons( menuItems ) {
    var mainMenuCtn = document.getElementById("navigation-menu");
    var buttons = mainMenuCtn.childNodes;
    while ( mainMenuCtn.firstChild ) {
        mainMenuCtn.removeChild( mainMenuCtn.firstChild );
    }
    menuItems.forEach( page => mainMenuCtn.appendChild( createMainPageButton( page ) ) );
    //mainMenuCtn.appendChild( createToggleImageButton() );
}

function updateMediaButtons( mediaItems ) {
    var mediaMenuCtn = document.getElementById("music-selection-menu");
    while ( mediaMenuCtn.firstChild ) {
        mediaMenuCtn.removeChild( mediaMenuCtn.firstChild );
    }
    mediaItems.forEach( page => mediaMenuCtn.appendChild( createMediaPageButton( page ) ) );
}

function updatePage( marker ) {
    console.log( "Marker Updated" );
    if ( marker == null ) {
        console.log( "Marker null" );
        goToMapPage();
        return;
    }
    console.log( "Marker not null" );
    resetIFrame();
    document.getElementById("title-ctn").innerHTML = marker.name;
    updateMenuButtons( marker.main_pages );
    updateMediaButtons( marker.media_pages );
    playAudio( marker.start_audio );
    backgroundImage1URL = marker.three_dimensional_image1;
    backgroundImage2URL = marker.three_dimensional_image2;
    currentBackgroundImageURL = backgroundImage1URL;
    resetScene();
}

function toggleNavigationMenu() {
    console.log("Toggling navigation menu");
    var menu = document.getElementById("navigation-menu");

    if (!isMenuShowing) {
        menu.style.left = "10px";
        isMenuShowing = true;
    } else {
        menu.style.left = "-20%";
        isMenuShowing = false;
    }
}

function toggleMusicMenu() {
    console.log("Toggle music menu");
    var menu = document.getElementById("music-selection-menu");

    if (!isMusicMenuShowing) {
        menu.style.right = "10px";
        isMusicMenuShowing = true;
    } else {
        menu.style.right = "-20%";
        isMusicMenuShowing = false;
    }
}

function goToMapPage() {
    document.getElementById("audio-player").pause();
    var iframe = document.getElementById('iframe_a');
    iframe.style.zIndex = '39';
    self.frames['iframe_a'].location.href = "./pages/map.html";
}

function loadPage ( html, page ) {
    var url = html + '?';

    url += "data=" + encodeURIComponent( JSON.stringify( page ) );
    console.log(url);
    //Object.keys( page ).forEach( function ( item ) {
    //    url += encodeURI(item) + '=' + encodeURI(page[item]) + '&';
    //});

    document.getElementById("audio-player").pause();
    var iframe = document.getElementById('iframe_a');
    iframe.style.zIndex = '29';
    var this_frame = self.frames['iframe_a'];
   this_frame.location.href = url;
    // window.open(url);
}

function toggleStartImage() {
    if ( currentBackgroundImageURL == backgroundImage1URL) {
        currentBackgroundImageURL = backgroundImage2URL;
    } else {
        currentBackgroundImageURL = backgroundImage1URL;
    }
    resetScene();
}

function resetScene() {
    var sphere = document.getElementById( 'sphere' );
    while( sphere.firstChild ) {
        sphere.removeChild( sphere.firstChild );
    }
    buildScene();
}

function calibrateNorth() {
    //alert("Point your phone north, then close this window");
    resetScene();
}

function buildScene() {
    renderer = null;
    spheremap = null;
    sphere = null;
    controls = null;
    camera = null;
    effect = null;
    scene = null;

    var loader = new THREE.TextureLoader();

    var webglEl = document.getElementById('sphere');
    var width  = window.innerWidth;
    var height = window.innerHeight;

    scene = new THREE.Scene();
    //scene.THREE.Object3D._threexDomEvent.camera(camera);
    camera = new THREE.PerspectiveCamera(30, width / height, 1, 1000);
    //camera.position.x = 0.1;
    renderer = Detector.webgl ? new THREE.WebGLRenderer({alpha: true}) : new THREE.CanvasRenderer({alpha: true}) ;
    ///make magenta transparent
 
    renderer.setClearColor( 0xFF00FF, 0);

    renderer.setSize(width, height);
    loader.load(
        currentBackgroundImageURL,
        function ( texture ) {
            spheremap = new THREE.MeshBasicMaterial({ map : texture });
            sphere = new THREE.Mesh(
                new THREE.SphereGeometry(100, 20, 20,(Math.PI + 1.65)  ),
               // new THREE.SphereGeometry(100, 20, 20 ),
                spheremap
            );
            sphere.scale.x = -1;
            scene.add(sphere);
        },
        undefined,
        function ( error ) {
            console.log( "SCENE BUILD ERROR: " + error );
        });
    //get north 
    if (navigator.geolocation) {
        //TODO:
        //// alert(navigator.geolocation.heading);
        //rotate the sphere based on distance from north
        ///sphere.rotation.x = ;
    }

    

    controls = new THREE.OrbitControls(camera);
    controls.noPan = true;
    controls.noZoom = true; 
    
    webglEl.appendChild(renderer.domElement);
    effect = new THREE.StereoEffect( renderer );
    effect.setSize( window.innerWidth, window.innerHeight );			

    ////DAVID live video start

    // Older browsers might not implement mediaDevices at all, so we set an empty object first
    if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
    }

    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
            // First get ahold of the legacy getUserMedia, if present
            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            // Some browsers just don't implement it - return a rejected promise with an error
            // to keep a consistent interface
            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }

            // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
            return new Promise(function(resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
        }
    }

    navigator.mediaDevices.getUserMedia({
        audio: false, 
        video: {
            facingMode: {
                exact: "environment"
            }
        }
    })
    .then(function(stream) {
  
        var video = document.querySelector("#videoElement");
  
        // Older browsers may not have srcObject
        if ("srcObject" in video) {
            video.srcObject = stream;
        } else {
            // Avoid using this in new browsers, as it is going away.
            video.src = window.URL.createObjectURL(stream);
        }

        video.onloadedmetadata = function(e) {
            video.play();
        };

    })
    .catch(function(err) {
        console.log(err.name + ": " + err.message);
    });

    ////////////////////live vide0 end

    THREEx.FullScreen.request();
    render();
    window.addEventListener('deviceorientation', setOrientationControls, true);
}

function render() {
    controls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}


function setOrientationControls(event) {
    if (!event.alpha) {
        return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();
    window.removeEventListener('deviceorientation', setOrientationControls, true);
}

function change(sourceUrl) {
    var audio = document.getElementById("audio-player");
            
    if (sourceUrl) {
        audio.src = sourceUrl;
        var playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(function() {

            }).catch(function(error) {
                console.log("Error playing music.");
            })
        }
    }
}

function resetIFrame() {
    var iframe = document.getElementById( "iframe_a" );
    console.log(iframe);
    iframe.remove();
    var newIFrame = document.createElement( 'iframe' );
    newIFrame.src="./pages/navset.html";
    newIFrame.allowtransparency="true";
    newIFrame.name = "iframe_a";
    newIFrame.id = "iframe_a";
    document.body.appendChild( newIFrame );
    window.parent.setFullScreen();
    
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

function onMapClicked() {
    unForcePosition();
    setCurrentMarker( null );
}
