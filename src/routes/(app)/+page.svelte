<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import TrackCard from "$lib/components/track-card.svelte";
  import * as Item from "$lib/components/ui/item";
  import { toast } from "svelte-sonner";
  import type { PageServerData } from "./$types";
  import { page } from "$app/state";

  const { form, data } = $props<{ form?: FormData; data?: PageServerData }>();

  let query = $derived(page.url.searchParams.get("query") ?? "");

  $effect(() => {
    if (form?.promise) {
      toast.promise(form.promise, {
        loading: "Downloading...",
        success: "Download complete!",
        error: "Download failed."
      });
    }
  });
</script>

<div class="mx-20 my-10">
  <form method="get" class="mb-2 flex flex-row gap-4">
    <Input
      type="text"
      name="query"
      placeholder="Search..."
      bind:value={query}
    />
    <Button type="submit">Submit</Button>
  </form>

  {#if data.albums}
    <!-- <span class="text-xl font-bold">Tracks</span>
      <Item.Group class="grid grid-flow-col">
        {#each result.tracks as track (track.id)}
          <TrackCard music={track} />
        {/each}</Item.Group
      > -->

    <h1 class="mb-4 text-2xl font-bold">Albums</h1>
    <Item.Group class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
      {#each data.albums as album (album.id)}
        <TrackCard {album} />
      {/each}</Item.Group
    >
    <!-- {/each} -->
  {/if}
</div>
