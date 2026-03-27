import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { buildLocalhostCors } from "../src/cors";

describe("host-service CORS — restrição a localhost", () => {
	function makeApp(port: number) {
		const app = new Hono();
		app.use("*", buildLocalhostCors(port));
		app.get("/health", (c) => c.json({ ok: true }));
		return app;
	}

	test("deve refletir ACAO para origem localhost com porta correta", async () => {
		const app = makeApp(5173);
		const res = await app.request("/health", {
			headers: { Origin: "http://localhost:5173" },
		});
		expect(res.headers.get("access-control-allow-origin")).toBe(
			"http://localhost:5173",
		);
	});

	test("deve refletir ACAO para 127.0.0.1 com porta correta", async () => {
		const app = makeApp(5173);
		const res = await app.request("/health", {
			headers: { Origin: "http://127.0.0.1:5173" },
		});
		expect(res.headers.get("access-control-allow-origin")).toBe(
			"http://127.0.0.1:5173",
		);
	});

	test("deve rejeitar origem externa — não refletir no header ACAO", async () => {
		const app = makeApp(5173);
		const res = await app.request("/health", {
			headers: { Origin: "https://evil.com" },
		});
		const acao = res.headers.get("access-control-allow-origin");
		expect(acao).not.toBe("https://evil.com");
		expect(acao).toBeFalsy();
	});

	test("deve refletir ACAO para origin null (Electron renderer via file:// em produção)", async () => {
		const app = makeApp(5173);
		const res = await app.request("/health", {
			headers: { Origin: "null" },
		});
		expect(res.headers.get("access-control-allow-origin")).toBe("null");
	});

	test("deve rejeitar origem localhost com porta diferente", async () => {
		const app = makeApp(5173);
		const res = await app.request("/health", {
			headers: { Origin: "http://localhost:9999" },
		});
		const acao = res.headers.get("access-control-allow-origin");
		expect(acao).not.toBe("http://localhost:9999");
		expect(acao).toBeFalsy();
	});
});
