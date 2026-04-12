<script lang="ts">
  import * as Table from "$lib/components/ui/table/index.js";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();
</script>

<div class="mx-20 my-10">
  <h1 class="mb-4 text-center text-2xl font-bold">Download Errors</h1>
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-25">Title</Table.Head>
        <Table.Head>Message</Table.Head>
        <Table.Head class="text-end">Time</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each data.errors as error (error.id)}
        <Table.Row>
          <Table.Cell class="font-medium">{error.title}</Table.Cell>
          <Table.Cell>{error.message}</Table.Cell>
          <Table.Cell class="text-end"
            >{new Date(error.timestamp).toLocaleString()}</Table.Cell
          >
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
