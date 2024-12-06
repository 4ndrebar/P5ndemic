let agents = [];
let numAgents = 600;
let infectionRadius = 5;
let averageInfectionDuration = 300; // Frames before recovery plus Poissonian deviation
let slider;
let altro;
let initialInfectedPercentage = .1;
let max_lethality = 0.9;
let max_v=5;
let lethalityPerFrame ;// Probability to die while sick
let data = {
  healthy: [],
  infected: [],
  recovered: [],
  immune: [],
  deceased: [],
};
let graphHeight = 100;
let restartButton;

function setup() {
  createCanvas(800, 600);
  initializeSimulation();
  slider = createSlider(0,max_v,.5,.01);
  altro = createSlider(0,max_lethality,0.5,0.01);
  slider.position(80,10);
  altro.position(80,40);
  slider.size(100);
  altro.size(100);
  // Create the restart button (hidden initially)
  restartButton = createButton("Restart Simulation");
  restartButton.position(width / 2 - 50, height / 2);
  restartButton.style("font-size", "16px");
  restartButton.style("padding", "10px 20px");
  restartButton.hide();
  restartButton.mousePressed(() => {
    initializeSimulation(); // Reset simulation variables
    restartButton.hide(); // Hide the button again
    loop(); // Restart the simulation
  });
}

function initializeSimulation() {
  agents = [];
  data = { healthy: [], infected: [], recovered: [], immune: [], deceased: [] };

  // Initialize agents
  for (let i = 0; i < numAgents; i++) {
    let state = random() < initialInfectedPercentage ? "infected" : "healthy"; // 2% chance of starting infected
    agents.push(new Agent(random(width), random(height), state));
  }
}

function displaySlidersLabels(){
  fill(255); // Set text color to black
  stroke(0);
  strokeWeight(4);
  textSize(14);
  textStyle(BOLD)
  text('Velocity:', 10, slider.y +15);
  text('Lethality:', 10, altro.y + 15);
}

function draw() {
  background(240);

  // Update and display agents
  for (let agent of agents) {
    agent.update();
    agent.display();
  }

  displaySlidersLabels()


  // Update population data
  updateData();

  // Draw graph
  drawGraph();

  // Stop simulation and show the restart button if no infected agents remain
  if (data.infected[data.infected.length - 1] === 0) {
    noLoop();
    restartButton.show();
  }
}

// Class for each agent
class Agent {
  constructor(x, y, state) {
    this.vx = random(-1,1);
    this.vy =random(-1,1);
    this.x = x;
    this.y = y;
    this.state = state; // "healthy", "infected", "recovered", "immune", "deceased"
    this.infectionTimer = 0; // How long agent has been infected
  }

  update() {
    if (this.state === "deceased") return; // Deceased agents don't move or infect others
    if (this.x===0 ||this.x===width){
      this.vx*=-1;
    }
    if (this.y===0 ||this.y===height){
      this.vy*=-1;
    }
    let mobility = slider.value();
    let lethality = altro.value() 
    let  lethalityPerFrame= 1 - Math.pow(1 - lethality, 1 / averageInfectionDuration)
    this.x += mobility*this.vx+random(-.5, .5);
    this.y += mobility*this.vy+random(-.5, .5);
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);

    if (this.state === "infected") {
      this.infectionTimer++;
      if (random() < lethalityPerFrame) {
        this.state = "deceased";
        return;
      }

      // Recover after infectionDuration + Poissonian deviation
      if (this.infectionTimer > averageInfectionDuration + random(0, Math.sqrt(averageInfectionDuration))) {
        this.state = "recovered";
      }
    }

    // Infection logic
    if (this.state === "infected") {
      for (let other of agents) {
        if (other.state === "healthy") {
          let d = dist(this.x, this.y, other.x, other.y);
          if (d < infectionRadius) {
            other.state = "infected";
          }
        }
      }
    }
  }

  display() {
    noStroke();
    if (this.state === "healthy") fill(0, 125, 0); // Green
    else if (this.state === "infected") fill(255, 0, 0); // Red
    else if (this.state === "recovered") fill(0, 0, 255); // Blue
    else if (this.state === "immune") fill(255, 255, 0); // Yellow
    else if (this.state === "deceased") fill(0); // Black
    ellipse(this.x, this.y, infectionRadius, infectionRadius);
  }
}

function updateData() {
  let counts = {
    healthy: 0,
    infected: 0,
    recovered: 0,
    immune: 0,
    deceased: 0,
  };

  for (let agent of agents) {
    counts[agent.state]++;
  }

  data.healthy.push(counts.healthy);
  data.infected.push(counts.infected);
  data.recovered.push(counts.recovered);
  data.immune.push(counts.immune);
  data.deceased.push(counts.deceased);
}

function drawGraph() {
  let graphX = 50;
  let graphY = height - 150;

  // Draw graph background
  fill(255);
  stroke(0);
  strokeWeight(2)
  rect(graphX, graphY, width - 100, graphHeight);

  // Plot data
  noFill();
  strokeWeight(2);
  let colors = {
    healthy: color(0, 255, 0),
    infected: color(255, 0, 0),
    recovered: color(0, 0, 255),
    immune: color(255, 255, 0,0), //transparent, not yet implemented
    deceased: color(0),
  };

  let totalSteps = data.healthy.length;
  let maxSteps = width - 100; // Number of data points that fit within the graph width

  if (totalSteps < 2) return; // Avoid division by zero

  for (let key in data) {
    beginShape();
    stroke(colors[key]);
    for (let i = 0; i < data[key].length; i++) {
      let x = map(i, 0, totalSteps - 1, graphX, graphX + maxSteps);
      let y = map(data[key][i], 0, numAgents, graphY + graphHeight, graphY);
      vertex(x, y);
    }
    endShape();
  }
}