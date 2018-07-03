var loc = document.querySelector("#location");

var lati = 0;
var long = 0;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    showError("Geolocation is not supported by this browser!");
  };
}

function showPosition(position) {
  lati = position.coords.latitude;
  long = position.coords.longitude;
  weatherApp();
  initMap();
}