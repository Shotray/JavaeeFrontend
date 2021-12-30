<template>
  <div class="content-center m-auto commodity-form bg-repeat" style="width: 100%">
    <div class="w-full m-auto content-center text-center">
      <div class="rounded-lg bg-blur">
        <CommodityForm></CommodityForm>
      </div>
    </div>
  </div>
</template>

<script>
import CommodityForm from "@/components/CommodityRelease/CommodityForm";

export default {
  name: "PublishCommodity",
  components: {CommodityForm}
}
</script>

<style scoped>

.commodity-form {
  height: 120%;
  /* background-image: linear-gradient(#5698c3, #d1c2d3); */
  /* background-image: linear-gradient(#3a353f, #505668); */
  @apply p-10;
}

.bg-blur {
  @apply p-10;
  display: inline-block;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.4);
  margin: auto;
}

.bg-repeat {
  background-image: linear-gradient(#5698c3, #d1c2d3);
  /* background-image: url('https://cdn.pixabay.com/photo/2014/12/15/15/36/cloth-569222_1280.jpg'); */
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}

</style>