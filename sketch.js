let agents = [];
let numAgents = 700;
let infectionRadius = 10;
let averageInfectionDuration = 300; // Frames before recovery plus Poissonian deviation
let mobility = 3;
let lethality = 0.1;
let lethalityPerFrame = 1 - Math.pow(1 - lethality, 1 / averageInfectionDuration); // Probability to die while sick
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
    let state = random() < 0.02 ? "infected" : "healthy"; // 2% chance of starting infected
    agents.push(new Agent(random(width), random(height), state));
  }
}

function draw() {
  background(240);

  // Update and display agents
  for (let agent of agents) {
    agent.update();
    agent.display();
  }

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
    this.x = x;
    this.y = y;
    this.state = state; // "healthy", "infected", "recovered", "immune", "deceased"
    this.infectionTimer = 0; // How long agent has been infected
  }

  update() {
    if (this.state === "deceased") return; // Deceased agents don't move or infect others

    // Random movement
    this.x += random(-mobility, mobility);
    this.y += random(-mobility, mobility);
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
