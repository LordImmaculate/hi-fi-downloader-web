import { redirect, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad, PageServerLoadEvent } from "./$types";
import { auth } from "$lib/server/auth";

export const load: PageServerLoad = (event: PageServerLoadEvent) => {
  if (event.locals.user) return redirect(302, "/");
};

export const actions: Actions = {
  signUpPassword: async (event) => {
    const formData = await event.request.formData();
    const name = formData.get("name")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    try {
      await auth.api.signUpEmail({
        body: { name, email, password }
      });
    } catch (e) {
      console.log(e);
      if (e instanceof Error)
        switch (e.message) {
          case "User already exists. Use another email.":
            return fail(400, { message: "Use another email." });
          case "Email and password sign up is not enabled":
            return fail(400, { message: "Sign up is not enabled" });
        }

      return fail(400, { message: "Sign-up failed" });
    }
  }
};
