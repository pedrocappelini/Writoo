<script lang="ts">
    import Welcome from "$lib/scenes/Welcome.svelte";
    import Editor from "$lib/scenes/Editor.svelte";
    import { appState } from "$lib/state.svelte";

    function handleNewProject(name: string) {
        appState.projectName = name;
        appState.content = "";
        appState.scene = "editor";
    }

    function handleOpenProject() {
        // For now, simulate opening a project
        // In a real app, this would use tauri-plugin-dialog
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".md";
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                appState.projectName = file.name;
                appState.content = await file.text();
                appState.scene = "editor";
            }
        };
        input.click();
    }
</script>

{#if appState.scene === "welcome"}
    <Welcome
        onNewProject={handleNewProject}
        onOpenProject={handleOpenProject}
    />
{:else if appState.scene === "editor"}
    <Editor bind:content={appState.content} />
{/if}
