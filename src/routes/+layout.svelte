<script lang="ts">
    import "../app.css";
    import Header from "$lib/components/Header.svelte";
    import { appState, resetToWelcome } from "$lib/state.svelte";

    let { children } = $props();
</script>

<div class="min-h-screen flex flex-col font-sans text-black">
    <Header
        projectName={appState.projectName}
        onBackToWelcome={resetToWelcome}
    />
    <main class="flex-1 overflow-hidden">
        {@render children()}
    </main>
</div>
