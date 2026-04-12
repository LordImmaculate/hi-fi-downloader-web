import type { PageServerLoad, PageServerLoadEvent } from "./$types";

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
  const albumId = event.params.album;

  const res = await fetch(
    `${process.env.HIFI_BASE}/album/?id=${encodeURIComponent(albumId)}`
  );
  const json = (await res.json()) as TidalAlbumResponse;

  return { album: json.data };
};
