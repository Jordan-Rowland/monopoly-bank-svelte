<script>

</script>

<div id="black-drop" on:click></div>

<style>

#black-drop {
  position: fixed;
  z-index: 1;
  background-color: hsla(0, 0%, 0%, .4);
  top: 0;
  left: 0;
  width: 400vw;
  height: 400vh;
}

@media (max-width: 640px) {

  #black-drop {
    display: none;
  }

}

</style>
