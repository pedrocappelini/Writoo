<script lang="ts">
    import "../app.css";
    import Header from "$lib/components/Header.svelte";
    import { appState, resetToWelcome } from "$lib/state.svelte";

    let { children } = $props();

    function handleKeyDown(event: KeyboardEvent) {
        if (event.altKey && event.key === "Escape") {
            resetToWelcome();
        }
    }
</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="min-h-screen flex flex-col font-sans text-black">
    <Header
        projectName={appState.projectName}
        onBackToWelcome={resetToWelcome}
        onSave={() => appState.triggerSave()}
    />
    <main class="flex-1 overflow-hidden">
        {@render children()}
    </main>
</div>
