/* eslint-disable max-classes-per-file */
import { reactive, readonly } from "vue";

import { type Editor } from "@/wasm-communication/editor";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createWorkspaceState(editor: Editor) {
	const state = reactive({
		nodeGraphVisible: false,
	});

	// Set up message subscriptions on creation
	editor.subscriptions.subscribeJsMessage("UpdateNodeGraphVisibility", (updateNodeGraphVisibility) => {
		state.nodeGraphVisible = updateNodeGraphVisibility.visible;
	});

	return {
		state: readonly(state) as typeof state,
	};
}
export type WorkspaceState = ReturnType<typeof createWorkspaceState>;
