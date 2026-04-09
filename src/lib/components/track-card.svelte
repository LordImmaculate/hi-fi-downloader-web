<script lang="ts">
  import type { Album, Track } from "lucida/types";
  import * as Item from "$lib/components/ui/item";
  import { Button } from "$lib/components/ui/button";
  import { enhance } from "$app/forms";

  let { music }: { music: Track | Album } = $props();
  let artists = music.artists?.map((artist) => artist.name).join(", ");
</script>

<!-- <div class="round">
  <h2 class="text-2xl font-bold">{music.title}</h2>
  {#if "coverArtwork" in music && music.coverArtwork && music.coverArtwork.length > 0}
    <img src={music.coverArtwork[0].url} alt={music.title} />
  {/if}
</div> -->

<Item.Root variant="outline">
  <Item.Header>
    {#if "coverArtwork" in music && music.coverArtwork && music.coverArtwork.length > 0}
      <img
        class="mr-auto ml-auto h-max w-max rounded-md"
        src={music.coverArtwork[1].url}
        alt={music.title}
        width="128"
        height="128"
      />
    {/if}
  </Item.Header>
  <Item.Content>
    <Item.Title>{music.title}</Item.Title>
    <Item.Description>{artists}</Item.Description>
    <form method="POST" action="?/download" use:enhance>
      <input type="hidden" name="url" value={music.url} />
      <Button type="submit" variant="outline" size="sm">Download</Button>
    </form>
  </Item.Content>
</Item.Root>
