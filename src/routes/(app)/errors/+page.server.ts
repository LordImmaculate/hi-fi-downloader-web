import { db } from "$lib/server/db";
import { downloadError } from "$lib/server/db/schema";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const errors = await db.select().from(downloadError);

  return { errors };
};
