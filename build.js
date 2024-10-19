const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Read the weather.js file
let weatherJs = fs.readFileSync('weather.js', 'utf8');

// Replace the placeholder with the actual API key
weatherJs = weatherJs.replace(
  'process.env.OPEN_WEATHER_API_KEY',
  `"${process.env.OPEN_WEATHER_API_KEY}"`
);

// Write the modified content back to weather.js
fs.writeFileSync('weather.js', weatherJs);

console.log('Build completed successfully.');
