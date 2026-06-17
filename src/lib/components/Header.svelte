<script lang="ts">
    let { projectName = "", onBackToWelcome } = $props<{
        projectName?: string;
        onBackToWelcome: () => void;
    }>();
</script>

<header
    class="flex items-center h-10 px-4 border-b border-gray-200 bg-white select-none"
>
    <button
        onclick={onBackToWelcome}
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

    {#if projectName}
        <span class="ml-4 text-sm font-medium text-gray-700">{projectName}</span
        >
    {/if}
</header>
