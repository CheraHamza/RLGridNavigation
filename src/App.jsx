import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Grid from "./ui/Grid";
import "./styles/main.css";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Grid></Grid>
	</StrictMode>,
);
