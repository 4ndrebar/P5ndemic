Sure! Here's a README for your project:

---

# P5ndemic

P5ndemic is an interactive simulation based on the p5.js library that models the spread of an infection in a population. This project allows users to visualize how different parameters like mobility and lethality affect the dynamics of an epidemic.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

To run this project locally, you need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. Follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/4ndrebar/P5ndemic.git
    ```

2. Navigate to the project directory:
    ```sh
    cd P5ndemic
    ```

3. Install the dependencies:
    ```sh
    npm install
    ```

## Usage

To start the simulation, open the `index.html` file in your web browser. You can also serve the project using a local server:

1. Start a local server (you can use any local server tool like Live Server for VS Code):
    ```sh
    npx live-server
    ```

2. Open your web browser and navigate to the provided local server URL.

## Features

- **Adjustable Parameters**: Use the sliders to adjust the velocity and lethality of the agents.
- **Real-time Graph**: Visualize the number of healthy, infected, recovered, and deceased agents over time.
- **Restart Simulation**: Restart the simulation at any time using the restart button.

## Code Overview

- `sketch.js`: Contains the main logic of the simulation including the `setup`, `draw`, and `Agent` class.
- `index.html`: The HTML structure of the project.
- `style.css`: Basic styling for the project.

### Simulation Parameters

- **Velocity Slider**: Controls the movement speed of the agents.
- **Lethality Slider**: Controls the probability of an infected agent dying per frame.

## Contributing

Contributions are welcome! If you want to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```sh
    git checkout -b feature/your-feature-name
    ```
3. Make your changes and commit them:
    ```sh
    git commit -m 'Add some feature'
    ```
4. Push to the branch:
    ```sh
    git push origin feature/your-feature-name
    ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to modify any sections as per your project's specifics!
