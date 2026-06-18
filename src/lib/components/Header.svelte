<script lang="ts">
    import { appState } from "$lib/state.svelte";
    import { getCurrentWindow } from "@tauri-apps/api/window";

    let {
        projectName = "",
        onBackToWelcome,
        onSave,
    } = $props<{
        projectName?: string;
        onBackToWelcome: () => void;
        onSave?: () => void;
    }>();

    let isDropdownOpen = $state(false);
    const appWindow = getCurrentWindow();

    async function handleMinimize() {
        await appWindow.minimize();
    }

    async function handleMaximize() {
        await appWindow.toggleMaximize();
    }

    async function handleClose() {
        await appWindow.close();
    }
</script>

<header
    class="flex items-center justify-between h-10 border-b border-gray-200 bg-white select-none relative z-50 w-full"
>
    <!-- Drag Region Background -->
    <div data-tauri-drag-region class="absolute inset-0 z-0"></div>

    <!-- Left: Menu and Title -->
    <div class="relative flex items-center px-4 z-10 pointer-events-none">
        <div class="flex items-center pointer-events-auto">
            <button
                onclick={() => (isDropdownOpen = !isDropdownOpen)}
                class="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Menu"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>

            <span class="ml-4 text-sm font-medium text-gray-700 select-none">
                {appState.scene === "welcome"
                    ? "Writoo"
                    : projectName || "Writoo"}{appState.isDirty ? "*" : ""}
            </span>
        </div>

        {#if isDropdownOpen}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div
                class="fixed inset-0 z-40 pointer-events-auto"
                onclick={() => (isDropdownOpen = false)}
            ></div>
            <div
                class="absolute left-4 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1 pointer-events-auto"
            >
                {#if appState.scene === "editor"}
                    <button
                        onclick={() => {
                            isDropdownOpen = false;
                            onSave?.();
                        }}
                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Save (Ctrl+S)
                    </button>
                    <hr class="my-1 border-gray-100" />
                    <button
                        onclick={() => {
                            isDropdownOpen = false;
                            onBackToWelcome();
                        }}
                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Exit to Welcome
                    </button>
                {:else}
                    <div class="px-4 py-2 text-sm text-gray-400 italic">
                        No actions available
                    </div>
                {/if}
            </div>
        {/if}
    </div>

    <!-- Right: Window Controls -->
    <div class="flex h-full z-10">
        <button
            onclick={handleMinimize}
            class="w-12 h-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Minimize"
        >
            <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect x="2" y="5.5" width="8" height="1" fill="currentColor" />
            </svg>
        </button>
        <button
            onclick={handleMaximize}
            class="w-12 h-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Maximize"
        >
            <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect
                    x="2.5"
                    y="2.5"
                    width="7"
                    height="7"
                    stroke="currentColor"
                    fill="none"
                />
            </svg>
        </button>
        <button
            onclick={handleClose}
            class="w-12 h-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
            aria-label="Close"
        >
            <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5"
                    stroke="currentColor"
                    stroke-width="1.2"
                />
            </svg>
        </button>
    </div>
</header>
