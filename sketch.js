const historicalApiURL = 'https://covid19.mathdro.id/api/daily';
let data;
let totalRecovered;
let deaths, confirmed, recovered;
let dayCount;
let deathCases, confirmedCases, recoveredCases;

function setup() {

    // set up canvas & DOM elements
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    canvas.style('opacity', '0.5');

    // get new data every day
    getData();
    setInterval(getData, 86400000);

    // initialize case groups
    deathCases = [];
    confirmedCases = [];

    // increment days 
    dayCount = 0;
    setInterval(tickDay, 1000);
}

function draw() {

    // display confirmed cases
    for(let i = 0; i < confirmedCases.length; i++) {
        confirmedCases[i].update();
        confirmedCases[i].show();
    }

    // display death cases
    for(let i = 0; i < deathCases.length; i++) {
        deathCases[i].update();
        deathCases[i].show();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

async function getData() {

    // make API request
    const response = await fetch(historicalApiURL);
    const responseJSON = await response.json();
    data = responseJSON;
}

function tickDay() {

    // continue to next day
    if (dayCount < data.length) {
        deaths = round(data[dayCount].deaths.total / 1000);
        confirmed = round((data[dayCount].confirmed.total / 1000) - deaths);

        // update confirmed cases
        newConfirmed = confirmed - confirmedCases.length;
        if (newConfirmed > 0) {
            for (let i = 0; i < newConfirmed; i++) {
                confirmedCases.push(new Case('confirmed'));
            }
        } else if (newConfirmed < 0) {
            for (let i = 0; i < newConfirmed; i++) {
                confirmedCases.pop();
            }
        }

        // update death cases 
        newDeaths = deaths - deathCases.length;
        if (newDeaths > 0) {
            for (let i = 0; i < newDeaths; i++) {
                deathCases.push(new Case('death'));
            }
        } else if (newDeaths < 0) {
            for (let i = 0; i < newDeaths; i++) {
                deathCases.pop();
            }
        }

    // reset to day 0
    } else {
        dayCount = 0;
        confirmedCases = [];
        deathCases = [];
        clear();
    }

    // display date 
    document.getElementById('date').textContent = data[dayCount].reportDate;

    // display counts
    document.getElementById('cases').textContent = data[dayCount].confirmed.total;
    document.getElementById('deaths').textContent = data[dayCount].deaths.total;

    dayCount++;
}

// corona class
class Case {

    constructor(type) {

        // set color
        if (type == 'death')
            this.color = color('black');
        else if (type == 'confirmed')
            this.color = color('red');

        // set size
        if (windowWidth < 600)
            this.size = 10;
        else 
            this.size = 20;

        this.type = type;
        this.x = random(0 + width / 10, width - width / 10);
        this.y = random(0 + height / 10, height - height / 10);
    }

    update() {

        // set random direction
        let stepx = int (random(3)) - 1;
        let stepy = int (random(3)) - 1;

        this.x += stepx * 3;
        this.y += stepy * 3;
    }

    show() {

        // display using points
        if (this.type == 'death')
            strokeWeight(3);
        else
            strokeWeight(2);

        stroke(this.color);
        point(this.x, this.y);
    }
}


