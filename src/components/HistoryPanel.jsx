import { useRef, useEffect } from "react";
import { ActionIcon } from "./ActionIcon";

export default function HistoryPanel({ history }) {
	const listRef = useRef(null);

	useEffect(() => {
		if (listRef.current) {
			listRef.current.scrollTop = listRef.current.scrollHeight;
		}
	}, [history]);

	return (
		<div className="card history-panel">
			<h3 className="card-title">History</h3>
			{history.length === 0 ? (
				<p className="text-secondary text-sm">No moves yet</p>
			) : (
				<div className="history-list" ref={listRef}>
					{history.map((h) => (
						<div key={h.step} className="history-item">
							<span className="history-step">{h.step}</span>
							<span className="history-action">
								<ActionIcon action={h.action} size={14} />
							</span>
							<span className="history-reward">
								{h.reward > 0 ? "+" : ""}
								{h.reward.toFixed(2)}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
