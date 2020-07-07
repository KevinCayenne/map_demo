// async function run(overlayimg) {

//   let img = await loadImg(overlayimg);
//   let w = img.width;
//   let h = img.height;

//   var map = L.map('mapid', {
//     crs: L.CRS.Simple,
//     minZoom: -1
//   });

//   var bounds = [[0,0], [h, w]];
//   var image = L.imageOverlay(overlayimg, bounds).addTo(map);

//   map.fitBounds(bounds);

//   removeElementsByClass("leaflet-control-attribution");

//   var popup = L.popup();

//   function onMapClick(e) {
//     var latlng = map.mouseEventToLatLng(e.originalEvent);
//     // console.log(map);

//     popup
//   		.setLatLng(e.latlng)
//   		.setContent(
//         "<div><strong>座標:" + latlng.lng + ', ' + latlng.lat + "</strong></div>" +
//         "<div class='text-center'><button class='btn btn-primary my-2 btn-sm add-marker-btn'>新增座標</button></div>"
//       )
//   		.openOn(map);

//     $(".add-marker-btn:visible").click(function () {
//       addMarkerOnMap(latlng.lat, latlng.lng, map);
//       map.closePopup();
//     });
//   }

//   map.on('click', onMapClick);

//   return map;
// }

// load sub category api json
var subCategoryJson = [
  {
    id: 1,
    name: '電視',
    icon: 'img/icon2.png',
    company: 'Sony',
    detail_name: 'Z9G(黑)',
    due_date: '2020/06/30',
    category: '設備',
  },
  {
    id: 2,
    name: '洗衣機',
    icon: 'img/icon3.png',
    company: 'Panasonic',
    detail_name: 'NA-VX88GL(銀)',
    due_date: '2020/12/31',
    category: '設備',
  },
  {
    id: 3,
    name: '冰箱',
    icon: 'img/icon4.png',
    company: 'HITACHI',
    detail_name: 'RG500GJ(白)',
    due_date: '2020/12/31',
    category: '設備',
  },
  {
    id: 4,
    icon: 'img/icon5.png',
    name: '空調',
    company: 'Teco',
    detail_name: 'MA40IH-ZR2(白)',
    due_date: '2020/06/30',
    category: '設備',
  },
  {
    id: 5,
    icon: 'img/icon6.png',
    name: '插座',
    company: 'Panasonic',
    detail_name: 'WTDFP8',
    due_date: '2020/12/31',
    category: '水電',
  },
];

// load marker api json
var markerJsons = [
  {
    id: 1,
    lat: 216,
    lng: 745,
    icon: 'img/icon3.png',
    markername: '洗衣機',
    company: 'Panasonic',
    detail_name: 'NA-VX88GL(銀)',
    due_date: '2020/12/31',
    location: [],
    category: '設備',
  },
  {
    id: 2,
    lat: 46,
    lng: 590,
    icon: 'img/icon2.png',
    markername: '電視',
    company: 'Sony',
    detail_name: 'Z9G(黑)',
    due_date: '2020/06/30',
    location: [],
    category: '設備',
  },
  {
    id: 3,
    lat: 378,
    lng: 430,
    icon: 'img/icon4.png',
    markername: '冰箱',
    company: 'HITACHI',
    detail_name: 'RG500GJ(白)',
    due_date: '2020/12/31',
    location: [],
    category: '設備',
  },
  {
    id: 4,
    lat: 467,
    lng: 775,
    icon: 'img/icon5.png',
    markername: '空調',
    company: 'Teco',
    detail_name: 'MA40IH-ZR2(白)',
    due_date: '2020/06/30',
    location: [],
    category: '設備',
  },
  {
    id: 5,
    lat: 42,
    lng: 218,
    icon: 'img/icon6.png',
    markername: '插座',
    company: 'Panasonic',
    detail_name: 'WTDFP8',
    due_date: '2020/12/31',
    location: [],
    category: '設備',
  },
  {
    id: 6,
    lat: 42,
    lng: 660,
    icon: 'img/icon6.png',
    markername: '插座',
    company: 'Panasonic',
    detail_name: 'WTDFP8',
    due_date: '2020/12/31',
    location: [],
    category: '水電',
  }
];

// load ploygon api json
var ploygonJsons = [
  {
    id: 1,
    name: '廚房',
    loc: [
      [351.509, 560.08],
      [351.503, 450.06],
      [730.51, 450.047],
      [730.51, 560.047],
    ],
  },
  {
    id: 2,
    name: '小孩房',
    loc: [
      [351.509, 350.08],
      [351.503, 170.06],
      [570.51, 170.047],
      [570.51, 350.047],
    ],
  }
];

