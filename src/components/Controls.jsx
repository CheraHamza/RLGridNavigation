import {
	ArrowBigUp,
	ArrowBigDown,
	ArrowBigLeft,
	ArrowBigRight,
} from "lucide-react";

export default function Controls({ onStep, done }) {
	return (
		<div className="controls">
			<div className="dpad">
				<button
					className="dpad-btn dpad-up"
					onClick={() => onStep("up")}
					disabled={done}
					aria-label="Move up"
				>
					<ArrowBigUp size={20} />
				</button>
				<button
					className="dpad-btn dpad-left"
					onClick={() => onStep("left")}
					disabled={done}
					aria-label="Move left"
				>
					<ArrowBigLeft size={20} />
				</button>
				<button
					className="dpad-btn dpad-down"
					onClick={() => onStep("down")}
					disabled={done}
					aria-label="Move down"
				>
					<ArrowBigDown size={20} />
				</button>
				<button
					className="dpad-btn dpad-right"
					onClick={() => onStep("right")}
					disabled={done}
					aria-label="Move right"
				>
					<ArrowBigRight size={20} />
				</button>
			</div>
			<p className="controls-hint">or use arrow keys</p>
		</div>
	);
}
