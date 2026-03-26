import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { electronTrpc } from "renderer/lib/electron-trpc";
import { electronReactClient } from "../../lib/trpc-client";

// Shared QueryClient for tRPC hooks and router loaders
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			networkMode: "always",
			retry: false,
			staleTime: 30_000, // 30s — avoids refetch on every mount
			gcTime: 5 * 60 * 1000, // 5 minutes — explicit (matches TanStack Query default)
		},
		mutations: {
			networkMode: "always",
			retry: false,
		},
	},
});

/**
 * Provider for Electron IPC tRPC client.
 * QueryClient is shared with router context for loader prefetching.
 */
export function ElectronTRPCProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<electronTrpc.Provider
			client={electronReactClient}
			queryClient={queryClient}
		>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</electronTrpc.Provider>
	);
}

// Export for router context
export { queryClient as electronQueryClient };
