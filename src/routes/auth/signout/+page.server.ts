import { auth } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  signOut: async () => {
    await auth.api.signOut();
    return redirect(302, "/auth/signin");
  }
};
