<script lang="ts">
  import Header from "$lib/components/header.svelte";
  const { children, data } = $props();
</script>

<Header {data} />
{@render children()}
