// Selecting the elements for the basic weather info
var loc             = document.querySelector("#location"),
    weatherPic      = document.querySelector("#weatherPic"),
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

//=====================================================================================
// GETTING THE USER'S LOCATION
// ====================================================================================

var lati;
var long;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    showError("Geolocation is not supported by this browser!");
  };
  showPosition();
}

function showPosition(position) {
  lati = position.coords.latitude;
  long = position.coords.longitude;
  weatherApp();
  initMap();
}

function geoCoding() {
  var xmlhttp = new XMLHttpRequest();
  var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lati + "," + long + "&key=AIzaSyDAHgPXl5edvHYkxvsNb8YMvVdNHZfF0io";
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var mySecArr = JSON.parse(this.responseText);
      var nearLocation = mySecArr.results[4].formatted_address;
      loc.innerText = nearLocation;
    }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

// ============================================
// Google Maps - Radar Map
// ============================================

// Initialize and add the map
var marker;

function initMap() {
  // The location of "radarLoc"
  var radarLoc = {lat: lati, lng: long};
  // The map, centered at "radarLoc"
  var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: radarLoc,
        gestureHandling: 'none',
        zoomControl: false
      });
  // The marker, positioned at radarLoc
    marker = new google.maps.Marker({
    position: radarLoc,
    map: map,
    animation: google.maps.Animation.DROP
  });
  marker.addListener('click', toggleBounce);
}

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

// =====================================================================================
// WEATHER API - DATA STORING
// =====================================================================================

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
      var tempC       = data.temp_c, //main
          tempF       = data.temp_f, //main
          dewPointC   = data.dewpoint_c, //temp
          dewPointF   = data.dewpoint_f, //temp
          feelsLikeC  = data.feelslike_c, //main
          feelsLikeF  = data.feelslike_f, //main
          // iconDesc    = data.icon, 
          // iconUrl     = data.icon_url,
          wUBrandImg  = data.image.url, //footer
          timeStamp   = data.observation_time_rfc822, //footer
          precip1Hr   = data.precip_1hr_string, //precip
          precipToday = data.precip_today_string, //main
          pressureIn  = data.pressure_in, //pressure
          pressureMb  = data.pressure_mb, //pressure
          relHumidity = data.relative_humidity, //main
          stationId   = data.station_id, //footer
          visKm       = data.visibility_km, //vis
          visMi       = data.visibility_mi, //vis
          weatherCon  = data.weather, //main
          windDegrees = data.wind_degrees, //wind
          windDir     = data.wind_dir, //wind
          windGustKm  = data.wind_gust_kph, //wind
          windGustMi  = data.wind_gust_mph, //wind
          windKph     = data.wind_kph, //main
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
  geoCoding();
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

var unitTemp = document.getElementsByClassName("unitTemp");
console.log(unitTemp);