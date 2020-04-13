
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
var addMarkers = function(map, markers, markersCount, markersCluster, addXm, addYm){
  // The position of the marker icon
  var posTop = $('.draggable-marker').css('top'),
      posLeft = $('.draggable-marker').css('left');

  $('.draggable-marker').draggable({
    start: function(e, ui){
      $('.side-menu').css('overflow', 'visible');
    },
    stop: function(e, ui){
      $('.side-menu').css('overflow', 'auto');
      // returning the icon to the menu
      $('.draggable-marker').css('top', posTop);
      $('.draggable-marker').css('left', posLeft);

      var markerName = $(this).attr('name');
      var markerIcon = $(this).attr('src');

      var sideMenuWidth = $(window).width();
      var outer_left = $('.outer-side-col').css('left');

      if(addXm === 0 && addYm === 0){
        if(sideMenuWidth < 576){
          addXm = 0;
          addYm = -60;
        }else if(sideMenuWidth >= 576 && outer_left === '0px'){
          var xc = $('.outer-side-col').width();
          addXm = -xc-15;
          addYm = -60;
        }else if(sideMenuWidth >= 576 && outer_left !== '0px'){
          addXm = 0;
          addYm = -60;
        }
      }else{

      }

      var coordsX = event.clientX + addXm,
          coordsY = event.clientY + addYm,
          point = L.point(coordsX, coordsY), // createing a Point object with the given x and y coordinates
          markerCoords = map.containerPointToLatLng(point), // getting the geographical coordinates of the point

          // Creating a custom icon
          myIcon = L.icon({
            iconUrl: markerIcon, // the url of the img
            iconSize: [40, 40],
            iconAnchor: [20, 20] // the coordinates of the "tip" of the icon ( in this case must be ( icon width/ 2, icon height )
          });

          console.log(point);

          // Creating a new marker and adding it to the map
          markers[markersCount] = L.marker([markerCoords.lat, markerCoords.lng], {
                                              draggable: true,
                                              icon: myIcon
                                     })
                                     .addTo(map)
                                     .bindPopup(
                                       "<div class='text-center py-1'><strong>" +
                                       markerName + "</strong></div>" +
                                       "<div class='form-group text-center'><input class='markerName form-control' style='height: 35px;' type='text'/></div>" +
                                       "<button class='btn mx-1 btn-sm btn-success marker-edit-button text-center'>編輯座標</button>" +
                                       '<button class= "btn mx-1 btn-sm btn-danger marker-delete-button text-center">清除座標</button>'
                                     );

      // create marker popup function
      markers[markersCount].on("popupopen", function(){
        var tempMarker = this;

        if(sideMenuWidth < 576){
          $('input').focus(function(){
            $('.side-menu').hide();
          });

          $('input').blur(function(){
            $('.side-menu').show();
          });
        }

        $(".marker-delete-button:visible").click(function () {
            markersCluster.removeLayer(tempMarker);
            map.removeLayer(tempMarker);
            map.addLayer(markersCluster);
        });

        $(".marker-edit-button:visible").click(function () {
            var markerNote = $(".markerName").val();
            tempMarker.setPopupContent(
              "<div class='text-center py-1'><strong>" +
              markerName + "</strong></div>" +
              "<div class='text-center my-3 h4'>" + markerNote + "</div>" +
              '<button class= "btn mx-1 btn-sm btn-danger text-center marker-delete-button">清除座標</button>'
            );

            if(tempMarker.isPopupOpen()){
              $(".marker-delete-button:visible").click(function () {
                  markersCluster.removeLayer(tempMarker);
                  map.removeLayer(tempMarker);
                  map.addLayer(markersCluster);
              });
            }
        });
      });

      // create marker hover function
      var tooltipPopup;

  		markers[markersCount].on('mouseover', function(e) {
        $('.draggable-marker[name="' + markerName +'"]').closest('li').css('background-color', '#c5e0ed');
      	tooltipPopup = L.popup({ offset: L.point(0, -20)});
				tooltipPopup.setContent('<div class="text-center">' + markerName + '</div>');
				tooltipPopup.setLatLng(e.target.getLatLng());
				tooltipPopup.openOn(map);
  		});

  		markers[markersCount].on('mouseout', function(e) {
        $('.draggable-marker[name="' + markerName +'"]').closest('li').css('background-color', '');
  			map.closePopup(tooltipPopup);
  		});
      // add marker cluster on the map
      markersCluster.addLayer(markers[markersCount]);
      map.addLayer(markersCluster);

      markersCount++;
      addXm = 0;
      addYm = 0;
    }
  });
}

// image onload and upload function
window.addEventListener('load', function() {

  imgUrl = './img/demo.jpg';

  loadImg(imgUrl)
    .then(img => {

      var markers = [], // an array containing all the markers added to the map
          markersCount = 0, // the number of the added markers
          markersCluster = L.markerClusterGroup();

      console.log(`w: ${img.width} | h: ${img.height}`);

      var staticMap = new L.map('static-map', {
          crs: L.CRS.Simple,
          maxZoom: 2,
          minZoom: -1
      });

      var staticBounds = [[0,0], [img.height, img.width]];
      var staticImage = L.imageOverlay(imgUrl, staticBounds).addTo(staticMap);

      staticMap.fitBounds(staticBounds);
      removeElementsByClass("leaflet-control-attribution");

      var addX = 0;
      var addY = 0;

      var sideMenuWidth = $(window).width();

      if(sideMenuWidth < 576){
        $(document).on('focus', 'input', function(){
          var addX = -77;
          var addY = -60;
        });
      }

      addMarkers(staticMap, markers, markersCount, markersCluster, addX, addY);

    })
    .catch(err => console.error(err));

  // document.querySelector('input[type="file"]').addEventListener('change', function() {
  //   if (this.files && this.files[0]) {
  //     var overlayimg = URL.createObjectURL(this.files[0]);
  //     var mapthis = run(overlayimg);
  //   }
  // });

  $('#sidebar-btn').click(function(){
    if($('.outer-side-col').css('left') == '-250px'){
      $('.outer-side-col').addClass('col-sm-2')
                          .show()
                          .css('left', '0px');
      $('#sidebar-btn').css('color', '#008acf');
      $('.static-map-col').removeClass('col-sm-10')
                          .addClass('col-sm-8');
    }else{
      $('.outer-side-col').css('left', '-250px')
                          .removeClass('col-sm-2')
                          .hide();

      $('#sidebar-btn').css('color', '#e7e7e7');
      $('.static-map-col').removeClass('col-sm-8')
                          .addClass('col-sm-10');
    }
  });

  // $('#sidebar-btn').hover(function(){
  //   $('.outer-side-col').css('left', '3px');
  //   $('#sidebar-btn').css('color', '#008acf');
  // }, function(){
  //   $('.outer-side-col').css('left', '-150px');
  //   $('#sidebar-btn').css('color', '#e7e7e7');
  // });

});
