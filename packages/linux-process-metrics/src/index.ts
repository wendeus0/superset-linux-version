import { readFileSync } from "node:fs";

const PSS_PATTERN = /^Pss:\s+(\d+)\s+kB/m;

export function getPhysFootprints(pids: number[]): Record<number, number> {
	if (process.platform !== "linux" || pids.length === 0) {
		return {};
	}

	const result: Record<number, number> = {};

	for (const pid of pids) {
		try {
			const content = readFileSync(`/proc/${pid}/smaps_rollup`, "utf8");
			const match = content.match(PSS_PATTERN);
			if (match?.[1]) {
				result[pid] = Number.parseInt(match[1], 10) * 1024;
			}
		} catch {
			// ENOENT, EACCES, EPERM — PID inexistente ou inacessível → omitir
		}
	}

	return result;
}
