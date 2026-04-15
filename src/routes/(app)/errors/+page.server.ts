import { db } from "$lib/server/db";
import { downloadError } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async () => {
  const errors = await db.select().from(downloadError);

  return { errors };
};

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const id = formData.get("id") as string;
    if (!id) return error(400, "No ID provided");
    await db.delete(downloadError).where(eq(downloadError.id, id)).execute();
    return "Error removed";
  }
};