// temp ploygon list
var tempPolygon = [];
var tempMarker = [];


// function to check if point is inside a polygon
// usage: inside([markerJsons[2].lat, markerJsons[2].lng ], ploygonJsons[0].loc)
function inside(point, vs){
  // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

  var x = point[0], y = point[1];
  var inside = false;

  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0], yi = vs[i][1];
      var xj = vs[j][0], yj = vs[j][1];

      var intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }

  return inside;
};

function updateMarkerLoc(){

}

// create base img promise 
function loadImg(url){
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

// preload markers
function preloadMarkers(markerJson, map, markersClusterParam, filter = ''){

  if(filter !== ''){
    var markerFilterList = [];
    for(var i in markerJson){
      if(markerJson[i].markername === filter){
        markerFilterList.push(markerJson[i]);
      }
    }
    markerJson = markerFilterList;
  }

  for(var i in markerJson){

    var myIconAdd = L.icon({
      iconUrl: markerJson[i].icon, // the url of the img
      iconSize: [40, 40],
      iconAnchor: [20, 20], // the coordinates of the "tip" of the icon ( in this case must be ( icon width/ 2, icon height )
      name: markerJson[i].markername,
      id: markerJson[i].id,
      company: markerJson[i].company,
      detail_name: markerJson[i].detail_name,
      due_date: markerJson[i].due_date,
    });

    var mpmark = new L.Marker(new L.LatLng(markerJson[i].lat, markerJson[i].lng),{
                          draggable: true,
                          icon: myIconAdd,
                          name: markerJson[i].markername,
                          id: markerJson[i].id,
                          location: markerJson[i].location
                        })
                      .bindPopup(
                          "<div class='text-center py-1' item_id=" + markerJson[i].id + "><strong class='marker-title'>" + markerJson[i].markername + "</strong></div>" +
                          "<div class='py-1 font-weight-bold'>品牌: " + markerJson[i].company + "</div>" +
                          "<div class='py-1'>型號: " + markerJson[i].detail_name + "</div>" +
                          "<div class='pt-1'>保固期限: " + markerJson[i].due_date + "</div>" +
                          "<div class='pt-1 pb-3 location-div' item_id=" + markerJson[i].id + ">位置: " + markerJson[i].location + "</div>" +
                          "<button class='btn mx-1 btn-sm btn-warning text-center'>報修</button>" +
                          "<button class='btn mx-1 btn-sm btn-secondary text-center'>詳細</button>" +
                          "<button class='btn mx-1 btn-sm btn-outline-danger text-center marker-delete-button'>移除</button>"
                      );

    var popup = L.popup();

    mpmark.on("popupopen", function(){

      var tempMarkerThis = this;
      var windowWidth = $(window).width();

      if(windowWidth < 576){
        $('input').focus(function(){
          $('#device-side-menu').hide();
        });
        $('input').blur(function(){
          $('#device-side-menu').show();
        });
      }

      // remove marker
      $(".marker-delete-button:visible").click(function () {
          var item_id = tempMarkerThis.options.id;
          for(var i=0; i<markerJsons.length; i++){
            if(markerJsons[i].id == item_id){
              markerJsons.splice(i, 1);
            }
          }
          markersClusterParam.removeLayer(tempMarkerThis);
          map.removeLayer(tempMarkerThis);
          map.addLayer(markersClusterParam);
      });

      // $(".marker-edit-button:visible").click(function () {
      //   var markerNote = $(".markerName").val();
      //   tempMarkerThis.setPopupContent(
      //     "<div class='text-center py-1'><strong class='marker-title'>" +
      //     markerName + "</strong></div>" +
      //     "<div class='text-center my-3 h4'>" + markerNote + "</div>" +
      //     '<button class= "btn mx-1 btn-sm btn-danger text-center marker-delete-button">移除</button>'
      //   );

      //   if(tempMarkerThis.isPopupOpen()){
      //     $(".marker-delete-button:visible").click(function () {
      //         markersClusterParam.removeLayer(tempMarkerThis);
      //         map.removeLayer(tempMarkerThis);
      //         map.addLayer(markersClusterParam);
      //     });
      //   }
      // });
    });

    // create marker hover function
    var tooltipPopup;
    mpmark.on('mouseover', function(e){
      $('.draggable-marker[name="' + this.options.name + '"]').closest('li').css('background-color', '#c5e0ed');
      tooltipPopup = L.popup({offset: L.point(0, -20)});
      tooltipPopup.setContent('<div class="text-center">' + this.options.name + '</div>');
      tooltipPopup.setLatLng(e.target.getLatLng());
      tooltipPopup.openOn(map);
    });

    mpmark.on('mouseout', function(e){
      $('.draggable-marker[name="' + this.options.name + '"]').closest('li').css('background-color', '');
      map.closePopup(tooltipPopup);
    });

    mpmark.on('dragend', function(event) {
      var latlng = event.target.getLatLng();
      var thidId = this.getIcon().options.id;

      // update latlng
      for(i in markerJsons){
        if(markerJsons[i].id === thidId){
          markerJsons[i].lat = latlng.lat;
          markerJsons[i].lng = latlng.lng;

          // update location
          for(var y=0; y<ploygonJsons.length; y++){
            if(inside([markerJsons[i].lat, markerJsons[i].lng], ploygonJsons[y].loc)){
              markerJsons[i].location = [];
              markerJsons[i].location.push(ploygonJsons[y].name);
              console.log(thidId);
              var newContent = 
              "<div class='text-center py-1' item_id=" + markerJson[i].id + "><strong class='marker-title'>" + markerJson[i].markername + "</strong></div>" +
              "<div class='py-1 font-weight-bold'>品牌: " + markerJson[i].company + "</div>" +
              "<div class='py-1'>型號: " + markerJson[i].detail_name + "</div>" +
              "<div class='pt-1'>保固期限: " + markerJson[i].due_date + "</div>" +
              "<div class='pt-1 pb-3 location-div' item_id=" + markerJson[i].id + ">位置: " + markerJson[i].location + "</div>" +
              "<button class='btn mx-1 btn-sm btn-warning text-center'>報修</button>" +
              "<button class='btn mx-1 btn-sm btn-secondary text-center'>詳細</button>" +
              "<button class='btn mx-1 btn-sm btn-outline-danger text-center marker-delete-button'>移除</button>";
  
              this.setPopupContent(newContent);
            }else{
            }
          }

        }
      }
    });

    // add marker cluster on the map
    markersClusterParam.addLayer(mpmark);
  }

  map.addLayer(markersClusterParam);
}

// preload Location
function preloadLocation(locJson, map, locClusterParam, filter = ''){
  for(var i in locJson){
    var mppolygon = new L.polygon(locJson[i].loc, {
      name: locJson[i].name,
      id: locJson[i].id
    })
    .bindPopup(`
      <div class="my-2 text-center font-weight-bold">` + locJson[i].name + `</div>
      <button class="btn btn-sm btn-outline-danger location-delete-button">移除區域</button>
    `);

    mppolygon.on("popupopen", function(){
      var tempPolygonThis = this;

      // remove location
      $(".location-delete-button:visible").click(function () {
        var item_id = tempPolygonThis.options.id;
        for(var i=0; i<locJson.length; i++){
          if(markerJsons[i].id == item_id){
            locJson.splice(i, 1);
          }
        }
        locClusterParam.removeLayer(tempPolygonThis);
        map.removeLayer(tempPolygonThis);
        map.addLayer(locClusterParam);
      });

    });

    locClusterParam.addLayer(mppolygon);
    // console.log(mppolygon);
  }
  map.addLayer(locClusterParam);
}

// marker filter
function markerFilter(map, markersClusterParam, thisObj){
  if(thisObj.attr('filter') === 'off'){
    var item_name = thisObj.text();

    var markers = [], // an array containing all the markers added to the map
        markersCount = 0; // the number of the added markers

    preloadMarkers(markerJsons, map, markersClusterParam, item_name);

    // width adjustment
    var windowWidth = $(window).width();
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
      addMarkers(map, markers, markersCount, markersCluster, addX, addY, scrollVal);
    });
    addMarkers(map, markers, markersCount, markersCluster, addX, addY, scrollVal);

    $('.marker-filter').attr('filter', 'off')
                       .css('background-color', '#f8f9fa');
    thisObj.attr('filter', 'on')
           .css('background-color', 'yellow');
  }else{
    var markers = [], // an array containing all the markers added to the map
        markersCount = 0; // the number of the added markers

    preloadMarkers(markerJsons, map, markersClusterParam);

    // width adjustment
    var windowWidth = $(window).width();
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
      addMarkers(map, markers, markersCount, markersCluster, addX, addY, scrollVal);
    });
    addMarkers(map, markers, markersCount, markersCluster, addX, addY, scrollVal);

    thisObj.attr('filter', 'off')
           .css('background-color', '#f8f9fa');
  }
}

