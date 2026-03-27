# ADR-008: Linux Process Memory Metric — PSS via /proc

**Status:** accepted
**Date:** 2026-03-26

## Context

The Superset Desktop app reports per-workspace memory usage via `getPhysFootprints()`. On macOS, this calls `proc_pid_rusage()` → `ri_phys_footprint`, which accounts for compressed and shared memory and matches what Activity Monitor displays.

On Linux, no equivalent syscall exists. The available alternatives from `/proc/<pid>/` are:

| Metric | Source | Shared memory |
|---|---|---|
| RSS | `status` / `stat` | Counts in full (overcounts) |
| USS | `smaps` sum | Ignores shared pages entirely |
| PSS | `smaps_rollup` | Proportional — each page divided by number of sharers |

## Decision

Use **PSS (Proportional Set Size)** from `/proc/<pid>/smaps_rollup` as the Linux memory metric.

Rationale:
- PSS is the closest semantic equivalent to `ri_phys_footprint`: it accounts for shared memory proportionally, so the sum across all processes equals total physical RAM used.
- `smaps_rollup` is a single aggregated file (kernel ≥ 4.14, available on Ubuntu 18.04+ and Arch Linux rolling) — O(1) read regardless of mapping count.
- The implementation is pure TypeScript (`node:fs.readFileSync`) with no native addon, no build step, and no runtime dependency beyond Node.js.
- Synchronous I/O is acceptable here: the file is ≤ 1 KB and read from the kernel's in-memory procfs; no disk latency.

## Consequences

- Requires kernel ≥ 4.14. Kernels older than this lack `smaps_rollup`; PIDs on such systems are silently omitted (falls back to RSS from the `ps` snapshot).
- PSS may differ from what system monitors (e.g., `gnome-system-monitor`, `htop`) display, which often show RSS. This is intentional — PSS is more accurate for multi-process workloads.
- The `@superset/linux-process-metrics` package is a workspace-only pure TypeScript package with no published artifact. Consumers must bundle it (electron-vite handles this).
