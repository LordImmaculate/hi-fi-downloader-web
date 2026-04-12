import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, PageServerLoadEvent } from "./$types";
import type { User } from "better-auth";

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
  if (!event.locals.user) return redirect(302, "/auth/signin");

  return { user: event.locals.user as User };
};
