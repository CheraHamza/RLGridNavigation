import { useState, useEffect, useRef } from "react";
import { useGridWorld } from "./hooks/useGridWorld";
import { fetchAction } from "./api/agent";
import GridBoard from "./components/GridBoard";
import Controls from "./components/Controls";
import StatusPanel from "./components/StatusPanel";
import HistoryPanel from "./components/HistoryPanel";
import ModelManager from "./components/ModelManager";
import { RefreshCcw, Cpu, Play, Square } from "lucide-react";

export default function App() {
	const {
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
	} = useGridWorld();

	const [isAutoRunning, setIsAutoRunning] = useState(false);
	const [currentEpsilon, setCurrentEpsilon] = useState(1.0);

	const stepRef = useRef(step);
	const resetRef = useRef(reset);
	stepRef.current = step;
	resetRef.current = reset;

	useEffect(() => {
		initialize();
	}, [initialize]);

	// Keyboard navigation
	useEffect(() => {
		function handleKeyDown(e) {
			if (done) return;
			const actions = {
				ArrowUp: "up",
				ArrowDown: "down",
				ArrowLeft: "left",
				ArrowRight: "right",
			};
			if (actions[e.key]) stepRef.current(actions[e.key]);
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [done]);

	async function stepFromBackend() {
		if (!state) return;

		const payload = {
			position: state.position,
			target: state.target,
			reward,
			done,
		};

		try {
			const data = await fetchAction(payload);

			if (data.epsilon !== undefined) {
				setCurrentEpsilon(data.epsilon);
			}

			if (!data.action) {
				throw new Error("No action returned from backend");
			}

			if (data.action === "stop") {
				setTimeout(() => resetRef.current(), 10);
				return;
			}

			stepRef.current(data.action);
		} catch (error) {
			console.error("Backend step failed:", error);
			setIsAutoRunning(false);
		}
	}

	// Auto-run loop
	useEffect(() => {
		let timeoutId;
		if (isAutoRunning) {
			timeoutId = setTimeout(stepFromBackend, 50);
		}
		return () => clearTimeout(timeoutId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAutoRunning, done, state]);

	function handleModelLoaded(newEpsilon) {
		setCurrentEpsilon(newEpsilon);
		reset();
	}

	if (!state) return null;

	return (
		<div className="app">
			<header className="app-header">
				<h1>RL Grid Navigation</h1>
				<p className="app-subtitle">Reinforcement Learning Agent Playground</p>
			</header>

			<main className="app-content">
				<div className="main-area">
					<GridBoard state={state} gridSize={gridSize} history={history} />
					<Controls onStep={step} done={done} />
				</div>

				<aside className="sidebar">
					<StatusPanel
						episode={episode}
						steps={steps}
						maxSteps={maxSteps}
						reward={reward}
						epsilon={currentEpsilon}
						done={done}
						lastAction={lastAction}
					/>

					<div className="card">
						<h3 className="card-title">Agent Controls</h3>
						<div className="agent-controls">
							<button className="btn btn-secondary" onClick={reset}>
								<RefreshCcw size={16} />
								Reset Environment
							</button>
							<button className="btn btn-primary" onClick={stepFromBackend}>
								<Cpu size={16} />
								AI Step
							</button>
							<button
								className={`btn ${isAutoRunning ? "btn-danger" : "btn-accent"}`}
								onClick={() => setIsAutoRunning(!isAutoRunning)}
							>
								{isAutoRunning ? (
									<>
										<Square size={16} />
										Stop Auto-Run
									</>
								) : (
									<>
										<Play size={16} />
										Start Auto-Run
									</>
								)}
							</button>
						</div>
					</div>

					<ModelManager onLoadModel={handleModelLoaded} />
					<HistoryPanel history={history} />
				</aside>
			</main>
		</div>
	);
}
