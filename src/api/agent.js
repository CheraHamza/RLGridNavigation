const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function fetchAction(payload) {
	const response = await fetch(`${API_URL}/act`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error(`Backend error: ${response.status}`);
	}

	return response.json();
}

export async function fetchModels() {
	const response = await fetch(`${API_URL}/models`);
	return response.json();
}

export async function saveModel(name) {
	await fetch(`${API_URL}/models`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name }),
	});
}

export async function loadModel(id) {
	const response = await fetch(`${API_URL}/models/${id}/load`, {
		method: "POST",
	});
	return response.json();
}

export async function deleteModel(id) {
	await fetch(`${API_URL}/models/${id}`, { method: "DELETE" });
}

export async function trainBatch(episodes = 500, obstacles = []) {
	const response = await fetch(`${API_URL}/train`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ episodes, obstacles }),
	});

	if (!response.ok) {
		throw new Error(`Backend error: ${response.status}`);
	}

	return response.json();
}
