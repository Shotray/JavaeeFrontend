<template>
    <div class="block">
    <el-carousel trigger="click">
      <el-carousel-item v-for="item in urls" :key="item">
        <div class="imgdiv">
          <img class="window-img" :src="item">
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
  
</template>

<script>
export default {
  name: "SlideWindow",
  setup() {
    return {
      urls: [
        'https://i.loli.net/2021/07/16/rogqKDI5cje61G9.jpg',
        'https://i.loli.net/2021/07/16/uXqSM8hLipg4VJc.jpg',
        'https://i.loli.net/2021/07/16/XEstVhdWxqPf8Mg.jpg'
      ]
    }
  }
}
</script>

<style scoped>

.el-carousel {
  text-align: center;
  align-content: center;
  height: 50%;

}

.window {
  text-align: center;
  align-content: center;
  justify-content: center;
}

.imgdiv {
  display: flex;
  justify-content: center;
  align-items: center;
}

.window-img {
  position: relative;
  /* width: 100%; */

  max-width: 100%;
  max-height: 100%;
}
</style>