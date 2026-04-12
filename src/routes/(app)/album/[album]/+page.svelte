<script lang="ts">
  import type { PageServerData } from "./$types";

  const { data }: { data: PageServerData } = $props();
</script>

{#if data.album}
  <div class="mx-20 my-10">
    <h1 class="mb-4 text-2xl font-bold">Album</h1>
    <p>{data.album.title}</p>
    <ul>
      {#each data.album.items as track (track.item.id)}
        <li>{track.item.title}</li>
      {/each}
    </ul>
  </div>
{:else}
  <p>Loading...</p>
{/if}
