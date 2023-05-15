<script lang="ts">
  import { goto } from '$app/navigation';

  const routes = [
    'customnode',
    'drag-n-drop',
    'edges',
    'overview',
    'stress',
    'subflows',
    'usesvelteflow',
    'validation'
  ];

  const onChange = (event: Event) => {
    const route = (event.target as HTMLSelectElement).value;
    goto(`/${route}`);
  };
</script>

<header>
  <div class="logo">Svelte Flow</div>
  <select on:change={onChange}>
    {#each routes as route}
      <option value={route}>{route}</option>
    {/each}
  </select>
</header>

<style>
  header {
    padding: 10px;
    border-bottom: 1px solid #eee;
    display: flex;
    font-weight: 700;
    align-items: center;
    color: #111;
  }

  .logo {
    margin-right: 1rem;
  }
</style>