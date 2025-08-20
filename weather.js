(() => {
  //Weather app for GitHub Pages
  const api = {
    key: null,
    base: 'https://api.openweathermap.org/data/2.5/weather',
  };

  // Check for stored API key or prompt user
  function initializeApp() {
    const storedApiKey = localStorage.getItem('openweather-api-key');

    if (!storedApiKey) {
      const userApiKey = prompt(
        'Welcome to Weather App!\n\n' +
          'To use this app, you need a free API key from OpenWeatherMap.\n' +
          '1. Visit: https://openweathermap.org/api\n' +
          '2. Sign up for free\n' +
          '3. Get your API key\n\n' +
          'Enter your API key:'
      );

      if (userApiKey && userApiKey.trim()) {
        localStorage.setItem('openweather-api-key', userApiKey.trim());
        api.key = userApiKey.trim();
      } else {
        alert('API key is required to use this weather app.');
        return;
      }
    } else {
      api.key = storedApiKey;
    }

    // Add a reset button to allow users to change their API key
    addResetButton();
  }

  function addResetButton() {
    const resetBtn = document.createElement('button');
    resetBtn.innerHTML = '🔑 Change API Key';
    resetBtn.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      padding: 8px 12px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 12px;
      z-index: 1000;
    `;

    resetBtn.addEventListener('click', () => {
      localStorage.removeItem('openweather-api-key');
      location.reload();
    });

    document.body.appendChild(resetBtn);
  }

  // Initialize the app when page loads
  document.addEventListener('DOMContentLoaded', initializeApp);

  const searchbox = document.querySelector('.search-box');
  searchbox.addEventListener('keypress', setQuery);

  function setQuery(evt) {
    if (evt.key === 'Enter') {
      getCoordinates(searchbox.value);
      searchbox.value = '';
    }
  }

  function getCoordinates(city) {
    if (!api.key) {
      alert('Please refresh the page and enter your API key.');
      return;
    }

    // Use the current weather API directly with city name instead of geocoding
    fetch(`${api.base}?q=${city}&units=metric&appid=${api.key}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Weather response:', data);
        displayResults(data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
      });
  }

  function displayResults(weather) {
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText =
      weather.weather[0].description.charAt(0).toUpperCase() +
      weather.weather[0].description.slice(1);

    let hilow = document.querySelector('.current .hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°C / ${Math.round(
      weather.main.temp_max
    )}°C`;

    let wind = document.querySelector('.current .wind');
    wind.innerText = `Wind: ${weather.wind.speed} m/s`;

    let humidity = document.querySelector('.current .humidity');
    humidity.innerText = `Humidity: ${weather.main.humidity}%`;

    let visibility = document.querySelector('.current .visibility');
    visibility.innerText = `Visibility: ${weather.visibility} m`;
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
