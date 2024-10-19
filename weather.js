(() => {
  require('dotenv').config();
  //Weather app
  const api = {
    key: process.env.OPEN_WEATHER_API_KEY,
    base: 'https://api.openweathermap.org/data/3.0/onecall',
  };

  const searchbox = document.querySelector('.search-box');
  searchbox.addEventListener('keypress', setQuery);

  function setQuery(evt) {
    if (evt.key === 'Enter') {
      getCoordinates(searchbox.value);
      searchbox.value = '';
    }
  }

  function getCoordinates(city) {
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api.key}`
    )
      .then((response) => response.json())
      .then((data) => {
        const { lat, lon } = data.coord;
        getResults(lat, lon);
      });
  }

  function getResults(lat, lon) {
    fetch(`${api.base}?lat=${lat}&lon=${lon}&units=metric&appid=${api.key}`)
      .then((response) => response.json())
      .then(displayResults);
  }

  function displayResults(weather) {
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.timezone}`;

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.current.temp)}<span>°C</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText =
      weather.current.weather[0].description.charAt(0).toUpperCase() +
      weather.current.weather[0].description.slice(1);

    let hilow = document.querySelector('.current .hi-low');
    hilow.innerText = `${Math.round(
      weather.daily[0].temp.min
    )}°C / ${Math.round(weather.daily[0].temp.max)}°C`;

    let wind = document.querySelector('.current .wind');
    wind.innerText = `Wind: ${weather.current.wind_speed} km/h`;

    let humidity = document.querySelector('.current .humidity');
    humidity.innerText = `Humidity: ${weather.current.humidity}%`;

    let visibility = document.querySelector('.current .visibility');
    visibility.innerText = `Visibility: ${weather.current.visibility} m`;
  }

  function dateBuilder(d) {
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  }
})();
