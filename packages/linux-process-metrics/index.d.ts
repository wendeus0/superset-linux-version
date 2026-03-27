/**
 * Get the proportional memory footprint (PSS) for the given PIDs on Linux.
 *
 * Reads /proc/<pid>/smaps_rollup and returns the Pss field in bytes.
 * PSS (Proportional Set Size) accounts for shared memory proportionally —
 * the closest Linux equivalent to macOS ri_phys_footprint.
 *
 * Requires kernel >= 4.14 (Ubuntu 18.04+, Arch Linux rolling).
 * On non-Linux platforms returns an empty object.
 *
 * @returns A map from PID to PSS in bytes. Missing/inaccessible PIDs are
 *          silently omitted.
 */
export function getPhysFootprints(pids: number[]): Record<number, number>;
