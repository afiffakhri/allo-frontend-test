// src/api/index.ts

const BASE_URL = import.meta.env.VITE_API_URL;

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
	const response = await fetch(`${BASE_URL}${endpoint}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(options?.headers || {}),
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`API Error: ${response.status} ${errorText}`);
	}

	return response.json();
}

export default request;
