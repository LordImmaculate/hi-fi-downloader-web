import { redirect, fail, isRedirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad, PageServerLoadEvent } from "./$types";
import { auth } from "$lib/server/auth";

export const load: PageServerLoad = (event: PageServerLoadEvent) => {
  if (event.locals.user) return redirect(302, "/");
};

export const actions: Actions = {
  signInPassword: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    try {
      const result = await auth.api.signInEmail({
        body: { email, password }
      });

      if (result.user) return redirect(302, "/");
    } catch (e) {
      if (isRedirect(e)) throw e;
      if (e instanceof Error && e.message.includes("Invalid email or password"))
        return fail(400, { message: e.message });

      return fail(400, { message: "Sign-in failed" });
    }
  }
};
