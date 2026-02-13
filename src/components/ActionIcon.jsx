import {
	ArrowBigUp,
	ArrowBigDown,
	ArrowBigLeft,
	ArrowBigRight,
	Minus,
} from "lucide-react";

export function ActionIcon({ action, size = 16 }) {
	switch (action) {
		case "up":
			return <ArrowBigUp size={size} />;
		case "down":
			return <ArrowBigDown size={size} />;
		case "left":
			return <ArrowBigLeft size={size} />;
		case "right":
			return <ArrowBigRight size={size} />;
		default:
			return <Minus size={size} className="text-secondary" />;
	}
}
