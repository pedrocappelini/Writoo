<script lang="ts">
    import { appState } from "$lib/state.svelte";
    import { ask, open } from "@tauri-apps/plugin-dialog";
    import {
        writeTextFile,
        mkdir,
        readDir,
        readTextFile,
    } from "@tauri-apps/plugin-fs";
    import { documentDir, join } from "@tauri-apps/api/path";

    let showNamingInput = $state(false);
    let newProjectName = $state("");

    async function handleCreate() {
        if (!newProjectName.trim()) return;

        try {
            const defaultDir = await documentDir();
            const selectedPath = await open({
                directory: true,
                multiple: false,
                defaultPath: defaultDir,
                title: "Select Project Location",
            });

            if (selectedPath && typeof selectedPath === "string") {
                const projectFolderName = newProjectName.trim();
                const projectPath = await join(selectedPath, projectFolderName);

                // Create project directory
                await mkdir(projectPath);

                // Create welcome.md
                const welcomeFilePath = await join(projectPath, "welcome.md");
                const welcomeContent = `# Welcome to ${projectFolderName}\n\nThis is your new project. Start writing!`;
                await writeTextFile(welcomeFilePath, welcomeContent);

                // Update app state
                appState.projectName = projectFolderName;
                appState.projectPath = projectPath;
                appState.files = ["welcome.md"];
                appState.currentFile = "welcome.md";
                appState.content = welcomeContent;
                appState.scene = "editor";
                appState.isDirty = false;
            }
        } catch (error) {
            console.error("Failed to create project:", error);
            alert(`Failed to create project: ${error}`);
        }
    }

    async function handleNewProjectClick() {
        showNamingInput = true;
    }

    async function handleOpenProjectClick() {
        try {
            const selectedPath = await open({
                directory: true,
                multiple: false,
                title: "Open Project Folder",
            });

            if (selectedPath && typeof selectedPath === "string") {
                const entries = await readDir(selectedPath);
                const mdFiles = entries
                    .filter((e) => e.name?.endsWith(".md"))
                    .map((e) => e.name as string);

                appState.projectName =
                    selectedPath.split(/[/\\]/).pop() || "Untitled Project";
                appState.projectPath = selectedPath;
                appState.files = mdFiles;

                if (mdFiles.length > 0) {
                    // Try to find welcome.md or just take the first one
                    const initialFile = mdFiles.includes("welcome.md")
                        ? "welcome.md"
                        : mdFiles[0];
                    appState.currentFile = initialFile;

                    const filePath = await join(selectedPath, initialFile);
                    appState.content = await readTextFile(filePath);
                } else {
                    // Empty project or folder with no .md files
                    appState.currentFile = null;
                    appState.content = "";
                }

                appState.scene = "editor";
                appState.isDirty = false;
            }
        } catch (error) {
            console.error("Failed to open project:", error);
            alert(`Failed to open project: ${error}`);
        }
    }

    function handleReturnToProject() {
        if (appState.lastActiveProject) {
            appState.projectName = appState.lastActiveProject.projectName;
            appState.projectPath = appState.lastActiveProject.projectPath;
            appState.files = appState.lastActiveProject.files;
            appState.currentFile = appState.lastActiveProject.currentFile;
            appState.content = appState.lastActiveProject.content;
            appState.scene = "editor";
        }
    }
</script>

<div
    class="flex flex-col items-center justify-center min-h-[calc(100vh-2.5rem)] bg-white p-8 relative"
>
    <h1 class="text-4xl font-bold mb-12 tracking-tighter text-black">
        WELCOME TO WRITOO
    </h1>

    {#if !showNamingInput}
        <div class="flex gap-8">
            <button
                onclick={handleNewProjectClick}
                class="w-48 h-48 border-2 border-gray-200 rounded-lg flex flex-col items-center justify-center gap-4 hover:border-black hover:bg-gray-50 transition-all group"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-gray-400 group-hover:text-black"
                >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span class="font-medium text-gray-600 group-hover:text-black"
                    >New Project</span
                >
            </button>

            <button
                onclick={handleOpenProjectClick}
                class="w-48 h-48 border-2 border-gray-200 rounded-lg flex flex-col items-center justify-center gap-4 hover:border-black hover:bg-gray-50 transition-all group"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-gray-400 group-hover:text-black"
                >
                    <path
                        d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                    ></path>
                </svg>
                <span class="font-medium text-gray-600 group-hover:text-black"
                    >Open Project</span
                >
            </button>
        </div>
    {:else}
        <div class="w-full max-w-sm flex flex-col gap-4">
            <input
                type="text"
                bind:value={newProjectName}
                placeholder="Project Name"
                class="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-black outline-none transition-colors text-black"
                onkeydown={(e) => e.key === "Enter" && handleCreate()}
                autofocus
            />
            <div class="flex gap-2">
                <button
                    onclick={handleCreate}
                    class="flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                    Create
                </button>
                <button
                    onclick={() => (showNamingInput = false)}
                    class="flex-1 border-2 border-gray-200 py-2 rounded-md hover:bg-gray-50 transition-colors text-black"
                >
                    Cancel
                </button>
            </div>
        </div>
    {/if}

    {#if appState.lastActiveProject}
        <button
            onclick={handleReturnToProject}
            class="absolute bottom-8 left-8 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
            aria-label="Return to project"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
        </button>
    {/if}
</div>
