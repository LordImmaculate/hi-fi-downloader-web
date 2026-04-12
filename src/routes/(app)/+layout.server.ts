import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, PageServerLoadEvent } from "./$types";
import type { User } from "better-auth";
import { downloadError } from "$lib/server/db/schema";
import { db } from "$lib/server/db";
import { count } from "drizzle-orm";

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
  if (!event.locals.user) return redirect(302, "/auth/signin");

  const errors = await db
    .select({ count: count(downloadError.id) })
    .from(downloadError);

  return { user: event.locals.user as User, errors: errors[0].count };
};
