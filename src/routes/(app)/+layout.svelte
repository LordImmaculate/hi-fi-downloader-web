<script lang="ts">
  import Header from "$lib/components/header.svelte";
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  const { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<Header {data} />
{@render children()}
