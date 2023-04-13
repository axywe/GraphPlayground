const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const cityTable = document.getElementById('cityTable').querySelector('tbody');

let cities = [];
let running = false;

canvas.addEventListener('click', (event) => {
    if (running) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        cities.push({ x, y });
        updateCityTable();
        drawCities();
    }
});

function euclideanDistance(city1, city2) {
    const dx = city1.x - city2.x;
    const dy = city1.y - city2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function nearestNeighbor(currentCity, cities, visited) {
    let nearestCity = -1;
    let minDistance = Infinity;

    for (let i = 0; i < cities.length; ++i) {
        if (i !== currentCity && !visited[i]) {
            const distance = euclideanDistance(cities[currentCity], cities[i]);
            if (distance < minDistance) {
                minDistance = distance;
                nearestCity = i;
            }
        }
    }

    return nearestCity;
}

function greedyTSP(cities) {
    const tour = [0];
    const visited = new Array(cities.length).fill(false);
    visited[0] = true;

    let currentCity = 0;
    for (let i = 1; i < cities.length; ++i) {
        const nextCity = nearestNeighbor(currentCity, cities, visited);
        visited[nextCity] = true;
        tour.push(nextCity);
        currentCity = nextCity;
    }

    return tour;
}

function drawCities() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const city of cities) {
        ctx.beginPath();
        ctx.arc(city.x, city.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
    }
}

function updateCityTable() {
    cityTable.innerHTML = '';
    cities.forEach((city, index) => {
        const row = cityTable.insertRow();
        const cityCell = row.insertCell();
        const xCell = row.insertCell();
        const yCell = row.insertCell();

        cityCell.textContent = `City ${index}`;
        xCell.textContent = city.x.toFixed(0);
        yCell.textContent = city.y.toFixed(0);

        xCell.contentEditable = true;
        yCell.contentEditable = true;

        xCell.addEventListener('input', (event) => {
            const value = parseInt(event.target.textContent);
            if (!isNaN(value)) {
                cities[index].x = value;
                drawCities();
            }
        });

        yCell.addEventListener('input', (event) => {
            const value = parseInt(event.target.textContent);
            if (!isNaN(value)) {
                cities[index].y = value;
                drawCities();
            }
        });
    });
}
function drawTour(tour) {
    drawCities();

    ctx.beginPath();
    ctx.moveTo(cities[tour[0]].x, cities[tour[0]].y);

    for (let i = 1; i < tour.length; ++i) {
        const city = cities[tour[i]];
        ctx.lineTo(city.x, city.y);
    }

    ctx.lineTo(cities[tour[0]].x, cities[tour[0]].y);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
}

startButton.addEventListener('click', () => {
    if (running || cities.length < 2) return;
    running = true;

    const tour = greedyTSP(cities);
    drawTour(tour);

    running = false;
});

resetButton.addEventListener('click', () => {
    if (running) return;
    cities = [];
    updateCityTable();
    drawCities();
});