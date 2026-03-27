import { getSimpleGitWithShellPath } from "./git-client";

export interface ExternalWorktree {
	path: string;
	branch: string | null;
	isDetached: boolean;
	isBare: boolean;
}

export async function listExternalWorktrees(
	mainRepoPath: string,
): Promise<ExternalWorktree[]> {
	try {
		const git = await getSimpleGitWithShellPath(mainRepoPath);
		const output = await git.raw(["worktree", "list", "--porcelain"]);

		const result: ExternalWorktree[] = [];
		let current: Partial<ExternalWorktree> = {};

		for (const line of output.split("\n")) {
			if (line.startsWith("worktree ")) {
				if (current.path) {
					result.push({
						path: current.path,
						branch: current.branch ?? null,
						isDetached: current.isDetached ?? false,
						isBare: current.isBare ?? false,
					});
				}
				current = { path: line.slice("worktree ".length) };
			} else if (line.startsWith("branch refs/heads/")) {
				current.branch = line.slice("branch refs/heads/".length);
			} else if (line === "detached") {
				current.isDetached = true;
			} else if (line === "bare") {
				current.isBare = true;
			}
		}

		if (current.path) {
			result.push({
				path: current.path,
				branch: current.branch ?? null,
				isDetached: current.isDetached ?? false,
				isBare: current.isBare ?? false,
			});
		}

		return result;
	} catch (error) {
		console.error(`Failed to list external worktrees: ${error}`);
		throw error;
	}
}
