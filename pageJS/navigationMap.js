var map, infoWindow, marker, hotspots, arrowMarker;
var indexOfCurrentTarget = 0;
var iconcolor = 'LightBlue';

function loadback() {
  var iframe = document.getElementById('iframe');
  iframe.style.position = "absolute";
  iframe.style.zIndex= "-1";
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.150121, lng: -81.345059},
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    rotateControl: true
  });
  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    setUpAutoUpdate();
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  setupMarkers();
}

function setupMarkers() {
  loadJSON ( function( response ) {
    var markers_ = JSON.parse( response );
    hotspots = markers_['hotspots'];

    for (var i = 0; i < hotspots.length; i++) {
      labeler = i+1
      labeler = labeler.toString();
      setMarker(hotspots[i]['latitude'], hotspots[i]['longitude'],labeler);
    }
          
  });
}

function pinSymbol(color) {
  return {
    path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#000',
    strokeWeight: 2,
    labelOrigin: new google.maps.Point(0, -30),
    scale: 1
  };
}


function setMarker(lat, long, labeler) {
  var latLong = new google.maps.LatLng(lat, long);
  var hot_spot_marker = new google.maps.Marker({
    position: latLong,
    icon: pinSymbol(iconcolor),
    label: labeler,
    title: "Test"
  });

  hot_spot_marker.setMap(map);

  google.maps.event.addListener(hot_spot_marker, "click", function() {
      drawArrow( hot_spot_marker );
      //Delete below when done testing
      var position = { coords: { 
                                    latitude: hot_spot_marker.position.lat(),
                                    longitude: hot_spot_marker.position.lng()
      } };
      console.log("IN LISTENER");
      window.parent.forcePositionUpdate( position, true );
  });
}

function drawArrow( hot_spot_marker ) {
  console.log(marker);
  if ( marker == null ) {
      return;
  }

    if ( arrowMarker ) {
      arrowMarker.setMap( null );
    }

    var direction = hot_spot_marker.position;

    var lat = marker.getPosition().lat() + ( ( direction.lat() - marker.getPosition().lat() ) / 2 );
    var long = marker.getPosition().lng() + ( ( direction.lng() - marker.getPosition().lng() ) / 2 );

    var arrowPosition = new google.maps.LatLng(lat, long);

    console.log( marker );
    console.log( arrowPosition );

    arrowMarker = new google.maps.Marker( {
        position:   arrowPosition,
        map:        map,
        draggable:  false,
        title:      "next"
    } );

    var heading = google.maps.geometry.spherical.computeHeading( marker.position, direction );

    arrowMarker.setIcon({
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 6,
        rotation: heading
    });
}

function loadJSON(callback) {
  var request = new XMLHttpRequest();
  request.overrideMimeType("application/json");
  request.open('GET', '../text_files/markers.json', true);
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == "200") {
      callback(request.responseText);
    }
  };
  request.send(null);
}

//Source: https://stackoverflow.com/questions/639695/how-to-convert-latitude-or-longitude-to-meters
function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM
  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000; // meters
}

function success(pos) {  
  var latLong = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
  //alert("Lat: " + latLong.latitude + " Long: " + latLong.longitude);
  var mapOpt = {
    zoom: 10,
    center: latLong,
    mapTypeId: google.maps.MapTypeId.ROAD
  };

  //map.setCenter(latLong);
  if (marker) {
    marker.setMap(null);
  }

  updateMarker(latLong, "Position", "<b>Current Location</b>");

  autoUpdate();
}

function updateMarker(latLong, title, content) {
  var markerOptions = {
    position: latLong,
    map: map,
    title: title,
    animation: google.maps.Animation.DROP
  };

  marker = new google.maps.Marker(markerOptions);

  var infoWindow = new google.maps.InfoWindow({
      content: content,
      position: latLong
  });

  google.maps.event.addListener(marker, "click", function() {
    infoWindow.open(map);
  });
}



function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}

options = {
  enableHighAccuracy: true,
  timeout: Infinity,
  maximumAge: 0
};

function setUpAutoUpdate() {
  autoUpdate();
  //setTimeout(autoUpdate, 5000);
  navigator.geolocation.watchPosition(success, error, options);
}

function autoUpdate() {
  navigator.geolocation.getCurrentPosition(function(position) {
    var newPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    if (marker) {
      marker.setPosition(newPosition);
    } else {
      marker = new google.maps.Marker({
        position: newPosition,
        map: map
      });
    }

    map.setCenter(newPosition);

  }, function( err ) {
    console.log ( err.message );
    handleLocationError(true, infoWindow, map.getCenter());
  }, { 
        enableHighAccuracy: true,
        timeout : 5000 
  } );
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
