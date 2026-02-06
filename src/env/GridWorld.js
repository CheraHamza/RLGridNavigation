export class GridWorld {
	constructor(
		height = 10,
		width = 10,
		startingPosition = [0, 0],
		targetPosition = [8, 8],
	) {
		this.height = height;
		this.width = width;
		this.startingPosition = [...startingPosition];
		this.targetPosition = [...targetPosition];
		this.currentPosition = startingPosition;

		this.currentPosition = [...startingPosition];
		this.maxSteps = height * width;
		this.steps = 0;
	}

	reset() {
		this.currentPosition = [...this.startingPosition];
		this.steps = 0;
		return this.getState();
	}

	getState() {
		return {
			position: [...this.currentPosition],
			target: [...this.targetPosition],
		};
	}

	step(action) {
		let [x, y] = this.currentPosition;
		let reward = -0.01;
		let done = false;

		switch (action) {
			case "up":
				if (y > 0) y--;
				else reward = -0.1;
				break;

			case "down":
				if (y < this.height - 1) y++;
				else reward = -0.1;
				break;

			case "left":
				if (x > 0) x--;
				else reward = -0.1;
				break;

			case "right":
				if (x < this.width - 1) x++;
				else reward = -0.1;
				break;

			default:
				break;
		}

		this.currentPosition = [x, y];
		this.steps++;

		if (x === this.targetPosition[0] && y === this.targetPosition[1]) {
			reward = 1.0;
			done = true;
		}

		if (this.steps >= this.maxSteps) {
			done = true;
		}

		return {
			state: this.getState(),
			reward,
			done,
			steps: this.steps,
			maxSteps: this.maxSteps,
		};
	}
}
