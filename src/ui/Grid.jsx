import { useRef, useState, useEffect } from "react";
import { GridWorld } from "../env/GridWorld";
import styled from "styled-components";
import {
	ArrowBigDown,
	ArrowBigLeft,
	ArrowBigRight,
	ArrowBigUp,
	RefreshCcw,
} from "lucide-react";

const StyledGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(10, 40px);
	gap: 2px;
`;

const Cell = styled.div`
	width: 40px;
	height: 40px;
	border: 1px solid #6c6c6c;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;

	&.agent {
		background-color: #4caf50;
	}

	&.target {
		background-color: #f44336;
	}
`;

function Grid() {
	const envRef = useRef(null);

	const [state, setState] = useState(null);
	const [reward, setReward] = useState(0);
	const [done, setDone] = useState(false);
	const [gridSize, setGridSize] = useState({ width: 10, height: 10 });
	const [episode, setEpisode] = useState(1);

	useEffect(() => {
		if (envRef.current === null) {
			envRef.current = new GridWorld();
			const initialState = envRef.current.reset();
			setState(initialState);
			setGridSize({
				width: envRef.current.width,
				height: envRef.current.height,
			});
		}
	}, []);

	function step(action) {
		if (!envRef.current || done) return;

		const result = envRef.current.step(action);
		setState(result.state);
		setReward(result.reward);

		if (result.done) {
			setDone(true);
			setEpisode((prev) => prev + 1);
		}
	}

	function reset() {
		if (!envRef.current) return;

		const initialState = envRef.current.reset();
		setState(initialState);
		setReward(0);
		setDone(false);
	}

	function keyNavigation(e) {
		if (done) return;

		switch (e.key) {
			case "ArrowUp":
				step("up");
				break;
			case "ArrowDown":
				step("down");
				break;
			case "ArrowLeft":
				step("left");
				break;
			case "ArrowRight":
				step("right");
				break;
			default:
				break;
		}
	}

	useEffect(() => {
		window.addEventListener("keydown", keyNavigation);
		return () => {
			window.removeEventListener("keydown", keyNavigation);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [done]);

	if (!state) return null;

	const { position, target } = state;
	const { height, width } = gridSize;

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
			<div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
				<div>Episode: {episode}</div>
				<div>Reward: {reward}</div>
				<div>Done: {done ? "yes" : "no"}</div>
				<button onClick={reset}>
					<RefreshCcw />
				</button>
			</div>
			<StyledGrid>
				{Array.from({ length: height }).map((_, y) =>
					Array.from({ length: width }).map((_, x) => {
						const isAgent = position[0] === x && position[1] === y;
						const isTarget = target[0] === x && target[1] === y;

						return (
							<Cell
								key={`${x}-${y}`}
								className={isAgent ? "agent" : isTarget ? "target" : ""}
							>
								{isAgent ? "Agent" : isTarget ? "Goal" : ""}
							</Cell>
						);
					}),
				)}
			</StyledGrid>

			<div style={{ marginTop: "10px" }}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<div>
						<button onClick={() => step("up")}>
							<ArrowBigUp fill="#000" />
						</button>
					</div>
					<div>
						<button onClick={() => step("left")}>
							<ArrowBigLeft fill="#000" />
						</button>
						<button onClick={() => step("down")}>
							<ArrowBigDown fill="#000" />
						</button>
						<button onClick={() => step("right")}>
							<ArrowBigRight fill="#000" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Grid;
