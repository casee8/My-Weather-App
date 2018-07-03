// Selecting the elements for the basic weather info
var weatherPic      = document.querySelector("#weatherPic"),
    temp            = document.querySelector("#temp"),
    feelsLike       = document.querySelector("#feelsLike"),
    precip          = document.querySelector("#precip"),
    humidity        = document.querySelector("#humid"),
    wind            = document.querySelector("#wind"),
    currentWeather  = document.querySelector("#currentWeather");

// Selecting the elements for the extended weather info
var btn         = document.querySelector("#btn"),
    eGridCont   = document.querySelector(".eGrid-container"),
    eTemp       = document.querySelector(".eTemp"),
    ePrecip1Hr  = document.querySelector(".ePrecip1Hr"),
    ePressure   = document.querySelector(".ePressure"),
    eWind       = document.querySelector(".eWind"),
    eVis        = document.querySelector(".eVis"),
    eWFooter    = document.querySelector(".eWFooter");

// ============================================
// Google Maps - Radar Map
// ============================================

var geocoder;
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: lati, lng: long},
    gestureHandling: 'none',
    zoomControl: false,
    mapTypeControlOptions: {
      mapTypeIds: []
    }
  });
  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;
  geocodeLatLng(geocoder, map, infowindow);
}

function geocodeLatLng(geocoder, map, infowindow) {
  var latiLong = lati + "," + long;
  var latlngStr = latiLong.split(',', 2);
  var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        loc.innerText = results[0].formatted_address;
      } else {
        window.alert('No results found');
      }
    }
  });
}

// var wURadarLayer = document.querySelector("#wURadarLayer");
// wURadarLayer.setAttribute("src", "http://api.wunderground.com/api/b47388355b8e168a/animatedradar/animatedsatellite/image.gif?num=8&delay=50&rad.maxlat=51.47&rad.maxlon=-2.61&rad.minlat=31.596&rad.minlon=-97.388&rad.width=640&rad.height=480&rad.rainsnow=1&rad.reproj.automerc=1&rad.num=5&sat.maxlat=47.709&sat.maxlon=-69.263&sat.minlat=31.596&sat.minlon=-97.388&sat.width=640&sat.height=480&sat.key=sat_ir4_bottom&sat.gtt=107&sat.proj=me&sat.timelabel=0&sat.num=5");

// =====================================================================================
// WEATHER API - DATA STORING
// =====================================================================================

var tempC,
    dewPointC,
    feelsLikeC,
    // iconDesc    = data.icon, 
    // iconUrl     = data.icon_url,
    wUBrandImg,
    timeStamp,
    precip1Hr,
    precipToday,
    pressureIn,
    pressureMb,
    relHumidity,
    stationId,
    visKm,
    visMi,
    weatherCon,
    windDegrees,
    windDir,
    windGustKm,
    windGustMi,
    windKph,
    windMph;

function weatherApp() {
  var xmlhttp = new XMLHttpRequest();
  var url = "https://api.wunderground.com/api/b47388355b8e168a/conditions/q/" + lati + "," + long + ".json";
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var myArr = JSON.parse(this.responseText);
      var data = myArr.current_observation;
      // ============================================
      // Storing weather data
      // ============================================
      tempC       = data.temp_c; //main
      dewPointC   = data.dewpoint_c; //temp
      feelsLikeC  = data.feelslike_c; //main
      // iconDesc    = data.icon, 
      // iconUrl     = data.icon_url,
      wUBrandImg  = data.image.url; //footer
      timeStamp   = data.observation_time_rfc822; //footer
      precip1Hr   = data.precip_1hr_string; //precip
      precipToday = data.precip_today_string; //main
      pressureIn  = data.pressure_in; //pressure
      pressureMb  = data.pressure_mb; //pressure
      relHumidity = data.relative_humidity; //main
      stationId   = data.station_id; //footer
      visKm       = data.visibility_km; //vis
      visMi       = data.visibility_mi; //vis
      weatherCon  = data.weather; //main
      windDegrees = data.wind_degrees; //wind
      windDir     = data.wind_dir; //wind
      windGustKm  = data.wind_gust_kph; //wind
      windGustMi  = data.wind_gust_mph; //wind
      windKph     = data.wind_kph; //main
      windMph     = data.wind_mph; //main

      // ============================================
      // Basic weather data
      // ============================================
      temp.innerText = tempC;
      precip.innerText = precipToday;
      humidity.innerText = relHumidity;
      wind.innerText = windKph;
      feelsLike.innerText = Math.round(feelsLikeC);
      weatherPic.setAttribute("src", "assets/weatherSvgs/animated/" + weatherCon.toLowerCase().replace(/ /g, '') + ".svg");
      currentWeather.innerText = weatherCon;
      
      // ============================================
      // Extended weather data
      // ============================================
      eTemp.innerText = dewPointC;
      ePrecip1Hr.innerText = precip1Hr;
      ePressure.innerText = pressureMb;
      eWind.innerText = windDir + windGustKm;
      eVis.innerText = visKm;
      // eWFooter.innerText = stationId + wUBrandImg;

      btn.onclick = function () {
        $(eGridCont).toggleClass("hideMoreInfo");
      }
    }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  // geoCoding();
}

// =====================================================================================
// City Search
// =====================================================================================

// var searchedCity;

// $("input[type='text']").keypress(function(enterPressed){
//   if(enterPressed.which === 13) {
//     searchedCity = $(this).val();
//     $(this).value("");
//   }
// });

// ============================================
// Unit system (C - F / Km - Mi)
// ============================================

var unitC = document.querySelector("#unitC"),
    unitF = document.querySelector("#unitF"),
    unitTemp = document.querySelectorAll(".unitTemp");

unitF.addEventListener('click', function(){
  unitF.classList.add("unitBtn");
  unitC.classList.remove("unitBtn");
  for(var i = 0; i < unitTemp.length; i++) {
    unitTemp[i].innerText = "F";
  }
  temp.innerText = Math.round(tempC * 1.8 + 32);
  eTemp.innerText = Math.round(dewPointC * 1.8 + 32);
  feelsLike.innerText = Math.round(feelsLikeC * 1.8 + 32);
});

unitC.addEventListener('click', function(){
  unitC.classList.add("unitBtn");
  unitF.classList.remove("unitBtn");
  for(var i = 0; i < unitTemp.length; i++) {
    unitTemp[i].innerText = "C";
  }
  temp.innerText = tempC;
  eTemp.innerText = dewPointC;
  feelsLike.innerText = Math.round(feelsLikeC);
});