<script lang="ts">
  type AlbumPageData = {
    album?: TidalAlbumResponse["data"];
  };

  const { data }: { data: AlbumPageData } = $props();
</script>

{#if data.album}
  <div class="mx-20 my-10">
    <h1 class="mb-4 text-2xl font-bold">Album</h1>
    <p>{data.album.title}</p>
  </div>
{:else}
  <p>Loading...</p>
{/if}
