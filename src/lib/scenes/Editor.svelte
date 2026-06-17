<script lang="ts">
    let { content = $bindable("") } = $props<{ content?: string }>();

    let wordCount = $derived(
        content.trim() === "" ? 0 : content.trim().split(/\s+/).length,
    );
</script>

<div class="relative flex flex-col h-[calc(100vh-2.5rem)] bg-white">
    <textarea
        bind:value={content}
        placeholder="Start writing..."
        class="flex-1 w-full p-8 text-lg leading-relaxed outline-none resize-none font-serif"
        autofocus></textarea>

    <div
        class="absolute bottom-4 right-4 px-3 py-1 bg-gray-100 border border-gray-200 rounded text-xs text-gray-500 font-mono shadow-sm"
    >
        {wordCount} words
    </div>
</div>
