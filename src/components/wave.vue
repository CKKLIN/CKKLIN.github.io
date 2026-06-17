<template>
  <div class="wave">
    <div class="image-container">
      <div class="image-wrapper">
        <img v-for="(_, i) in 2" :key="i" src="https://sky-lkc.oss-cn-beijing.aliyuncs.com/pictures/bannerWave1.png" alt="wave" />
      </div>
    </div>
    <div class="image-container">
      <div class="image-wrapper1">
        <img v-for="(_, i) in 2" :key="i" src="https://sky-lkc.oss-cn-beijing.aliyuncs.com/pictures/bannerWave2.png" alt="wave" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wave {
  position: relative;
  width: 100%;
  height: 100%;
}
.image-container {
  position: absolute;
  width: 100%;
  overflow: hidden;
  height: 100%;
}
.image-wrapper {
  display: flex;
  animation: slideLeft 16s linear infinite;
  width: auto;
  margin-top: 20px;
  height: 100%;
  min-width: 100%;
}
.image-wrapper1 {
  display: flex;
  animation: slideLeft 8s linear infinite;
  width: auto;
  height: 100%;
  min-width: 100%;
}
img {
  width: auto;
  height: 100%;
  min-width: 100%;
}
@keyframes slideLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
