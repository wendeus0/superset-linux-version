import { cors } from "hono/cors";

export function buildLocalhostCors(port: number) {
	const allowed = [
		`http://localhost:${port}`,
		`http://127.0.0.1:${port}`,
		"null", // Electron renderer in production loads via file:// — Chromium sends Origin: null
	];
	return cors({ origin: allowed });
}
