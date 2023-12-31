let date = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let currentDay = days[date.getDay()];
let currentMonth = months[date.getMonth()];
let currentDate = date.getDate();
let currentYear = date.getFullYear();
let currentHour = date.getHours();
let currentMinute = date.getMinutes();
let amPm = currentHour >= 12 ? "PM" : "AM";
currentHour = currentHour % 12 || 12;
if (currentMinute < 10) {
  currentMinute = `0${currentMinute}`;
}

let now = document.querySelector("#now");
now.innerHTML = `${currentDay}, ${currentMonth} ${currentDate}, ${currentYear} ${currentHour}:${currentMinute} ${amPm}`;

// search for country & geolocation/weather api
function showTemperature(response) {
  let iconElement = document.querySelector("#current-icon");

  farenheitTemperature = response.data.main.temp;

  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#current-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  getForecast(response.data.coord);
}

function changeCity(city) {
  let apiKey = "be81f193e065bf5feb2d944c7336968b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?&q=${city}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(showTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-city").value;
  changeCity(city);
}

function getLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "be81f193e065bf5feb2d944c7336968b";
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?&q=${city}&lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}
function showCurrentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "be81f193e065bf5feb2d944c7336968b";
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?&q&lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
}

let form = document.querySelector("form");
form.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

// forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];
  return days[day];
}

function createForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let days = ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];
  let forecastHTML = `<div class="row justify-content-center">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <img id="future-icon" src="https://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }.png" width=50px alt="" />
        </br>
        <strong>${formatDay(forecastDay.dt)}</strong>
        </br> <span id="low-temp" class="high-temp">${Math.round(
          forecastDay.temp.max
        )}°</span>
        <span id="low-temp" class="low-temp">| ${Math.round(
          forecastDay.temp.min
        )}°</span>
      </div>
`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "be81f193e065bf5feb2d944c7336968b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  console.log(apiUrl);
  axios.get(apiUrl).then(createForecast);
}
//unit conversion
function convertToCelsius(event) {
  event.preventDefault();
  let celsiusTemperature = ((farenheitTemperature - 32) * 5) / 9;
  let temperatureElement = document.querySelector("#current-temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  celsiusLink.classList.add("active");
  farenheitLink.classList.remove("active");
}

function convertToFarenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temp");
  celsiusLink.classList.remove("active");
  farenheitLink.classList.add("active");

  temperatureElement.innerHTML = Math.round(farenheitTemperature);
}
let farenheitTemperature = null;

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

let farenheitLink = document.querySelector("#farenheit-link");
farenheitLink.addEventListener("click", convertToFarenheit);

changeCity("Boston");
