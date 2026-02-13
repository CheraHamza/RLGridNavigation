import { useMemo } from "react";

export default function GridBoard({ state, gridSize, history }) {
	const { position, target } = state;
	const { height, width } = gridSize;

	const visitedCells = useMemo(() => {
		const visited = new Set();
		history.forEach((h) => visited.add(`${h.position[0]}-${h.position[1]}`));
		return visited;
	}, [history]);

	return (
		<div className="grid-board">
			<div
				className="grid"
				style={{
					gridTemplateColumns: `repeat(${width}, var(--cell-size))`,
					gridTemplateRows: `repeat(${height}, var(--cell-size))`,
				}}
			>
				{Array.from({ length: height }).map((_, y) =>
					Array.from({ length: width }).map((_, x) => {
						const isAgent = position[0] === x && position[1] === y;
						const isTarget = target[0] === x && target[1] === y;
						const isVisited =
							!isAgent && !isTarget && visitedCells.has(`${x}-${y}`);

						const classes = [
							"cell",
							isAgent && "cell--agent",
							isTarget && "cell--target",
							isVisited && "cell--visited",
						]
							.filter(Boolean)
							.join(" ");

						return (
							<div key={`${x}-${y}`} className={classes}>
								{isAgent && <div className="cell-dot agent-dot" />}
								{isTarget && <div className="cell-dot target-dot" />}
								{isVisited && <div className="cell-dot visited-dot" />}
							</div>
						);
					}),
				)}
			</div>
		</div>
	);
}
