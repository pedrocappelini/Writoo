<script lang="ts">
    import { appState } from "$lib/state.svelte";
    import {
        writeTextFile,
        readTextFile,
        readDir,
    } from "@tauri-apps/plugin-fs";
    import { join } from "@tauri-apps/api/path";

    let { content = $bindable("") } = $props<{ content?: string }>();

    let wordCount = $derived(
        content.trim() === "" ? 0 : content.trim().split(/\s+/).length,
    );

    async function saveCurrentFile() {
        if (appState.projectPath && appState.currentFile) {
            try {
                const filePath = await join(
                    appState.projectPath,
                    appState.currentFile,
                );
                await writeTextFile(filePath, content);
                appState.isDirty = false;
            } catch (error) {
                console.error("Failed to save file:", error);
            }
        }
    }

    // Set the global save trigger
    $effect(() => {
        appState.triggerSave = saveCurrentFile;
    });

    async function switchFile(fileName: string) {
        if (appState.projectPath) {
            try {
                const filePath = await join(appState.projectPath, fileName);
                const fileContent = await readTextFile(filePath);
                appState.currentFile = fileName;
                appState.content = fileContent;
                content = fileContent;
                appState.isDirty = false;
            } catch (error) {
                console.error("Failed to read file:", error);
            }
        }
    }

    async function createNewFile() {
        if (!appState.projectPath) return;

        const fileName = prompt("Enter file name (without .md extension):");
        if (!fileName) return;

        const fullFileName = fileName.endsWith(".md")
            ? fileName
            : `${fileName}.md`;

        try {
            const filePath = await join(appState.projectPath, fullFileName);
            await writeTextFile(filePath, "");

            // Refresh file list
            const entries = await readDir(appState.projectPath);
            appState.files = entries
                .filter((e) => e.name?.endsWith(".md"))
                .map((e) => e.name as string);

            await switchFile(fullFileName);
        } catch (error) {
            console.error("Failed to create file:", error);
            alert("Failed to create file. Check console for details.");
        }
    }

    function handleInput() {
        if (!appState.currentFile) return;
        appState.isDirty = true;
    }

    function handleKeyDown(event: KeyboardEvent) {
        if ((event.ctrlKey || event.metaKey) && event.key === "s") {
            event.preventDefault();
            saveCurrentFile();
        }
    }

    // Resizing logic
    let isResizing = $state(false);

    function startResizing(e: MouseEvent) {
        e.preventDefault();
        isResizing = true;
        document.body.classList.add("resizing");
    }

    function stopResizing() {
        isResizing = false;
        document.body.classList.remove("resizing");
    }

    function onMouseMove(event: MouseEvent) {
        if (!isResizing) return;
        const newWidth = event.clientX;
        if (newWidth > 150 && newWidth < 600) {
            appState.sidebarWidth = newWidth;
        }
    }
</script>

<svelte:window
    onkeydown={handleKeyDown}
    onmousemove={onMouseMove}
    onmouseup={stopResizing}
/>

<div class="flex h-[calc(100vh-2.5rem)] bg-white overflow-hidden">
    <!-- Sidebar -->
    <aside
        style="width: {appState.sidebarWidth}px"
        class="border-r border-gray-200 flex flex-col bg-gray-50 select-none relative"
    >
        <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
                <span
                    class="text-xs font-bold text-gray-400 uppercase tracking-wider overflow-hidden text-nowrap text-ellipsis"
                    title={appState.projectName}
                >
                    {appState.projectName}
                </span>
                <button
                    onclick={createNewFile}
                    class="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="New File"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto py-2">
            {#each appState.files as file}
                <button
                    onclick={() => switchFile(file)}
                    class="w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2
                        {appState.currentFile === file
                        ? 'bg-white text-black font-medium border-l-2 border-black'
                        : 'text-gray-600 hover:bg-gray-100'}"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-gray-400"
                    >
                        <path
                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                        ></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <span class="truncate text-black">{file}</span>
                </button>
            {/each}
            {#if appState.files.length === 0}
                <div class="px-4 py-2 text-xs text-gray-400 italic">
                    No .md files in project.
                </div>
            {/if}
        </div>

        <!-- Resize Handle -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            onmousedown={startResizing}
            class="absolute top-0 -right-0.5 w-1 h-full cursor-col-resize z-10 hover:bg-black/10 transition-colors"
        ></div>
    </aside>

    <!-- Main Editor -->
    <div class="relative flex-1 flex flex-col bg-white">
        <div class="flex-1 overflow-hidden flex flex-col">
            <div class="px-8 pt-4 text-xs font-mono text-gray-400 select-none">
                {appState.currentFile || "No file selected"}
                {appState.isDirty ? "*" : ""}
            </div>
            <textarea
                bind:value={content}
                oninput={handleInput}
                disabled={!appState.currentFile}
                placeholder={appState.currentFile
                    ? "Start writing..."
                    : "Create a new file in the sidebar to start writing."}
                class="flex-1 w-full p-8 text-lg leading-relaxed outline-none resize-none font-serif text-black disabled:bg-gray-50 disabled:text-gray-300"
                autofocus></textarea>
        </div>

        <div
            class="absolute bottom-4 right-4 px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs text-gray-500 font-mono shadow-sm select-none"
        >
            {wordCount} words
        </div>
    </div>
</div>

<style>
    :global(body.resizing) {
        cursor: col-resize;
        user-select: none;
    }
</style>