// remove elements
function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

// Dragging and dropping the markers to the map
function addMarkers(map, markers, markersCount, markersCluster, addXm, addYm, scrollValm){
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
      var location = [];
      var category = $(this).attr('category');

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
            iconAnchor: [20, 20], // the coordinates of the "tip" of the icon ( in this case must be ( icon width/ 2, icon height )
            name: markerName,
            id: markerJsons.length + 1
          });

          var latlng = map.mouseEventToLatLng(e.originalEvent);

          // Creating a new marker and adding it to the map
          markers[markersCount] = new L.marker(new L.LatLng(markerCoords.lat, markerCoords.lng), {
                                              draggable: true,
                                              icon: myIcon,
                                              name: markerName,
                                              id: markerJsons.length + 1
                                     })
                                     .bindPopup(
                                       "<div class='text-center py-1'><strong class='marker-title'>" +
                                       markerName + "</strong></div>" +
                                       "<div class='py-1 font-weight-bold'>品牌: " + company + "</div>" +
                                       "<div class='py-1'>型號: " + detail_name + "</div>" +
                                       "<div class='pt-1'>保固期限: " + due_date + "</div>" +
                                       "<div class='pt-1 pb-3' class='location-div'>位置: " + location + "</div>" +
                                       "<button class='btn mx-1 btn-sm btn-warning text-center'>報修</button>" +
                                       '<button class= "btn mx-1 btn-sm btn-secondary text-center">詳細</button>' +
                                       "<button class='btn mx-1 btn-sm btn-outline-danger text-center marker-delete-button'>移除</button>"
                                     );

      // create marker popup function
      markers[markersCount].on("popupopen", function(){
        var tempMarkerThis = this;
        
        if(windowWidth < 576){
          $('input').focus(function(){
            $('#device-side-menu').hide();
          });

          $('input').blur(function(){
            $('#device-side-menu').show();
          });
        }

        // remove marker
        $(".marker-delete-button:visible").click(function () {
            var item_id = tempMarkerThis.options.icon.options.id;
            for(var i=0; i<markerJsons.length; i++){
              if(markerJsons[i].id == item_id){
                markerJsons.splice(i, 1);
              }
            }
            markersCluster.removeLayer(tempMarkerThis);
            map.removeLayer(tempMarkerThis);
            map.addLayer(markersCluster);
        });

        // $(".marker-edit-button:visible").click(function () {
        //     var markerNote = $(".markerName").val();
        //     tempMarker.setPopupContent(
        //       "<div class='text-center py-1'><strong class='marker-title'>" +
        //       markerName + "</strong></div>" +
        //       "<div class='text-center my-3 h4'>" + markerNote + "</div>" +
        //       '<button class= "btn mx-1 btn-sm btn-danger text-center marker-delete-button">移除</button>'
        //     );

        //     if(tempMarker.isPopupOpen()){
        //       $(".marker-delete-button:visible").click(function () {
        //           markersCluster.removeLayer(tempMarker);
        //           map.removeLayer(tempMarker);
        //           map.addLayer(markersCluster);
        //       });
        //     }
        // });
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
        $('.draggable-marker[name="' + markerName + '"]').closest('li').css('background-color', '');
  			map.closePopup(tooltipPopup);
      });
      
      markers[markersCount].on('dragend', function(event) {
        var latlng = event.target.getLatLng();
        var thidId = this.getIcon().options.id;
  
        // update latlng
        for(i in markerJsons){
          if(markerJsons[i].id === thidId){
            markerJsons[i].lat = latlng.lat;
            markerJsons[i].lng = latlng.lng;
            markerJsons[i].location = [];

            // update location
            for(var y=0; y<ploygonJsons.length; y++){
              if(inside([markerJsons[i].lat, markerJsons[i].lng], ploygonJsons[y].loc)){
                markerJsons[i].location.push(ploygonJsons[y].name);
                console.log(thidId);
              }
            }

          }
        }
      });

      var options = markers[markersCount].options;

      // if(options){
      //   console.log(options);
      //   // img.style.something = something(something);
      // }

      // add marker cluster on the map
      markersCluster.addLayer(markers[markersCount]);

      markersCount++;
      addXm = 0;
      addYm = 0;
      var markerJsonsLastID = markerJsons.length;

      var tempJson = {
        id: markerJsonsLastID + 1,
        lat: markerCoords.lat,
        lng: markerCoords.lng,
        icon: markerIcon,
        markername: markerName,
        company: company,
        detail_name: detail_name,
        due_date: due_date,
        location: location,
        category: category
      };

      markerJsons.push(tempJson);

    }
  });
  map.addLayer(markersCluster);
}

