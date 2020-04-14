
function loadImg(url) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function addMarkerOnMap(lat, lng, map, markersClusterParamAdd, markerIcon, markerName, inputObj){

  var myIconAdd = L.icon({
    iconUrl: markerIcon, // the url of the img
    iconSize: [40, 40],
    iconAnchor: [20, 20] // the coordinates of the "tip" of the icon ( in this case must be ( icon width/ 2, icon height )
  });

  var mpmark = new L.Marker([lat, lng],{
                        draggable: true,
                        icon: myIconAdd
                      })
                    .addTo(map)
                    .bindPopup(
        "<div class='text-center py-1'><strong class='marker-title'>" +
        markerName + "</strong></div>" +
        "<div class='py-1 font-weight-bold'>品牌: " + inputObj.company + "</div>" +
        "<div class='py-1'>型號: " + inputObj.detail_name + "</div>" +
        "<div class='pt-1 pb-3'>保固期限: " + inputObj.due_date + "</div>" +
        "<button class='btn mx-1 btn-sm btn-warning text-center'>報修</button>" +
        '<button class= "btn mx-1 btn-sm btn-secondary text-center">詳細</button>'
      );

  // var popup = L.popup();

  mpmark.on("popupopen", function(){

    var tempMarker = this;
    var windowWidth = $(window).width();
    console.log('OK');

    if(windowWidth < 576){
      $('input').focus(function(){
        $('#device-side-menu').hide();
      });
      $('input').blur(function(){
        $('#device-side-menu').show();
      });
    }

    $(".marker-delete-button:visible").click(function () {
        markersClusterParamAdd.removeLayer(tempMarker);
        map.removeLayer(tempMarker);
        map.addLayer(markersClusterParamAdd);
    });

    $(".marker-edit-button:visible").click(function () {
      var markerNote = $(".markerName").val();
      tempMarker.setPopupContent(
        "<div class='text-center py-1'><strong class='marker-title'>" +
        markerName + "</strong></div>" +
        "<div class='text-center my-3 h4'>" + markerNote + "</div>" +
        '<button class= "btn mx-1 btn-sm btn-danger text-center marker-delete-button">移除</button>'
      );

      if(tempMarker.isPopupOpen()){
        $(".marker-delete-button:visible").click(function () {
            markersClusterParamAdd.removeLayer(tempMarker);
            map.removeLayer(tempMarker);
            map.addLayer(markersClusterParamAdd);
        });
      }
    });
  });

  // create marker hover function
  var tooltipPopup;

  mpmark.on('mouseover', function(e) {
    $('.draggable-marker[name="' + markerName +'"]').closest('li').css('background-color', '#c5e0ed');
    tooltipPopup = L.popup({ offset: L.point(0, -20)});
    tooltipPopup.setContent('<div class="text-center">' + markerName + '</div>');
    tooltipPopup.setLatLng(e.target.getLatLng());
    tooltipPopup.openOn(map);
  });

  mpmark.on('mouseout', function(e) {
    $('.draggable-marker[name="' + markerName +'"]').closest('li').css('background-color', '');
    map.closePopup(tooltipPopup);
  });

  // add marker cluster on the map
  markersClusterParamAdd.addLayer(mpmark);
  map.addLayer(markersClusterParamAdd);
}

