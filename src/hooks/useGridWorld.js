import { useRef, useState } from "react";
import { GridWorld } from "../env/GridWorld";

export function useGridWorld() {
	const envRef = useRef(null);
	const doneRef = useRef(false);

	const [state, setState] = useState(null);
	const [reward, setReward] = useState(0);
	const [done, setDone] = useState(false);
	const [gridSize, setGridSize] = useState({ width: 10, height: 10 });
	const [episode, setEpisode] = useState(1);
	const [lastAction, setLastAction] = useState(null);
	const [history, setHistory] = useState([]);
	const [steps, setSteps] = useState(0);
	const [maxSteps, setMaxSteps] = useState(0);

	function initialize() {
		if (envRef.current) return;

		envRef.current = new GridWorld();
		const initialState = envRef.current.reset();
		setState(initialState);
		setSteps(0);
		setMaxSteps(envRef.current.maxSteps);
		setGridSize({
			width: envRef.current.width,
			height: envRef.current.height,
		});
	}

	function step(action) {
		if (!envRef.current || doneRef.current) return;

		const result = envRef.current.step(action);
		setState(result.state);
		setReward(result.reward);
		setLastAction(action);
		setSteps(result.steps);
		setMaxSteps(result.maxSteps);

		setHistory((prev) => [
			...prev,
			{
				step: result.steps,
				position: result.state.position,
				action,
				reward: result.reward,
			},
		]);

		if (result.done) {
			setDone(true);
			doneRef.current = true;
			setEpisode((prev) => prev + 1);
		}
	}

	function reset() {
		if (!envRef.current) return;

		const initialState = envRef.current.reset();
		setState(initialState);
		setReward(0);
		setDone(false);
		doneRef.current = false;
		setSteps(0);
		setHistory([]);
		setLastAction(null);
	}

	return {
		state,
		reward,
		done,
		gridSize,
		episode,
		lastAction,
		history,
		steps,
		maxSteps,
		initialize,
		step,
		reset,
	};
}