// create location
function createLocation(map, ploygon, markerGroup){
  map.on('click', function(event){
    var tempM = L.marker([event.latlng.lat, event.latlng.lng]).addTo(markerGroup);
    tempMarker.push(tempM);
    tempPolygon.push([event.latlng.lat, event.latlng.lng]);
  });
}

// save location
function saveLocation(map, locJson, markerGroup, locClusterParam){
  var markerGroup = L.layerGroup(tempMarker);
  var name = '測試';
  var tempLoc = {
    id: ploygonJsons.length + 1,
    name: name,
    loc: tempPolygon
  }

  var polygon = new L.polygon(tempPolygon, {
    name: name,
    id: ploygonJsons.length + 1
  })
  .bindPopup(`
    <div class="my-2 text-center font-weight-bold">` + name + `</div>
    <button class="btn btn-sm btn-outline-danger location-delete-button">移除區域</button>
  `);

  polygon.on("popupopen", function(){
    var tempPolygonThis = this;

    // remove location
    $(".location-delete-button:visible").click(function () {
      var item_id = tempPolygonThis.options.id;
      for(var i=0; i<locJson.length; i++){
        if(markerJsons[i].id == item_id){
          locJson.splice(i, 1);
        }
      }
      locClusterParam.removeLayer(tempPolygonThis);
      map.removeLayer(tempPolygonThis);
      map.addLayer(locClusterParam);
    });

  });

  ploygonJsons.push(tempLoc);
  locClusterParam.addLayer(polygon);
  map.addLayer(locClusterParam);

  map.off('click');
  tempMarker = [];
  tempPolygon = [];
}

