<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { enhance } from "$app/forms";
  import TrackCard from "$lib/components/track-card.svelte";
  import * as Item from "$lib/components/ui/item";
  import { toast } from "svelte-sonner";
  import Header from "$lib/components/header.svelte";
  import type { PageServerData } from "./$types";

  const { form, data } = $props<{ form?: FormData; data?: PageServerData }>();
  let searchResults = $state<TidalAlbumWithArtists[] | null>(null);

  $effect(() => {
    if (form?.albums) {
      searchResults = form.albums;
    }
    if (form?.promise) {
      toast.promise(form.promise, {
        loading: "Downloading...",
        success: "Download complete!",
        error: "Download failed."
      });
    }
  });
</script>

<Header {data} />
<div class="mx-20 my-10">
  <form method="POST" use:enhance action="?/search" class="flex flex-row gap-4">
    <Input type="text" name="query" placeholder="Search..." />
    <Button type="submit">Submit</Button>
  </form>

  {#if searchResults}
    <!-- {#each Object.entries(searchResults) as [key, result] (key)} -->
    <h2 class="text-2xl font-bold">Search Results</h2>

    <!-- <span class="text-xl font-bold">Tracks</span>
      <Item.Group class="grid grid-flow-col">
        {#each result.tracks as track (track.id)}
          <TrackCard music={track} />
        {/each}</Item.Group
      > -->

    <span class="mb-4 text-xl font-bold">Albums</span>
    <Item.Group class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
      {#each searchResults as album (album.id)}
        <TrackCard {album} />
      {/each}</Item.Group
    >
    <!-- {/each} -->
  {/if}
</div>
