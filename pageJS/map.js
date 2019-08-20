


window.onload = function() {
	
}

// Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
      var map, infoWindow, marker;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          rotateControl : true
        });
        infoWindow = new google.maps.InfoWindow;
        
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          setUpAutoUpdate();
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function success(pos) {
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
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }