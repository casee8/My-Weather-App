// Selecting the elements for the basic weather info
var loc         = document.querySelector("#location"),
    weatherPic  = document.querySelector("#weatherPic"),
    temp        = document.querySelector("#temp"),
    feelsLike   = document.querySelector("#feelsLike"),
    precip      = document.querySelector("#precip"),
    humidity    = document.querySelector("#humid"),
    wind        = document.querySelector("#wind");

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

var lat;
var lon;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    showError("Geolocation is not supported by this browser!");
  };
  showPosition();
}

function showPosition(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  weatherApp();
}

function geoCoding() {
  var xmlhttp = new XMLHttpRequest();
  var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&key=AIzaSyDAHgPXl5edvHYkxvsNb8YMvVdNHZfF0io";
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

// =====================================================================================
// WEATHER API - DATA STORING
// =====================================================================================

function weatherApp() {
  var xmlhttp = new XMLHttpRequest();
  var url = "https://api.wunderground.com/api/b47388355b8e168a/conditions/q/" + lat + "," + lon + ".json";
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
      feelsLike.innerText = feelsLikeC;
      weatherPic.setAttribute("src", "assets/media/node_modules/weather-underground-icons/dist/icons/white/png/64x64/" + weatherCon.toLowerCase().replace(/ /g, '') + ".png");
      
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