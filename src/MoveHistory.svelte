<script>

export let moveHistory;

$: console.log(moveHistory);


</script>

<div class="container">
  <div class="moves" on:click>
    {#if moveHistory}
      {#each moveHistory as move}
        <div class="move">
          {move}
        </div>
      {/each}
    {/if}
  </div>
</div>


<style>

.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.moves {
  position: fixed;
  /*position: absolute;*/
  width: 60%;
  top: 60px;
  background-color: hsla(280, 100%, 50%, 0.7);
  color: hsl(280, 70%, 30%);
  font-weight: 800;
  padding: 0.5rem;
}

.move {
  padding: 0.2rem 0;
}

</style>
