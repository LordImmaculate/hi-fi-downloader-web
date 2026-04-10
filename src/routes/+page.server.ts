import type { Actions } from "@sveltejs/kit";
import { writeFlacTags } from "flac-tagger";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { auth } from "$lib/server/auth";

const HIFI_BASE = process.env.HIFI_BASE!;
const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR!;

const qualities = ["HI_RES_LOSSLESS", "LOSSLESS"];
const queue = Array<{
  audioUrl: string;
  track: TidalTrack;
  imageUrl: string;
}>();

type User = typeof auth.$Infer.Session.user;

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) return redirect(302, "/auth/signin");

  const query = event.url.searchParams.get("query");

  if (!query) return { user: event.locals.user as User, albums: null };

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

  return { user: event.locals.user as User, albums };
};

export const actions: Actions = {
  download: async ({ request }) => {
    const data = await request.formData();
    const id = data.get("id") as string;

    // Fetch album to get all track IDs
    const albumRes = await fetch(`${HIFI_BASE}/album/?id=${id}`);
    const albumJson = (await albumRes.json()) as TidalAlbumResponse;
    const tracks = albumJson.data.items
      .filter((i) => i.type === "track")
      .map((i) => i.item);

    const failedTracks: string[] = [];

    // Download each track

    try {
      await Promise.all(
        tracks.map(async (track) => {
          const res = await fetch(
            `${HIFI_BASE}/track/?id=${track.id}&quality=HI_RES_LOSSLESS`
          );
          const json = (await res.json()) as TidalTrackResponse;
          if (json.data.manifestMimeType === "application/dash+xml") {
            console.error(`Unsupported manifest type for ${track.title}`);
            failedTracks.push(track.title);
            return;
          }
          const manifest = JSON.parse(atob(json.data.manifest));
          const audioUrl = manifest.urls[0];

          queue.push({
            audioUrl,
            track,
            imageUrl: `https://resources.tidal.com/images/${albumJson.data.cover.replaceAll("-", "/")}/1280x1280.jpg`
          });
        })
      );
    } catch (err) {
      console.error(`Error downloading ${albumJson.data.title}:`, err);
      error(500, "Failed to download album");
    }

    await processQueue();

    return { success: true };
  }
};

async function processQueue() {
  if (queue.length === 0) return;
  const { audioUrl, track, imageUrl } = queue.shift()!;
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
          new Uint8Array(await (await fetch(imageUrl)).arrayBuffer())
        ),
        mime: "image/jpeg",
        description: `${track.album.title} cover`
      }
    },
    `${DOWNLOAD_DIR}/${track.artist.name}/${track.album.title}/${filename}`
  );

  console.log(`Tagged ${track.title}`);

  if (queue.length > 0) await processQueue();
  else console.log("All downloads complete");
}
