
function loadImg(url) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function addMarkerOnMap(lat, lng, map){

  var mp = new L.Marker([lat, lng]).addTo(map).bindPopup(
    "<div class='text-center py-1'><strong>座標: " +
    lat + ', ' + lng + "</strong></div>" +
    "<div class='form-group text-center'><input class='markerName' style='height: 35px;' type='text'/></div>" +
    "<button class='btn mx-1 btn-sm btn-success marker-edit-button text-center'>編輯座標</button>" +
    '<button class= "btn mx-1 btn-sm btn-danger marker-delete-button text-center">清除座標</button>'
  );

  var popup = L.popup();

  console.log(map);

  mp.on("popupopen", function(){

    var tempMarker = this;

    $(".marker-delete-button:visible").click(function () {
        map.removeLayer(tempMarker);
    });

    $(".marker-edit-button:visible").click(function () {
        var MarkerName = $(".markerName").val();
        tempMarker.setPopupContent(
          "<div class='text-center py-1'><strong>座標: " +
          lng + ', ' + lat + "</strong></div>" +
          "<div class='text-center my-3 h4'>" + MarkerName + "</div>" +
          '<button class= "btn mx-1 btn-sm btn-danger text-center marker-delete-button">清除座標</button>'
        );

        if(tempMarker.isPopupOpen()){
          $(".marker-delete-button:visible").click(function () {
              map.removeLayer(tempMarker);
          });
        }

    });

  });
}

async function run(overlayimg) {

  let img = await loadImg(overlayimg);
  let w = img.width;
  let h = img.height;

  var map = L.map('mapid', {
    crs: L.CRS.Simple,
    minZoom: -1
  });

  var bounds = [[0,0], [h, w]];
  var image = L.imageOverlay(overlayimg, bounds).addTo(map);

  map.fitBounds(bounds);

  removeElementsByClass("leaflet-control-attribution");

  var popup = L.popup();

  function onMapClick(e) {
    var latlng = map.mouseEventToLatLng(e.originalEvent);
    console.log(map);

    popup
  		.setLatLng(e.latlng)
  		.setContent(
        "<div><strong>座標:" + latlng.lng + ', ' + latlng.lat + "</strong></div>" +
        "<div class='text-center'><button class='btn btn-primary my-2 btn-sm add-marker-btn'>新增座標</button></div>"
      )
  		.openOn(map);

    $(".add-marker-btn:visible").click(function () {
      addMarkerOnMap(latlng.lat, latlng.lng, map);
      map.closePopup();
    });
  }

  map.on('click', onMapClick);

  return map;
}

// remove elements
function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

// Dragging and dropping the markers to the map
var addMarkers = function (map, markers, markersCount) {
  // The position of the marker icon
  var posTop = $( '.draggable-marker' ).css( 'top' ),
      posLeft = $( '.draggable-marker' ).css( 'left' );

  $( '.draggable-marker' ).draggable({
    stop: function ( e, ui ) {
      // returning the icon to the menu
      $( '.draggable-marker' ).css( 'top', posTop );
      $( '.draggable-marker' ).css( 'left', posLeft );

      var markerName = $(this).attr('name');
      var markerIcon = $(this).attr('src');

      var sideMenuWidth = $('.side-menu').width();

      var coordsX = event.clientX - (sideMenuWidth + 20), // 50 is the width of the menu
          coordsY = event.clientY - 15, // 20 is the half of markers height
          point = L.point( coordsX, coordsY ), // createing a Point object with the given x and y coordinates
          markerCoords = map.containerPointToLatLng( point ), // getting the geographical coordinates of the point

          // Creating a custom icon
          myIcon = L.icon({
            iconUrl: markerIcon, // the url of the img
            iconSize: [40, 40],
            iconAnchor: [20, 40] // the coordinates of the "tip" of the icon ( in this case must be ( icon width/ 2, icon height )
          });

          console.log(point);

          // Creating a new marker and adding it to the map
          markers[ markersCount ] = L.marker( [ markerCoords.lat, markerCoords.lng ], {
                                              draggable: true,
                                              icon: myIcon
                                            })
                                            .addTo( map )
                                            .bindPopup(
                                              "<div class='text-center py-1'><strong>" +
                                              markerName + "</strong></div>" +
                                              "<div class='form-group text-center'><input class='markerName' style='height: 35px;' type='text'/></div>" +
                                              "<button class='btn mx-1 btn-sm btn-success marker-edit-button text-center'>編輯座標</button>" +
                                              '<button class= "btn mx-1 btn-sm btn-danger marker-delete-button text-center">清除座標</button>'
                                            );

      markers[ markersCount ].on("popupopen", function(){

        var tempMarker = this;

        $(".marker-delete-button:visible").click(function () {
            map.removeLayer(tempMarker);
        });

        $(".marker-edit-button:visible").click(function () {
            var MarkerName = $(".markerName").val();
            tempMarker.setPopupContent(
              "<div class='text-center py-1'><strong>" +
              markerName + "</strong></div>" +
              "<div class='text-center my-3 h4'>" + MarkerName + "</div>" +
              '<button class= "btn mx-1 btn-sm btn-danger text-center marker-delete-button">清除座標</button>'
            );

            if(tempMarker.isPopupOpen()){
              $(".marker-delete-button:visible").click(function () {
                  map.removeLayer(tempMarker);
              });
            }

        });

      });

      markersCount++;
    }
  });
}

// image onload and upload function
window.addEventListener('load', function() {

  imgUrl = './img/demo.jpg';

  loadImg(imgUrl)
    .then(img => {

      var markers = [], // an array containing all the markers added to the map
          markersCount = 0; // the number of the added markers

      console.log(`w: ${img.width} | h: ${img.height}`);

      var staticMap = new L.map('static-map', {
          crs: L.CRS.Simple,
          minZoom: -1
      });

      var staticBounds = [[0,0], [img.height, img.width]];
      var staticImage = L.imageOverlay(imgUrl, staticBounds).addTo(staticMap);

      staticMap.fitBounds(staticBounds);
      removeElementsByClass("leaflet-control-attribution");

      addMarkers(staticMap, markers, markersCount);

    })
    .catch(err => console.error(err));

  // document.querySelector('input[type="file"]').addEventListener('change', function() {
  //   if (this.files && this.files[0]) {
  //     var overlayimg = URL.createObjectURL(this.files[0]);
  //     var mapthis = run(overlayimg);
  //     console.log(mapthis);
  //   }
  // });

});
