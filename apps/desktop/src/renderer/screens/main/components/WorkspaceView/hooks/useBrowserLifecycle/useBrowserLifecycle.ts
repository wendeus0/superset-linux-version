import { useEffect, useRef } from "react";
import { electronTrpc } from "renderer/lib/electron-trpc";
import {
	destroyPersistentWebview,
	lastActiveTimestamps,
} from "renderer/screens/main/components/WorkspaceView/ContentView/TabsContent/TabView/BrowserPane/hooks/usePersistentWebview";
import { useTabsStore } from "renderer/stores/tabs/store";

/** Destroy webviews that have been idle (parked in hidden container) for this long */
const IDLE_WEBVIEW_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
/** How often to check for idle webviews */
const IDLE_SWEEP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export function useBrowserLifecycle() {
	const { mutate: unregisterBrowser } =
		electronTrpc.browser.unregister.useMutation();
	const previousPaneIdsRef = useRef<Set<string>>(new Set());

	useEffect(() => {
		// Initialize with current browser pane IDs
		const state = useTabsStore.getState();
		previousPaneIdsRef.current = new Set(
			Object.entries(state.panes)
				.filter(([, p]) => p.type === "webview")
				.map(([id]) => id),
		);

		return useTabsStore.subscribe((state) => {
			const currentBrowserPaneIds = new Set(
				Object.entries(state.panes)
					.filter(([, p]) => p.type === "webview")
					.map(([id]) => id),
			);
			for (const prevId of previousPaneIdsRef.current) {
				if (!currentBrowserPaneIds.has(prevId)) {
					destroyPersistentWebview(prevId);
					unregisterBrowser({ paneId: prevId });
				}
			}
			previousPaneIdsRef.current = currentBrowserPaneIds;
		});
	}, [unregisterBrowser]);

	// Idle sweep: destroy webviews that have been parked for too long to free GPU memory.
	// The webview will be transparently recreated when the user focuses the pane again.
	useEffect(() => {
		const sweep = setInterval(() => {
			const { panes, focusedPaneIds } = useTabsStore.getState();
			const focusedIds = new Set(Object.values(focusedPaneIds));
			const now = Date.now();

			for (const [paneId, pane] of Object.entries(panes)) {
				if (pane.type !== "webview") continue;
				if (pane.suspended) continue; // already suspended
				if (focusedIds.has(paneId)) continue; // currently visible — never suspend

				const lastActive = lastActiveTimestamps.get(paneId) ?? now;
				if (now - lastActive > IDLE_WEBVIEW_TIMEOUT_MS) {
					destroyPersistentWebview(paneId);
					unregisterBrowser({ paneId });
					useTabsStore.getState().suspendBrowserPane(paneId);
				}
			}
		}, IDLE_SWEEP_INTERVAL_MS);

		return () => clearInterval(sweep);
	}, [unregisterBrowser]);
}
