import { redirect } from "@sveltejs/kit";
import type { User } from "better-auth";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) return redirect(302, "/auth/signin");

  const albumId = event.params.album;

  const res = await fetch(
    `${process.env.HIFI_BASE}/album/?id=${encodeURIComponent(albumId)}`
  );
  const json = (await res.json()) as TidalAlbumResponse;

  return { user: event.locals.user as User, album: json.data };
};
