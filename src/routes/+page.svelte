<script lang="ts">
    import Welcome from "$lib/scenes/Welcome.svelte";
    import Editor from "$lib/scenes/Editor.svelte";
    import { appState } from "$lib/state.svelte";
</script>

{#if appState.scene === "welcome"}
    <Welcome />
{:else if appState.scene === "editor"}
    <Editor bind:content={appState.content} />
{/if}
