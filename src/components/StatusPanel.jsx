import { ActionIcon } from "./ActionIcon";

export default function StatusPanel({
	episode,
	steps,
	maxSteps,
	reward,
	epsilon,
	done,
	lastAction,
}) {
	return (
		<div className="card status-panel">
			<h3 className="card-title">Status</h3>
			<div className="status-grid">
				<div className="stat">
					<span className="stat-label">Episode</span>
					<span className="stat-value">{episode}</span>
				</div>
				<div className="stat">
					<span className="stat-label">Steps</span>
					<span className="stat-value">
						{steps}
						<span className="stat-secondary"> / {maxSteps}</span>
					</span>
				</div>
				<div className="stat">
					<span className="stat-label">Reward</span>
					<span
						className={`stat-value ${reward > 0 ? "text-success" : reward < 0 ? "text-danger" : ""}`}
					>
						{reward.toFixed(3)}
					</span>
				</div>
				<div className="stat">
					<span className="stat-label">Epsilon</span>
					<span className="stat-value">{epsilon.toFixed(3)}</span>
				</div>
				<div className="stat">
					<span className="stat-label">Status</span>
					<span
						className={`stat-badge ${done ? "badge-done" : "badge-active"}`}
					>
						{done ? "Done" : "Active"}
					</span>
				</div>
				<div className="stat">
					<span className="stat-label">Last Action</span>
					<span className="stat-value stat-action">
						<ActionIcon action={lastAction} size={16} />
					</span>
				</div>
			</div>
		</div>
	);
}
