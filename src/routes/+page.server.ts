import { lucida } from "$lib/lucida";
import type { Actions } from "./$types";

let queue = Array<string>();

export const actions: Actions = {
  search: async ({ request }) => {
    const data = await request.formData();
    const query = data.get("query") as string;
    const results = await lucida.search(query, 100);
    return { success: true, results };
  },
  download: async ({
    request
  }): Promise<{
    success: "default" | "success" | "info" | "warning" | "error" | "promise";
    message: string;
  }> => {
    const data = await request.formData();
    const url = data.get("url") as string;
    console.log("Download action triggered");
    const album = await lucida.getByUrl(url);
    for (const track of album.tracks) {
      if (!queue.includes(track.url)) {
        queue.push(track.url);
      }
    }
    processQueue();
    return {
      success: "success",
      message: "Download added to queue"
    };
  }
};

function processQueue() {
  if (queue.length === 0) return;
  const trackUrl = queue.shift()!;
  lucida
    .getByUrl(trackUrl)
    .then(async (e) => {
      const streamResponse = await e.getStream();
      const response = new Response(streamResponse.stream);
      await Bun.write("./download.flac", response);
    })
    .catch((error) => {
      console.error(`Error downloading ${trackUrl}:`, error);
    })
    .finally(() => processQueue());
}
