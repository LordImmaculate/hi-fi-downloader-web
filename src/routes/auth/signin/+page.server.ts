import { redirect, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { auth } from "$lib/server/auth";

export const load: PageServerLoad = (event) => {
  if (event.locals.user) {
    return redirect(302, "/");
  }
};

export const actions: Actions = {
  signInSocial: async (event) => {
    const formData = await event.request.formData();
    const provider = formData.get("provider")?.toString() ?? "github";
    const callbackURL = formData.get("callbackURL")?.toString() ?? "/";

    try {
      const result = await auth.api.signInSocial({
        body: {
          provider: provider as "github",
          callbackURL
        }
      });

      if (result.url) {
        return redirect(302, result.url);
      }

      return fail(400, { message: "Social sign-in failed" });
    } catch {
      return fail(400, { message: "Social sign-in failed" });
    }
  },
  signInPassword: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    try {
      const result = await auth.api.signInEmail({
        body: { email, password }
      });

      if (result.user) {
        return redirect(302, "/");
      }
    } catch (e) {
      console.log(e);
      if (e instanceof Error && e.message.includes("Invalid email or password"))
        return fail(400, { message: e.message });

      return fail(400, { message: "Sign-in failed" });
    }
  }
};
