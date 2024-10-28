//TODO: finish this function to get locality depending on cord pair stored as an array
async function getLocality(Coordinates){
    const localities = [];
    for(const [latitude, longitude] of Coordinates){
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`); //use backticks for correct string interpolation
        const data = await response.json();   

        // Extract the locality field from the response
        const locality = data.locality || "Locality not found"; // fallback if locality is unavailable
        localities.push({ latitude, longitude, locality });
    }
    return localities;
}

async function createMap() {
    // Generate the map
    var map = L.map('map').setView([38.7946, -106.5348], 4);

    // Set up tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Generate coordinates
    const coordinates = [];
    for (let i = 0; i < 3; i++) {
        coordinates.push(generateCords());
    }

    // Fetch localities for each coordinate
    const localities = await getLocality(coordinates);
    console.log(localities);

    // Create markers and display locality data in HTML
    localities.forEach((location, index) => {
        const { latitude, longitude, locality } = location;

        // Add marker to the map
        const marker = L.marker([latitude, longitude]).addTo(map);

        // Select corresponding HTML element and update content
        const markerElement = document.getElementById(`marker-${index + 1}`);
        if (markerElement) {
            markerElement.innerHTML = `
                <h3>Marker ${index + 1}: Latitude: ${latitude}, Longitude: ${longitude}</h3>
                <b><p>Locality: ${locality}</p></b>
            `;
        }
    });
}

// Generate Map
window.onload = createMap();

// Function to generate random geographical cords
function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
    }

// Function to store cords as an array pair
function generateCords(){
    var cords = [];

    // Latitude Coordinates: getRandomInRange(30, 35, 3);
    var latitude = getRandomInRange(30, 35, 3);

    // Longitude Coordinates: getRandomInRange(-90, -100, 3);
    var longitude = getRandomInRange(-90, -100, 3);
    cords.push(latitude);
    cords.push(longitude);

    return cords;
}

