<script lang="ts">
  import * as Item from "$lib/components/ui/item";
  import { Button } from "$lib/components/ui/button";
  import { enhance } from "$app/forms";
  import { toast } from "svelte-sonner";
  import { resolve } from "$app/paths";

  const { album }: { album: TidalAlbumWithArtists } = $props();
</script>

<!-- <div class="round">
  <h2 class="text-2xl font-bold">{music.title}</h2>
  {#if "coverArtwork" in music && music.coverArtwork && music.coverArtwork.length > 0}
    <img src={music.coverArtwork[0].url} alt={music.title} />
  {/if}
</div> -->

<Item.Root variant="outline">
  <Item.Header>
    {#if album.cover}
      <img
        class="mr-auto ml-auto h-max w-max rounded-md"
        src={`https://resources.tidal.com/images/${album.cover.replaceAll("-", "/")}/320x320.jpg`}
        alt={album.title}
        width="128"
        height="128"
      />
    {/if}
  </Item.Header>
  <Item.Content>
    <Item.Title
      ><a href={resolve(`/album/${album.id}`)}>{album.title}</a></Item.Title
    >
    <Item.Description
      >{album.artists.map((artist) => artist.name).join(", ")}</Item.Description
    >
    <form
      method="POST"
      action="?/download"
      use:enhance={() => {
        const t = toast.loading("Downloading...");
        return async ({ result, update }) => {
          await update();
          if (result.type === "success") {
            toast.success("Download started!", { id: t });
          } else {
            toast.error("Download failed.", { id: t });
          }
        };
      }}
    >
      <input type="hidden" name="id" value={album.id} />
      <Button type="submit" variant="outline" size="sm">Download</Button>
    </form>
  </Item.Content>
</Item.Root>