function preloadMarkers(map, markersClusterParam){
  var markerJson = [
    {
      lat: 216,
      lng: 745,
      icon: 'img/icon3.png',
      markername: '洗衣機',
      company: 'Panasonic',
      detail_name: 'NA-VX88GL(銀)',
      due_date: '2020/12/31',
    },
    {
      lat: 46,
      lng: 590,
      icon: 'img/icon2.png',
      markername: '電視',
      company: 'Sony',
      detail_name: 'Z9G(黑)',
      due_date: '2020/06/30',
    },
    {
      lat: 378,
      lng: 430,
      icon: 'img/icon4.png',
      markername: '冰箱',
      company: 'HITACHI',
      detail_name: 'RG500GJ(白)',
      due_date: '2020/12/31',
    },
    {
      lat: 467,
      lng: 775,
      icon: 'img/icon5.png',
      markername: '空調',
      company: 'Teco',
      detail_name: 'MA40IH-ZR2(白)',
      due_date: '2020/06/30',
    },
    {
      lat: 42,
      lng: 218,
      icon: 'img/icon6.png',
      markername: '插座',
      company: 'Panasonic',
      detail_name: 'WTDFP8',
      due_date: '2020/12/31',
    },
    {
      lat: 42,
      lng: 660,
      icon: 'img/icon6.png',
      markername: '插座',
      company: 'Panasonic',
      detail_name: 'WTDFP8',
      due_date: '2020/12/31',
    }
  ];
  for(var i=0; i<markerJson.length; i++){
    addMarkerOnMap(markerJson[i].lat, markerJson[i].lng, map, markersClusterParam, markerJson[i].icon, markerJson[i].markername, markerJson[i]);
  }

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
    // console.log(map);

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
var addMarkers = function(map, markers, markersCount, markersCluster, addXm, addYm, scrollValm){
  // The position of the marker icon
  var posTop = $('.draggable-marker').css('top'),
      posLeft = $('.draggable-marker').css('left');

  $('.draggable-marker').draggable({
    start: function(e, ui){
      $('.side-menu').css('overflow', 'visible');
    },
    drag: function(e, ui){
      $('.side-menu').css('overflow', 'visible');
    },
    stop: function(e, ui){
      $('.side-menu').css('overflow', 'auto');
      // returning the icon to the menu
      $('.draggable-marker').css('top', posTop);
      $('.draggable-marker').css('left', posLeft);

      var markerName = $(this).attr('name');
      var company = $(this).attr('company');
      var detail_name = $(this).attr('detail_name');
      var due_date = $(this).attr('due_date');
      var markerIcon = $(this).attr('src');

      var windowWidth = $(window).width();
      var outer_left = $('.outer-side-col').css('left');

      if(addXm === 0 && addYm === 0){
        if(windowWidth < 576){
          addXm = 0;
          addYm = -60;
        }else if(windowWidth >= 576 && outer_left === '0px'){
          var xc = $('.outer-side-col').width();
          addXm = -xc-15;
          addYm = -60;
        }else if(windowWidth >= 576 && outer_left !== '0px'){
          addXm = 0;
          addYm = -60;
        }
      }else{

      }
      // console.log(scrollValm);

      var coordsX = event.clientX + addXm,
          coordsY = event.clientY + addYm + scrollValm - 40,
          point = L.point(coordsX, coordsY), // createing a Point object with the given x and y coordinates
          markerCoords = map.containerPointToLatLng(point), // getting the geographical coordinates of the point

          // Creating a custom icon
          myIcon = L.icon({
            iconUrl: markerIcon, // the url of the img
            iconSize: [40, 40],
            iconAnchor: [20, 20] // the coordinates of the "tip" of the icon ( in this case must be ( icon width/ 2, icon height )
          });

          var latlng = map.mouseEventToLatLng(e.originalEvent);

          // Creating a new marker and adding it to the map
          markers[markersCount] = L.marker([markerCoords.lat, markerCoords.lng], {
                                              draggable: true,
                                              icon: myIcon
                                     })
                                     .addTo(map)
                                     .bindPopup(
                                       "<div class='text-center py-1'><strong class='marker-title'>" +
                                       markerName + "</strong></div>" +
                                       "<div class='py-1 font-weight-bold'>品牌: " + company + "</div>" +
                                       "<div class='py-1'>型號: " + detail_name + "</div>" +
                                       "<div class='pt-1 pb-3'>保固期限: " + due_date + "</div>" +
                                       "<button class='btn mx-1 btn-sm btn-warning text-center'>報修</button>" +
                                       '<button class= "btn mx-1 btn-sm btn-secondary text-center">詳細</button>'
                                     );

      // create marker popup function
      markers[markersCount].on("popupopen", function(){
        var tempMarker = this;
        if(windowWidth < 576){
          $('input').focus(function(){
            $('#device-side-menu').hide();
          });

          $('input').blur(function(){
            $('#device-side-menu').show();
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
              "<div class='text-center py-1'><strong class='marker-title'>" +
              markerName + "</strong></div>" +
              "<div class='text-center my-3 h4'>" + markerNote + "</div>" +
              '<button class= "btn mx-1 btn-sm btn-danger text-center marker-delete-button">移除</button>'
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

      markersCount++;
      addXm = 0;
      addYm = 0;
    }
  });
  map.addLayer(markersCluster);
}

// image onload and upload function
window.addEventListener('load', function() {

  var imgUrl = './img/demo.jpg';
  var windowWidth = $(window).width();

  loadImg(imgUrl)
    .then(img => {

      var markers = [], // an array containing all the markers added to the map
          markersCount = 0, // the number of the added markers
          markersCluster = L.markerClusterGroup();

      // console.log(`w: ${img.width} | h: ${img.height}`);

      var staticMap = new L.map('static-map', {
          crs: L.CRS.Simple,
          maxZoom: 2,
          minZoom: -1
      });

      var staticBounds = [[0,0], [img.height, img.width]];
      var staticImage = L.imageOverlay(imgUrl, staticBounds).addTo(staticMap);

      staticMap.fitBounds(staticBounds);
      removeElementsByClass("leaflet-control-attribution");

      // preload markers
      preloadMarkers(staticMap, markersCluster);

      // width adjustment
      var addX = 0;
      var addY = 0;

      if(windowWidth < 576){
        $(document).on('focus', 'input', function(){
          var addX = -77;
          var addY = -60;
        });
      }

      // scroll adjustment
      var scrollVal = 0;
      $(window).scroll(function () {
        scrollVal = $(this).scrollTop();
        addMarkers(staticMap, markers, markersCount, markersCluster, addX, addY, scrollVal);
      });

      addMarkers(staticMap, markers, markersCount, markersCluster, addX, addY, scrollVal);

    })
    .catch(err => console.error(err));

  // document.querySelector('input[type="file"]').addEventListener('change', function() {
  //   if (this.files && this.files[0]) {
  //     var overlayimg = URL.createObjectURL(this.files[0]);
  //     var mapthis = run(overlayimg);
  //   }
  // });

  // when items list was hovered
  $('.item-li').hover(function(){
    var itme_img = $(this).find('.draggable-marker').attr('src');

    // $.each($('.marker-cluster'), function(){
    //   console.log($(this));
    //   $(this).click();
    // });

    $.each($('.leaflet-marker-icon'), function(){
      if($(this).attr('src') === itme_img){
        $(this).css('background-color', 'yellow')
               .css('border-radius', '50%');
        // console.log($(this).attr('src'));
      }
    });

  }, function(){
    $('.leaflet-marker-icon').css('background-color', '');
  });

  // RWD
  if(windowWidth < 576){
    $('input').focus(function(){
      $('#device-side-menu').hide();
    });
    $('input').blur(function(){
      $('#device-side-menu').show();
    });

    $('#normal-side-menu').hide();
    $('#device-side-menu').show();

    $('.outer-side-col').css('left', '-250px')
                        .removeClass('col-sm-2')
                        .hide();

    $('#sidebar-btn').css('color', '#e7e7e7');
    $('.static-map-col').removeClass('col-sm-8')
                        .addClass('col-sm-10');
  }else{
    $('#normal-side-menu').show();
    $('#device-side-menu').hide();
  }

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
});

// RWD
$(window).on('resize', function(){
  var $window = $(window);
  var windowsize = $window.width();

  if (windowsize < 576) {
    $('input').focus(function(){
      $('#device-side-menu').hide();
    });
    $('input').blur(function(){
      $('#device-side-menu').show();
    });

    $('#normal-side-menu').hide();
    $('#device-side-menu').show();
  }else{
    $('#normal-side-menu').show();
    $('#device-side-menu').hide();
  }
});
