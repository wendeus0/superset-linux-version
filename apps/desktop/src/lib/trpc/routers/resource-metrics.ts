import { browserManager } from "main/lib/browser/browser-manager";
import { collectResourceMetrics } from "main/lib/resource-metrics";
import { z } from "zod";
import { publicProcedure, router } from "..";
import {
	resourceMetricsSnapshotSchema,
	validateResourceMetricsSnapshot,
} from "./resource-metrics.schema";

const getSnapshotInputSchema = z
	.object({
		mode: z.enum(["interactive", "idle"]).optional(),
		force: z.boolean().optional(),
	})
	.optional();

export const createResourceMetricsRouter = () => {
	return router({
		getSnapshot: publicProcedure
			.input(getSnapshotInputSchema)
			.output(resourceMetricsSnapshotSchema)
			.query(async ({ input }) => {
				const snapshot = await collectResourceMetrics({
					mode: input?.mode,
					force: input?.force,
				});
				const validation = validateResourceMetricsSnapshot(snapshot);
				if (!validation.isValid) {
					console.warn(
						"[resource-metrics] Invalid snapshot payload; returning fallback snapshot",
						validation.issues,
					);
				}
				return validation.snapshot;
			}),

		/**
		 * Force a memory cleanup pass:
		 * 1. Clear HTTP/resource caches for all registered browser WebViews.
		 * 2. Request a V8 garbage collection in the renderer (best-effort).
		 */
		forceCleanup: publicProcedure.mutation(async () => {
			await browserManager.clearAllCaches();
			return { success: true };
		}),
	});
};
