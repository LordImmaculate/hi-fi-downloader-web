<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import Mountains from "$lib/assets/mountains.jpg";
  import { Input } from "$lib/components/ui/input";
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";
  import { toast } from "svelte-sonner";

  const { form }: { form: ActionData } = $props();

  let error = $state(false);

  $effect(() => {
    if (form?.message) {
      toast.error(form.message);
      error = true;
    }
  });
</script>

<div class="flex h-screen items-center justify-center">
  <div class="flex h-150 w-225 overflow-hidden rounded-2xl shadow-xl">
    <div class="flex w-1/2 flex-col justify-center bg-card px-12">
      <h1 class="mb-5 text-center text-2xl font-semibold">Create Account</h1>
      <form action="?/signUpPassword" use:enhance method="post">
        <Input
          name="name"
          type="text"
          placeholder="Name"
          class="mb-4"
          required
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          class="mb-4"
          required
        />
        <Input
          name="password"
          type="password"
          minlength={8}
          maxlength={128}
          placeholder="Password"
          class="mb-6"
          required
          color={error ? "destructive" : undefined}
        />
        <Button
          class="w-full"
          type="submit"
          variant={error ? "destructive" : "default"}
        >
          Sign Up</Button
        >
      </form>
    </div>

    <div class="w-1/2">
      <img src={Mountains} alt="Mountains" class="h-full w-full object-cover" />
    </div>
  </div>
</div>
