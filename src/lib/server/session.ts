import { writable } from "svelte/store";

export const session = writable<{state: string | undefined, nonce: string | undefined}>(undefined, undefined);
