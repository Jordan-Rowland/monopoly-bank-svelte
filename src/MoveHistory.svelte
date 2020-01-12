<script>

export let moveHistory;

$: console.log(moveHistory);


</script>

<div class="container">
  <div class="moves" on:click>
    <ul>
      {#if moveHistory}
        {#each moveHistory as move}
          <div class="move">
            <li>
              {move}
            </li>
          </div>
        {/each}
      {/if}
    </ul>
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
  width: 60%;
  top: 60px;
  background-color: hsla(215, 100%, 50%, 0.7);
  color: hsl(215, 70%, 50%);
  font-weight: 800;
  padding: 0.5rem;
}

.move {
  padding: 0.2rem 0;
}

@media (max-width: 640px) {
  .moves {
    /*font-size: 0.9rem;*/
    background-color: hsla(215, 100%, 50%, 0.85);
    color: hsl(215, 70%, 90%);
    width: 80%;
  }
}

</style>
