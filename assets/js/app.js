var locationName = document.getElementsByClassName("locationName")[0];
var description = document.querySelector(".description");
var temperat = document.getElementById("temperat");
var tempToggle = $(".tempToggle")[0];
var img = document.querySelector("img");
var lat;
var lon;
// More Info staff
var button = document.querySelector("a"),
  moreInfo = document.querySelector(".moreInfo"),
  tempMinPlace = document.querySelector("#tempMin"),
  tempMaxPlace = document.querySelector("#tempMax"),
  humidityPlace = document.querySelector("#humidity"),
  pressurePlace = document.querySelector("#pressure"),
  windSpeedPlace = document.querySelector("#windSpeed");

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

function weatherApp() {
  var xmlhttp = new XMLHttpRequest();
  var url = "http://api.wunderground.com/api/b47388355b8e168a/conditions/" + lat + "," + lon + ".json";
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var myArr = JSON.parse(this.responseText);
      console.log(myArr);
      var temperature = myArr.main.temp;
      var weatherCondition = myArr.weather[0].description;
      var icon = myArr.weather[0].icon;

      //        MORE INFO
      var tempMin = myArr.main.temp_min,
        tempMax = myArr.main.temp_max,
        humidity = myArr.main.humidity,
        pressure = myArr.main.pressure,
        windSpeed = myArr.wind.speed;

      temperat.innerText = Math.round(temperature);
      description.innerText = weatherCondition;
      img.setAttribute("src", icon);
      tempToggle.onclick = function () {
        if (tempToggle.innerText == "C") {
          tempToggle.innerText = "F";
          temperat.innerText = Math.round(temperature * (9 / 5) + 32);
        } else {
          tempToggle.innerText = "C";
          temperat.innerText = Math.round(temperature);
        }
      }

      tempMinPlace.innerHTML = "Minimum temperature: " + tempMin + " °<span class='tempToggle'>C</span>";
      tempMaxPlace.innerHTML = "Maximum temperature: " + tempMax + " °<span class='tempToggle'>C</span>";
      humidityPlace.innerText = "Humidity: " + humidity + " %";
      pressurePlace.innerText = "Pressure: " + pressure + " mBar";
      windSpeedPlace.innerText = "Wind: " + windSpeed + " km/h";

      button.onclick = function () {
        $(moreInfo).toggleClass("hideMoreInfo");
      }
    }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  geoCoding();
}

function geoCoding() {
  var xmlhttp = new XMLHttpRequest();
  var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&key=AIzaSyDAHgPXl5edvHYkxvsNb8YMvVdNHZfF0io";
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var mySecArr = JSON.parse(this.responseText);
      var nearLocation = mySecArr.results[4].formatted_address;
      locationName.innerHTML = "<h2>" + nearLocation + "</h2>";
    }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}