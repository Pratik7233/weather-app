const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');
const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');
const forecastContainer = document.getElementById('forecast-container');

const api_key = "19bc67d14ef260b094fd3891b9cf2f63";

async function checkWeather(city) {
  const weather_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;
  const forecast_url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}`;

  try {
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    if (weather_data.cod === '404') {
      location_not_found.style.display = "flex";
      weather_body.style.display = "none";
      forecastContainer.innerHTML = "";
      return;
    }

    location_not_found.style.display = "none";
    weather_body.style.display = "flex";

    temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}°C`;
    description.innerHTML = weather_data.weather[0].description;
    humidity.innerHTML = `${weather_data.main.humidity}%`;
    wind_speed.innerHTML = `${weather_data.wind.speed} Km/H`;

    switch (weather_data.weather[0].main) {
      case 'Clouds':
        weather_img.src = "/src/assets/cloud.png";
        break;
      case 'Clear':
        weather_img.src = "/src/assets/clear.png";
        break;
      case 'Rain':
        weather_img.src = "/src/assets/rain.png";
        break;
      case 'Mist':
        weather_img.src = "/src/assets/mist.png";
        break;
      case 'Snow':
        weather_img.src = "/src/assets/snow.png";
        break;
      default:
        weather_img.src = "/src/assets/default.png";
    }

    const forecast_response = await fetch(forecast_url);
    const forecast_data = await forecast_response.json();
    updateForecast(forecast_data.list);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function updateForecast(forecastList) {
  forecastContainer.innerHTML = "";
  for (let i = 0; i < forecastList.length; i += 8) {
    const day = forecastList[i];
    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <p>${new Date(day.dt * 1000).toLocaleDateString()}</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
      <p>${Math.round(day.main.temp - 273.15)}°C</p>
      <p>${day.weather[0].description}</p>
    `;
    forecastContainer.appendChild(card);
  }
}

searchBtn.addEventListener('click', () => {
  const city = inputBox.value.trim();
  if (city) {
    checkWeather(city);
  } else {
    alert("Please enter a location.");
  }
});