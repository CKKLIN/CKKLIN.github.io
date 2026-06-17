<template>
  <div class="home">
    <div class="home-top">
      <Header @path="handlePath" />
    </div>
    <div class="home-body">
      <router-view v-slot="{ Component }">
        <Transition name="slide" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Header from '@/layout/header.vue'

const router = useRouter()

const handlePath = (path) => {
  router.push(path)
}
</script>

<style scoped>
.home {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.home-top {
  width: 100%;
  height: fit-content;
  position: absolute;
  z-index: 999;
}

.home-body {
  overflow: hidden;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: rgb(179, 179, 179);
}

.home-footer {
  width: 100%;
  height: 100px;
  justify-content: flex-end;
  background-color: red;
}
</style>