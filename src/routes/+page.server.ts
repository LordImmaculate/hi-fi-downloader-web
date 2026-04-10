import type { Actions } from "@sveltejs/kit";
import { writeFlacTags } from "flac-tagger";
import { error } from "@sveltejs/kit";

// +page.server.ts
const HIFI_BASE = process.env.HIFI_BASE!;
const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR!;

export const actions: Actions = {
  search: async ({ request }) => {
    const data = await request.formData();
    const query = data.get("query") as string;
    const res = await fetch(
      `${HIFI_BASE}/search/?s=${encodeURIComponent(query)}`
    );
    const json = (await res.json()) as TidalSearchResponse;

    const seen = new Set<number>();
    const albums = json.data.items
      .filter((track) => {
        if (seen.has(track.album.id)) return false;
        seen.add(track.album.id);
        return true;
      })
      .map((track) => ({
        ...track.album,
        artists: track.artists
      }));

    return { albums };
  },

  download: async ({ request }) => {
    const data = await request.formData();
    const id = data.get("id") as string;

    // Fetch album to get all track IDs
    const albumRes = await fetch(`${HIFI_BASE}/album/?id=${id}`);
    const albumJson = (await albumRes.json()) as TidalAlbumResponse;
    const tracks = albumJson.data.items
      .filter((i) => i.type === "track")
      .map((i) => i.item);

    console.log(`Starting download of ${albumJson.data.title}`);

    // Download each track
    Promise.all(
      tracks.map(async (track) => {
        const res = await fetch(
          `${HIFI_BASE}/track/?id=${track.id}&quality=HI_RES_LOSSLESS`
        );
        const json = (await res.json()) as TidalTrackResponse;
        const manifest = JSON.parse(atob(json.data.manifest));
        const audioUrl = manifest.urls[0];
        const stream = await fetch(audioUrl);
        const buffer = await stream.arrayBuffer();
        const filename = `${track.trackNumber} - ${track.title.replace(/[/\\:*?"<>|]/g, "_")}.flac`;
        await Bun.write(
          `${DOWNLOAD_DIR}/${track.artist.name}/${track.album.title}/${filename}`,
          buffer
        );

        console.log(`Downloaded ${track.title}`);

        await writeFlacTags(
          {
            tagMap: {
              title: track.title,
              artist: track.artists.map((a) => a.name).join(", "),
              album: track.album.title,
              tracknumber: track.trackNumber.toString()
            },
            picture: {
              buffer: Buffer.from(
                new Uint8Array(
                  await (
                    await fetch(
                      `https://resources.tidal.com/images/${albumJson.data.cover.replaceAll("-", "/")}/1280x1280.jpg`
                    )
                  ).arrayBuffer()
                )
              ),
              mime: "image/jpeg",
              description: `${track.album.title} cover`
            }
          },
          `${DOWNLOAD_DIR}/${track.artist.name}/${track.album.title}/${filename}`
        );

        console.log(`Tagged ${track.title}`);
      })
    )
      .then(() => console.log(`Done downloading ${albumJson.data.title}`))
      .catch((err) => {
        console.error(`Error downloading ${albumJson.data.title}:`, err);
        error(500, "Failed to download album");
      });

    return { success: true };
  }
};
