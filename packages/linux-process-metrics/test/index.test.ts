import { describe, expect, mock, test } from "bun:test";

// ---------------------------------------------------------------------------
// Mock node:fs before importing the module under test.
// bun:test hoists mock.module calls so the static import below resolves
// against this mock registry entry.
// ---------------------------------------------------------------------------

const mockReadFileSync = mock((_path: string, _enc: string): string => {
	throw Object.assign(new Error("ENOENT: no such file or directory"), {
		code: "ENOENT",
	});
});

mock.module("node:fs", () => ({
	readFileSync: mockReadFileSync,
}));

import { getPhysFootprints } from "../src/index";

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function makeSmapsRollup(pssKb: number): string {
	return [
		"Rss:            1024 kB",
		`Pss:            ${pssKb} kB`,
		"Shared_Clean:    512 kB",
	].join("\n");
}

function makeErrnoError(code: string): Error {
	return Object.assign(new Error(code), { code });
}

// ---------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------

describe("getPhysFootprints — @superset/linux-process-metrics", () => {
	test("deve retornar {} para array vazio", () => {
		const result = getPhysFootprints([]);
		expect(result).toEqual({});
	});

	test("deve retornar PSS em bytes para PID com smaps_rollup válido", () => {
		// /proc/1234/smaps_rollup retorna Pss: 500 kB → esperamos 512000 bytes
		mockReadFileSync.mockImplementationOnce(() => makeSmapsRollup(500));

		const result = getPhysFootprints([1234]);

		// RED: stub retorna {} → result[1234] é undefined → falha aqui ✓
		expect(result[1234]).toBe(500 * 1024);
	});

	test("deve omitir PID inacessível (EACCES) sem lançar exceção", () => {
		mockReadFileSync.mockImplementationOnce(() => {
			throw makeErrnoError("EACCES");
		});

		const result = getPhysFootprints([9999]);
		expect(result).not.toHaveProperty("9999");
	});

	test("deve omitir PID não encontrado (ENOENT) sem lançar exceção", () => {
		mockReadFileSync.mockImplementationOnce(() => {
			throw makeErrnoError("ENOENT");
		});

		const result = getPhysFootprints([8888]);
		expect(result).not.toHaveProperty("8888");
	});

	test("deve processar múltiplos PIDs retornando apenas os acessíveis", () => {
		// PID 1 → válido (Pss 256 kB), PID 2 → ENOENT (omitido)
		mockReadFileSync
			.mockImplementationOnce(() => makeSmapsRollup(256))
			.mockImplementationOnce(() => {
				throw makeErrnoError("ENOENT");
			});

		const result = getPhysFootprints([1, 2]);

		// RED: stub retorna {} → result[1] é undefined → falha aqui ✓
		expect(result[1]).toBe(256 * 1024);
		expect(result).not.toHaveProperty("2");
	});
});
