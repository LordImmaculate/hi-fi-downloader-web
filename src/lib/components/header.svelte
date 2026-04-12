<script lang="ts">
  import { resolve } from "$app/paths";
  import { buttonVariants } from "./ui/button";
  import Modetoggle from "./modetoggle.svelte";
  import type { User } from "better-auth";

  type Data = {
    user: User | null;
    errors: number;
  };

  const { data }: { data: Data } = $props();
</script>

<header class="mx-4 flex items-center gap-4 py-4">
  <a href={resolve("/")}><h1 class="text-2xl font-bold">Hi-Fi Downloader</h1></a
  >
  <div class="ml-auto flex items-center gap-4">
    {#if data.errors > 0}
      <a class="text-destructive hover:underline" href={resolve("/errors")}
        >Errors: {data.errors}</a
      >
    {/if}
    <Modetoggle />
    {#if data.user}
      <img
        src={data.user.image ??
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fvectors%2Favatar-photo-placeholder-icon-design-vector-id1221380217%3Fk%3D20%26m%3D1221380217%26s%3D612x612%26w%3D0%26h%3DavdFJ5PNo-CSkbUZzQ0Xm8h3u5BovGfSNDrfRicPDfY%3D&f=1&nofb=1&ipt=dffb60d699734386f61c6039fde56ffa82e448b0dbcffaa3aff54ab966d00c78"}
        alt="User Avatar"
        class="size-8 rounded-full"
      />
    {:else}
      <a
        href={resolve("/auth/signin")}
        class={buttonVariants({ variant: "outline" })}>Sign In</a
      >
    {/if}
  </div>
</header>
