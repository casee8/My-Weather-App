var loc    = document.querySelector("#location"),
    weatherpic  = document.querySelector("#weatherPic"),
    temp        = document.querySelector("#temp"),
    precip      = document.querySelector("#precip"),
    humidity    = document.querySelector("#humid"),
    wind        = document.querySelector("#wind");

// =====================================================================================
// GETTING THE USER'S LOCATION
// =====================================================================================

var lat;
var lon;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
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
      var tempC       = data.temp_c,
          tempF       = data.temp_f,
          dewPointC   = data.dewpoint_c,
          dewPointF   = data.dewpoint_f,
          feelsLikeC  = data.feelslike_c,
          feelsLikeF  = data.feelslike_f,
          iconDesc    = data.icon,
          iconUrl     = data.icon_url,
          wUBrandImg  = data.image.url,
          timeStamp   = data.observation_time_rfc822,
          precip1Hr   = data.precip_1hr_string,
          precipToday = data.precip_today_string,
          pressureIn  = data.pressure_in,
          pressureMb  = data.pressure_mb,
          relHumidity = data.relative_humidity,
          stationId   = data.station_id,
          visKm       = data.visibility_km,
          visMi       = data.visibility_mi,
          weatherCon  = data.weather,
          windDegrees = data.wind_degrees,
          windDir     = data.wind_dir,
          windGustKm  = data.wind_gust_kph,
          windGustMi  = data.wind_gust_mph,
          windKph     = data.wind_kph,
          windMph     = data.wind_mph;

      // ============================================
      // ShowTime
      // ============================================
      temp.innerText = tempC;
      precip.innerText = precipToday;
      humidity.innerText = relHumidity;
      wind.innerText = windKph;

      button.onclick = function () {
        $(moreInfo).toggleClass("hideMoreInfo");
      }
    }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  geoCoding();
}