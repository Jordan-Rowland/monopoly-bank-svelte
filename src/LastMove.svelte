<script>

export let message;

</script>

<div on:click>
  <span>
    {message}
  </span>
</div>

<style>

div {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  width: 100%;
  top: 0;
  left: 0;
  padding: 15px 0;
  background-color: hsl(10, 50%, 70%);
  color: hsl(0, 0%, 99%);
  font-weight: 800;
}


@media only screen and (max-width: 640px) {
  div {
    /*font-size: 0.9rem;*/
  }
}


</style>
