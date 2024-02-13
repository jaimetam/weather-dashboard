// Function to save searched city to local storage
function saveToLocalStorage(city) {
    let pastSearches = JSON.parse(localStorage.getItem('pastSearches')) || [];
    pastSearches.unshift({ city });
    localStorage.setItem('pastSearches', JSON.stringify(pastSearches));
    displayPastSearches();
}

// Function to load past searches from local storage
function loadPastSearches() {
    const pastSearches = JSON.parse(localStorage.getItem('pastSearches')) || [];
    displayPastSearches();
}

// Function to display past searches in the language-buttons card
function displayPastSearches() {
    const languageButtons = document.getElementById('language-buttons');
    const pastSearches = JSON.parse(localStorage.getItem('pastSearches')) || [];

    // Clear previous buttons
    languageButtons.innerHTML = '';

    // Display past searches
    pastSearches.forEach(search => {
        const button = document.createElement('button');
        button.textContent = search.city;
        button.addEventListener('click', function () {
            getWeatherData(search.city);
        });
        languageButtons.appendChild(button);
    });
}

// Function to fetch weather data for a city using the One Call API
function getWeatherData(cityName) {
    const apiKey = '77494bc7d41b39456fa5004385a2e67a9';
    const weatherCard = document.getElementById('weather-card-body');

    // First, get the coordinates (latitude and longitude) for the given city
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const lat = data.coord.lat;
            const lon = data.coord.lon;
console.log(lat)
console.log(lon)
            // Use the coordinates to fetch the weather data using the One Call API
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    // Log the received data to inspect its structure
                    console.log('Received weather data:', data);

                    // Process the retrieved data and update the UI
                    displayWeatherData(cityName, data);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
        });
}

// Function to display weather data
function displayWeatherData(cityName, weatherData) {
    const weatherCard = document.getElementById('weather-card-body');

    // Display current day weather
    weatherCard.innerHTML = `
        <p>City: ${cityName}</p>
        <p>Current Temperature: ${weatherData.current.temp}°C</p>
        <p>Current Humidity: ${weatherData.current.humidity}%</p>
        <p>Current Wind Speed: ${weatherData.current.wind_speed} m/s</p>
    `;

    // Display next 4 days forecast
    for (let i = 1; i <= 4; i++) {
        const date = new Date(weatherData.daily[i].dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });

        weatherCard.innerHTML += `
            <p>${day}: ${weatherData.daily[i].temp.day}°C, Humidity: ${weatherData.daily[i].humidity}%, Wind Speed: ${weatherData.daily[i].wind_speed} m/s</p>
        `;
    }
}


// Add an event listener to the form for handling city searches
document.getElementById('user-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const cityName = document.getElementById('username').value.trim();

    if (cityName !== '') {
        // Save the searched city to local storage
        saveToLocalStorage(cityName);

        // Fetch weather data for the searched city
        getWeatherData(cityName);

        // Clear the input field
        document.getElementById('username').value = '';
    }
});

// Load past searches when the page loads
loadPastSearches();
