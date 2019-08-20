const MARKERS_FILE = "./text_files/markers.json";
//const HOTSPOT_RADIUS = 0.005 // 0.005 miles == 26.4 feet
const HOTSPOT_RADIUS = 0.0076 // 0.005 miles == 40 feet

var positionListeners = [];
var markerListeners = [];

var markers = [];

var currentMarker;
var currentPosition;

var options = {
  enableHighAccuracy: true,
  timeout: Infinity,
  maximumAge: 0
};

var positionForced = false;


window.onload = function() {
	readMarkers();
    startPositionTracking();
};

function readMarkers() {
	$.getJSON( MARKERS_FILE, function ( json ) {
		markers = json.hotspots;
		setCurrentMarker( null );
    });
}

function addPositionListener( listener ) {
	positionListeners.push( listener );
}

function addMarkerListener( listener ) {
	markerListeners.push( listener );
}

function setCurrentPosition( position ) {
	currentPosition = position;
	firePositionListeners();
}

function firePositionListeners() {
	positionListeners.forEach( listener => {
    	listener( currentPosition );
    });
}

function setCurrentMarker( marker ) {
	currentMarker = marker;
	fireMarkerListeners();
}

function fireMarkerListeners() {
	console.log( "Firing Marker: " );
	console.log( currentMarker );
	markerListeners.forEach( listener => {
    	listener( currentMarker );
    });
}

function onFailedPositionUpdate( error ) {
    console.warn('ERROR(' + error.code + '): ' + error.message);
}

function unForcePosition() {
	positionForced = false;
}

function forcePositionUpdate( position ) {
	onPositionUpdate( position );
	console.log("FORCED POSITION");
	positionForced = true;
}

function onPositionUpdate( position ) {
	console.log(positionForced);
	if ( positionForced ) {
		console.log("Position is forced");
		return;
	}

    setCurrentPosition( position.coords );
    checkForCloseMarker( position.coords );
}

function checkForCloseMarker( position ) {
	var noMarkers = true;
	markers.forEach( marker => {		
		var dist = distance( position.latitude, position.longitude, marker.latitude, marker.longitude );
		console.log( "Distance: " + dist );

		if ( dist < HOTSPOT_RADIUS ) {
			noMarkers = false;
			if ( currentMarker != marker ) {
				setCurrentMarker( marker );
			}
			return;
		}
	});
	if ( noMarkers && currentMarker != null ) {
		setCurrentMarker( null );
	}
}

function startPositionTracking() {
    if ( navigator.geolocation == null ) {
		console.log( "Unable to initialize geolocation" );
		var pos = {
			coords : {
				latitude: 41.150121,
				longitude: -81.345059
			}
		};
		onPositionUpdate( pos )
        return;
    }

    navigator.geolocation.watchPosition(onPositionUpdate, onFailedPositionUpdate, options);
}

// https://www.geodatasource.com/developers/javascript
function distance(lat1, lon1, lat2, lon2) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		return dist;
	}
}

function getCurrentMarker() {
	return currentMarker;
}
