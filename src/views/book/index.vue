<template>
  <div class="container" ref="containerRef" @scroll="onScroll">
    <div class="top">
      <titleCard class="title"></titleCard>
      <Spiraly ref="spiralRef" class="Spiraly" :images="bookCovers"></Spiraly>
    </div>
    <div class="body">
      <div class="center">
        <card></card>

      </div>
      <div class="body-two">
        <titleCard class="body-two-title"></titleCard>
        <titleCard class="two-title"></titleCard>
        <cardAnimation :items="animationItems" :scroller="containerRef" trigger-start="top top" style="width: 100%;"
          trigger-end="bottom bottom" scroll-height="300vh" :converge-speed="0.15" sticky-top="0"
          container-height="100vh">
          <template #front="{ item }">
            <div class="card-cover">
              <img :src="item.cover" :alt="item.title" />
            </div>
            <div class="card-info">
              <h3 class="card-title">{{ item.title }}</h3>
              <p class="card-author">{{ item.author }}</p>
            </div>
          </template>
          <template #back="{ item }">
            <div class="card-back" :style="{ background: item.backColor || '#ffffff' }">
              <h3 class="card-title">{{ item.title }}</h3>
              <p class="card-author">{{ item.author }}</p>
              <p class="card-desc">{{ item.desc }}</p>
            </div>

          </template>
          <template #cover>
            <div class="cover">

              <!-- <titleCard class="body-two-title"></titleCard> -->
            </div>
          </template>
        </cardAnimation>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Spiraly from '@/components/3DSpiralGallery/index.vue'
import titleCard from '@/views/book/components/title/index.vue'
import card from '@/views/book/components/card/index.vue'
import cardAnimation from '@/components/cardAnimation/index.vue'
import { bookList3, getBookCovers } from '@/assets/linshi/data/data'

const bookCovers = getBookCovers(120)

const animationItems = bookList3.map(b => ({
  title: b.name,
  cover: b.cover,
  author: b.author,
  desc: b.introduction,
  backColor: b.backColor,
}))

const spiralRef = ref()
const containerRef = ref<HTMLElement>()

function onScroll(e: Event) {
  spiralRef.value?.onParentScroll((e.target as HTMLElement).scrollTop)
}
</script>
<style scoped>
.card-back {
  width: 100%;
  height: 450px;
  font-family: "ZiHun144Hao-LangYuanTi-2";
}

.cover {
  width: 100%;
  height: 450px;
  background-color: #000000;
  background: url('@/assets/bj/bj14.jpg');
  box-shadow: var(--color-card-shadow-top);
  /* box-shadow-top: 0; */
  /* background-size: cover;
    background-position: center;   */
  /* background-size: cover; */
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;
}

.body {
  position: relative;
  z-index: 1;
  width: 100%;
  height: fit-content;
  background: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  background: url('@/assets/bj/bj13.jpg');
  box-shadow: var(--color-card-shadow-top);
  /* box-shadow-top: 0; */
  /* background-size: cover;
    background-position: center;   */
  /* background-size: cover; */
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;
}

.center {
  width: 70%;
  height: fit-content;
  /* background: rgb(134, 134, 134); */
  padding: var(--padding-sm);
  margin-top: 30px;
  /* position: absolute; */
}

.body-two {
  /* background-color: rgba(0, 255, 255, 0.363); */
  margin-top: 30px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* position: absolute; */
  /* height: 500px;
  position: relative; */
}

.card-cover {
  width: 100%;
  height: 260px;
  overflow: hidden;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info {
  padding: 12px 14px;
  background-color: rgb(160, 160, 160);
  font-family: "ZiHun144Hao-LangYuanTi-2";
}

.card-title {
  margin: 0 0 6px;
  font-size: 16px;
  color: #fff;
  font-weight: 600;
}

.card-author {
  margin: 0;
  font-size: 13px;
  color: #080808;
}

.card-desc {
  font-size: 13px;
  color: #ccc;
  line-height: 1.6;
}


.container {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: rgb(53, 53, 53);
  position: relative;
}
.top {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  z-index: 0;
  /* background-color: #dddcdc67; */
  /* 背景图与渐变的叠加 */
  background: 
    linear-gradient(rgba(14, 62, 134, 0), rgba(54, 125, 184, 0.281), rgba(76, 153, 216, 0.507)), 
    url('@/assets/bj/bj13.jpg');
    
  /* 【核心修改】cover 表示拉伸覆盖整个容器区域；第一层渐变不需要平铺/拉伸，所以写 no-repeat */
  background-size: cover, cover; 
  
  /* 让背景图居中显示，避免被裁切到奇怪的位置 */
  background-position: center center; 
  
  /* 防止滚动时出现背景图边缘 */
  background-repeat: no-repeat, no-repeat; 
}

.title {
  width: 60%;
  height: fit-content;
  position: absolute;
  margin-top: 100px;
}

.body-two-title {
  width: 90%;
  height: fit-content;
  position: absolute;
  /* background-color: rgb(0, 255, 76); */
  /* margin-top: 100px; */
  /* font-size: 30px; */
  margin-top: 50px;
  font-size: 90px;
  /* font-weight: 100; */
  text-align: center;
  color: #161616;

  font-family: "RuiZiJiJiaHongHuangChaoJiLiang";
}

.two-title {
  margin-top: 750px;
  width: 13%;
  height: fit-content;
  position: absolute;
  /* background-color: rgb(0, 255, 76); */
  /* margin-top: 100px; */
  font-size: 25px;
  left: 7%;
  /* font-size: 90px; */
  /* font-weight: 100; */
  /* text-align: start; */
  color: #4c5ec5;

  font-family: "RuiZiJiJiaHongHuangChaoJiLiang";
}

.Spiraly {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
