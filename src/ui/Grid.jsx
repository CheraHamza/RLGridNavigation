import { useRef, useState, useEffect } from "react";
import { GridWorld } from "../env/GridWorld";
import styled from "styled-components";
import {
	X,
	ArrowBigDown,
	ArrowBigLeft,
	ArrowBigRight,
	ArrowBigUp,
	Cpu,
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

	&.previous {
		background-color: #4caf4f7a;
	}
`;

function Grid() {
	const envRef = useRef(null);

	const [state, setState] = useState(null);
	const [reward, setReward] = useState(0);
	const [done, setDone] = useState(false);
	const [gridSize, setGridSize] = useState({ width: 10, height: 10 });
	const [episode, setEpisode] = useState(1);
	const [lastAction, setLastAction] = useState(null);
	const [history, setHistory] = useState([]);
	const [steps, setSteps] = useState(0);
	const [maxSteps, setMaxSteps] = useState(0);

	useEffect(() => {
		if (envRef.current === null) {
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
	}, []);

	function step(action) {
		if (!envRef.current || done) return;

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
				action: action,
				reward: result.reward,
			},
		]);

		if (result.done) {
			setDone(true);
			setEpisode((prev) => prev + 1);
		}
	}

	async function stepFromBackend() {
		if (!envRef.current || done) return;

		try {
			const response = await fetch("http://127.0.0.1:8000/act", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(state),
			});

			if (!response.ok) {
				throw new Error(`Backend error: ${response.status}`);
			}

			const data = await response.json();

			if (!data.action) {
				throw new Error("No action returned from backend");
			}

			step(data.action);
		} catch (error) {
			console.error("Backend step failed:", error);
			alert("Backend unavailable or error occurred. Check server.");
		}
	}

	function reset() {
		if (!envRef.current) return;

		const initialState = envRef.current.reset();
		setState(initialState);
		setReward(0);
		setDone(false);
		setSteps(0);
		setHistory([]);
		setLastAction(null);
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

	function actionArrow(action) {
		switch (action) {
			case "up":
				return <ArrowBigUp />;
			case "down":
				return <ArrowBigDown />;
			case "left":
				return <ArrowBigLeft />;
			case "right":
				return <ArrowBigRight />;
			default:
				return "";
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
		<div style={{ display: "flex", alignItems: "center", gap: "50px" }}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "20px",
					border: "1px solid #6c6c6c",
					padding: "10px",
					width: "200px",
					height: "600px",
					overflowY: "auto",
					backgroundColor: "#f9f9f9",
					borderRadius: "8px",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
					}}
				>
					<h4>Last action</h4>
					{actionArrow(lastAction)}
				</div>
				<div>
					<h4>History</h4>
					<ul
						style={{
							listStyle: "none",
							display: "flex",
							flexDirection: "column",
							gap: "5px",
						}}
					>
						{history.map((h) => (
							<li
								style={{ display: "flex", alignItems: "center", gap: "5px" }}
								key={h.step}
							>
								{h.step}. {actionArrow(h.action)}
							</li>
						))}
					</ul>
				</div>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
				<div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
					<div>Episode: {episode}</div>
					<div>
						Moves: {steps} / {maxSteps}
					</div>
					<div>Reward: {reward}</div>
					<div>Done: {done ? "yes" : "no"}</div>
					<button onClick={reset}>
						<RefreshCcw />
					</button>
					<button
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
						onClick={stepFromBackend}
					>
						<Cpu />
						Step from Backend
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
		</div>
	);
}

export default Grid;
