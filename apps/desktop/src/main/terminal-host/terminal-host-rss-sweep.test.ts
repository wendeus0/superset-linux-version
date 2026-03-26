/**
 * Tests for TerminalHost RSS sweep (Task 3.3 — Phase 3 memory optimizations)
 *
 * The sweep runs every 5 minutes and kills any terminal session whose
 * process-tree RSS exceeds 512 MB.
 */

import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";

// ---------------------------------------------------------------------------
// Mock process-tree BEFORE importing terminal-host so bun resolves the mock.
// ---------------------------------------------------------------------------

const mockCaptureProcessSnapshot = mock(async () => ({
	byPid: new Map<number, { pid: number; ppid: number; cpu: number; memory: number }>(),
	childrenOf: new Map<number, number[]>(),
}));

const mockGetSubtreeResources = mock(
	(_snap: unknown, _pid: number): { cpu: number; memory: number; pids: number[] } => ({
		cpu: 0,
		memory: 0,
		pids: [],
	}),
);

mock.module("../lib/resource-metrics/process-tree", () => ({
	captureProcessSnapshot: mockCaptureProcessSnapshot,
	getSubtreeResources: mockGetSubtreeResources,
}));

// Dynamic import ensures the mocked module is used.
const { TerminalHost } = await import("./terminal-host");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MB = 1024 * 1024;
const LIMIT_BYTES = 512 * MB;

function makeFakeSession(
	sessionId: string,
	pid: number | null,
	isAttachable = true,
) {
	return {
		sessionId,
		pid,
		isAttachable,
		isTerminating: false,
		isAlive: true,
		clientCount: 0,
		kill: mock(() => {}),
		dispose: mock(async () => {}),
	};
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("TerminalHost.runRssSweep", () => {
	let host: InstanceType<typeof TerminalHost>;

	beforeEach(() => {
		// mockReset clears both call history AND implementation, preventing
		// state from leaking between tests.
		mockCaptureProcessSnapshot.mockReset();
		mockGetSubtreeResources.mockReset();
		// Re-establish default (no-op) implementations after reset.
		mockCaptureProcessSnapshot.mockImplementation(async () => ({
			byPid: new Map<number, { pid: number; ppid: number; cpu: number; memory: number }>(),
			childrenOf: new Map<number, number[]>(),
		}));
		mockGetSubtreeResources.mockImplementation(() => ({
			cpu: 0,
			memory: 0,
			pids: [] as number[],
		}));
		host = new TerminalHost();
		// Stop background timers immediately — we drive sweep manually.
		(host as any).stopIdleSweep();
		(host as any).stopRssSweep();
		// Stub out `kill` so fake sessions don't trigger kill-timers.
		(host as any).kill = mock(() => ({ success: true }));
	});

	afterEach(async () => {
		await host.dispose();
	});

	it("skips captureProcessSnapshot when no session has a PID", async () => {
		const s = makeFakeSession("s-nopid", null);
		(host as any).sessions.set("s-nopid", s);

		await (host as any).runRssSweep();

		expect(mockCaptureProcessSnapshot).not.toHaveBeenCalled();
	});

	it("silently swallows captureProcessSnapshot failures", async () => {
		mockCaptureProcessSnapshot.mockImplementation(() =>
			Promise.reject(new Error("ps unavailable")),
		);

		const s = makeFakeSession("s-psfail", 1001);
		(host as any).sessions.set("s-psfail", s);

		// Must resolve, not throw.
		await expect((host as any).runRssSweep()).resolves.toBeUndefined();
		expect((host as any).kill).not.toHaveBeenCalled();
	});

	it("kills a session whose RSS exceeds 512 MB", async () => {
		mockGetSubtreeResources.mockImplementation(() => ({
			cpu: 20,
			memory: LIMIT_BYTES + 1,
			pids: [1002],
		}));

		const s = makeFakeSession("s-heavy", 1002);
		(host as any).sessions.set("s-heavy", s);

		await (host as any).runRssSweep();

		expect((host as any).kill).toHaveBeenCalledWith({
			sessionId: "s-heavy",
			deleteHistory: false,
		});
	});

	it("does not kill a session whose RSS is at or below 512 MB", async () => {
		mockGetSubtreeResources.mockImplementation(() => ({
			cpu: 5,
			memory: LIMIT_BYTES,
			pids: [1003],
		}));

		const s = makeFakeSession("s-ok", 1003);
		(host as any).sessions.set("s-ok", s);

		await (host as any).runRssSweep();

		expect((host as any).kill).not.toHaveBeenCalled();
	});

	it("skips sessions that are not attachable", async () => {
		mockGetSubtreeResources.mockImplementation(() => ({
			cpu: 99,
			memory: LIMIT_BYTES * 2,
			pids: [1004],
		}));

		// isAttachable = false → should be filtered before captureProcessSnapshot
		const s = makeFakeSession("s-dead", 1004, false);
		(host as any).sessions.set("s-dead", s);

		await (host as any).runRssSweep();

		expect(mockCaptureProcessSnapshot).not.toHaveBeenCalled();
		expect((host as any).kill).not.toHaveBeenCalled();
	});

	it("only kills over-limit sessions when mixed with healthy ones", async () => {
		mockGetSubtreeResources.mockImplementation(
			(_snap: unknown, pid: number) => ({
				cpu: 0,
				memory: pid === 2001 ? LIMIT_BYTES + 1 : 100 * MB,
				pids: [pid],
			}),
		);

		const heavy = makeFakeSession("s-heavy2", 2001);
		const light = makeFakeSession("s-light", 2002);
		(host as any).sessions.set("s-heavy2", heavy);
		(host as any).sessions.set("s-light", light);

		await (host as any).runRssSweep();

		expect((host as any).kill).toHaveBeenCalledTimes(1);
		expect((host as any).kill).toHaveBeenCalledWith({
			sessionId: "s-heavy2",
			deleteHistory: false,
		});
	});
});