// image onload and upload function
window.addEventListener('load', function() {

  var imgUrl = './img/demo.jpg';
  var windowWidth = $(window).width();

  var subCategoryApp = new Vue({
    el: '#side-menu-item',
    data: {
      subCategory: subCategoryJson
    }
  });

  var deviceSubCategoryApp = new Vue({
    el: '#device-side-menu-item',
    data: {
      subCategory: subCategoryJson
    }
  });

  loadImg(imgUrl)
    .then(img => {
      // console.log(`w: ${img.width} | h: ${img.height}`);

      // init map
      var staticMap = new L.map('static-map', {
          crs: L.CRS.Simple,
          maxZoom: 2,
          minZoom: -1
      });

      // markerLayer
      var markerGroup = L.layerGroup().addTo(staticMap);

      // add img on map
      var staticBounds = [[0,0], [img.height, img.width]];
      var staticImage = L.imageOverlay(imgUrl, staticBounds).addTo(staticMap);

      // set map binds
      staticMap.fitBounds(staticBounds);

      // remove leaflet panel
      removeElementsByClass("leaflet-control-attribution");

      // init markers
      var markers = [], // an array containing all the markers added to the map
          markersCount = 0; // the number of the added markers
          markersCluster = L.markerClusterGroup();
          locationCluster = L.markerClusterGroup();

      // preload locations polygons
      preloadLocation(ploygonJsons, staticMap, locationCluster)
      // preload markers
      preloadMarkers(markerJsons, staticMap, markersCluster);

      // width adjustment
      var windowWidth = $(window).width();
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

      // btn filter function
      $('.marker-filter').click(function(){
        staticMap.removeLayer(markersCluster);
        markersCluster = L.markerClusterGroup();
        markerFilter(staticMap, markersCluster, $(this));
      });

      // btn create location
      $('#create-location-btn').click(function(){
        createLocation(staticMap, ploygonJsons, markerGroup, tempMarker);
        $(this).hide();
        $('#save-location-btn').show();
      });

      // btn save added location
      $('#save-location-btn').click(function(){
        saveLocation(staticMap, ploygonJsons, markerGroup, locationCluster);
        $(this).hide();
        $('#create-location-btn').show();
        staticMap.removeLayer(markerGroup);
        markerGroup = L.layerGroup().addTo(staticMap);
      });

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
