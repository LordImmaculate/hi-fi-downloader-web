<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import Mountains from "$lib/assets/mountains.jpg";
  import { Input } from "$lib/components/ui/input";
  import { authClient } from "$lib/auth-client";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { Separator } from "@/lib/components/ui/separator";
  import Github from "@/lib/components/icons/github.svelte";

  let name = $state("");
  let email = $state("");
  let password = $state("");

  let error = $state<string | null>(null);
  let loading = $state(false);

  async function signUpWithGitHub() {
    error = null;
    loading = true;

    const data = await authClient.signIn.social({
      provider: "github"
    });

    loading = false;

    if (data.error) error = data.error.message ?? "Something went wrong";
  }

  async function signUpPassword() {
    error = null;
    loading = true;

    const data = await authClient.signUp.email({
      name,
      email,
      password
    });

    loading = false;

    if (data.error) {
      error = data.error.message ?? "Something went wrong";
      return;
    }

    goto(resolve("/"));
  }
</script>

<div class="flex h-screen items-center justify-center">
  <div class="flex h-150 w-225 overflow-hidden rounded-2xl shadow-xl">
    <div class="flex w-1/2 flex-col justify-center bg-card px-12">
      <h1 class="mb-3 text-center text-2xl font-semibold">Welcome</h1>
      <h2 class="mb-4 text-center text-xl font-semibold">Sign up with</h2>
      <Button class="mb-4 w-full" onclick={signUpWithGitHub}
        ><Github /> GitHub</Button
      >
      <span class="mb-1 text-center text-sm text-muted-foreground"> or </span>
      <Separator class="mb-4" />
      <form onsubmit={signUpPassword}>
        <Input
          type="text"
          placeholder="Name"
          class="mb-4"
          required
          bind:value={name}
        />
        <Input
          type="email"
          placeholder="Email"
          class="mb-4"
          required
          bind:value={email}
        />
        <Input
          type="password"
          placeholder="Password"
          class="mb-6"
          required
          bind:value={password}
        />
        <Button class="mb-1 w-full" disabled={loading} type="submit"
          >Sign In</Button
        >
        <span class="ml-1 text-sm text-muted-foreground"
          >Already have an account? <a
            href={resolve("/auth/signin")}
            class="hover:underline">Sign in</a
          ></span
        >
        <p class="mt-2 min-h-6 text-center text-red-500">
          {error}
        </p>
      </form>
    </div>

    <div class="w-1/2">
      <img src={Mountains} alt="Mountains" class="h-full w-full object-cover" />
    </div>
  </div>
</div>
