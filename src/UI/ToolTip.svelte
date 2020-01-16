<script>

export let message = "Click on a user's money to bankrupt";

</script>

<div class="tooltip">{message}</div>

<style>

.tooltip {
  position: relative;
  border-radius: 5px;
  border: 2px solid hsl(210, 31%, 80%);
  background-color: hsl(212, 33%, 89%);
  color: hsl(210, 22%, 49%);
  font-weight: 800;
  width: 95.5%;
  padding: 20px;
  margin: 0.35rem auto;
}

@media (max-width: 640px) {
  .tooltip {
    width: 72%;
  }
}


</style>
