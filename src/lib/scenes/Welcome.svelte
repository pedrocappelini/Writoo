<script lang="ts">
    let { onNewProject, onOpenProject } = $props<{
        onNewProject: (name: string) => void;
        onOpenProject: () => void;
    }>();

    let showNamingInput = $state(false);
    let newProjectName = $state("");

    function handleCreate() {
        if (newProjectName.trim()) {
            onNewProject(newProjectName.trim());
        }
    }
</script>

<div
    class="flex flex-col items-center justify-center min-h-[calc(100vh-2.5rem)] bg-white p-8"
>
    <h1 class="text-4xl font-bold mb-12 tracking-tighter">WELCOME TO WRITOO</h1>

    {#if !showNamingInput}
        <div class="flex gap-8">
            <button
                onclick={() => (showNamingInput = true)}
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
                onclick={onOpenProject}
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
                class="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-black outline-none transition-colors"
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
                    class="flex-1 border-2 border-gray-200 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    {/if}
</div>
