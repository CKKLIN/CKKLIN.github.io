<template>
  <div class="main">
    <div class="double">
      <doubleText></doubleText>
    </div>
    <div class="bigBox">
      <div class="body">
        <div class="body-left">
          <div class="body-left-one">
            <infoCard :userInfo="user" />
          </div>

          <div class="body-left-two">
            <TWSidebar :article="article" title="推荐标题"></TWSidebar>
          </div>
        </div>
        <div class="body-right">
          <div class="body-right-one">
            <createTime />
          </div>
          <div class="body-right-two">

            <img class="hornIcon" :src=hornIcon />
            <div class="hornMsg">公告！！！！！！</div>
          </div>
          <div class="body-right-three">

            <loading />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import wave from '@/components/wave.vue'
import player from '@/assets/icon/player.png'
import pause from '@/assets/icon/pause.png'
import ikun from '@/assets/picture/ikun.jpg'
import useCounter from '@/stores/pinia'
import hornIcon from '@/assets/icon/horn.svg'
import infoCard from '@/components/info/infoCard/index.vue'
import createTime from '@/views/home/components/createTime/index.vue'
import loading from '@/views/home/components/loading/index.vue'
import TWSidebar from '@/components/sidebar/TWSidebar/index.vue'
import doubleText from '@/components/doubleText/index.vue'

const counterStore = useCounter()
const isPlay = ref(true)
const audioElement = ref()
const fullText = '欢迎来到我的博客!'
const displayedText = ref('')
let typeIndex = 0

const user = ref({
  id: null,
  userName: '木二支',
  avatarUrl: ikun,
  title: 1223,
  look: 45654,
  resources: 234,
})

const postList = ref(Array.from({ length: 5 }, () => ({
  title: '文章标题',
  summary: '这是一段文章摘要内容...',
  date: '2026-05-28',
})))

// TODO: 替换为实际音乐文件
const musicSrc = ''

const article = ref([
  {
    id: 1,
    title: '2026年全球科技峰会在沪开幕，AI与量子计算成焦点议题',
    time: '2026-05-28',
    img: 'https://picsum.photos/800/600?random=1'
  },
  {
    id: 2,
    title: '新能源汽车市场竞争白热化：特斯拉降价引发连锁反应',
    time: '2026-05-25',
    img: 'https://picsum.photos/800/600?random=2'
  },
  {
    id: 3,
    title: '广州迎来强降雨季，市民出行需注意防范内涝与交通安全',
    time: '2026-05-20',
    img: 'https://picsum.photos/800/600?random=3'
  },
  {
    id: 4,
    title: '揭秘“过于先进不便展示”的反导画面背后的国防科技力量',
    time: '2026-05-18',
    img: 'https://picsum.photos/800/600?random=4'
  },
  //   {
  //     id: 5,
  //     title: '92号汽油价格调整：有望重返“7元时代”缓解车主压力',
  //     time: '2026-05-15',
  //     img: 'https://picsum.photos/800/600?random=5'
  //   },
  //   {
  //     id: 6,
  //     title: '智利复活节岛遭遇山火，珍贵石像群受损引发全球关注',
  //     time: '2026-05-10',
  //     img: 'https://picsum.photos/800/600?random=6'
  //   },
  //   {
  //     id: 7,
  //     title: '美国芯片巨头一夜暴跌近14%，全球半导体市场震荡',
  //     time: '2026-05-05',
  //     img: 'https://picsum.photos/800/600?random=7'
  //   },
  //   {
  //     id: 8,
  //     title: '央行公开市场净回笼5940亿元，货币政策走向引热议',
  //     time: '2026-05-01',
  //     img: 'https://picsum.photos/800/600?random=8'
  //   },
]);

const typeWriter = () => {
  if (typeIndex < fullText.length) {
    displayedText.value += fullText.charAt(typeIndex)
    typeIndex++
    setTimeout(typeWriter, 250)
  }
}

const togglePlay = () => {
  isPlay.value = !isPlay.value
  if (isPlay.value) {
    audioElement.value?.play()
  } else {
    audioElement.value?.pause()
  }
}

onMounted(() => {
  typeWriter()
})
</script>

<style scoped>
.main {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  position: relative;
  animation: slideDown 1.5s ease-in-out forwards;
}

.double {
  /* position: fixed; */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: yellowgreen;
  z-index: 0;
  cursor: default; 
}

.bigBox {
  position: relative;
  width: 100%;
  height: fit-content;
  z-index: 1;
  
  display: flex;
  flex-direction: column;
  /* padding-top: 100vh; */
  background-color: #ce6d1352;
}

@keyframes slideDown {
  from {
    background-position: center -60px;
  }

  to {
    background-position: center 0px;
  }
}

.welcome {
  max-width: 300px;
  height: fit-content;
  background-color: rgba(160, 9, 9, 0.945);
  position: fixed;
  margin-left: calc(50% - 150px);
  margin-top: -8%;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  font-family: 'huawenxingkai';
  font-size: larger;
  padding-right: 35px;
}

.music {
  width: 50px;
  height: 50px;
  cursor: pointer;
  /* background-color: rgba(9, 151, 233, 0.425); */
  position: absolute;
  border-radius: 50%;
  top: -15px;
  right: -15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.music-spin {
  width: 100%;
  height: 100%;
  animation: music 2s linear infinite;
}

@keyframes music {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}



.top {
  width: 100%;
  height: 150px;
}

.body {
  width: 100%;
  height: fit-content;
  background-color: var(--color-white);
  /* background-color:red; */
  position: relative;
  display: flex;
  flex-direction: row;
  gap: var(--gap);
  /* align-items:center; */
  justify-content: center;
}

.body-left {
  width: 18%;
  height: fit-content;
  /* margin: 0 0 10px 30px; */
  /* top: -20px; */
  /* padding: 15px; */
}

.body-left-one {
  width: 100%;
  /* height: 85px; */
  background-color: var(--color-card-bg);
  border-radius: var(--border-radius-card);
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background: url(@/assets/bj/bj7.jpg) no-repeat center center / cover;
  background: linear-gradient(to top, red, rgba(255, 255, 0, 0)); */
  background: linear-gradient(rgba(14, 62, 134, 0), rgba(57, 158, 241, 0.692), rgb(57, 159, 241)), url('@/assets/bj/bj4.jpeg');
  background-size: cover;
  background-position: center;
}

.body-left-two {
  width: 100%;
  /* height: 600px; */
  background-color: rgba(255, 255, 255, 0.774);
  /* padding: var(--padding-ssm); */
  margin-top: 15px;
  box-shadow: var(--color-card-shadow);
  border-radius: var(--border-radius-card);
  border: var(--color-card-border);
}

.body-right {
  width: 72%;
  height: fit-content;
  /* margin-left: 15px; */
  display: flex;
  gap: 15px;
  flex-direction: column;
}

.body-right-one {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  /* background-color: var(--color-card-bg); */
  font-family: "YuWoErYanNiZuiKeAi-2";
  font-size: 18px;

  margin-bottom: 15px;
}

.hornIcon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.body-right-two {
  display: flex;
  flex-direction: row;
  /* justify-content:center; */
  align-items: center;
  width: 100%;
  height: 40px;
  /* padding: var(--padding-card); */
  border-radius: 8px;
  background-color: var(--color-card-bg);
  border: 1px dashed #ce6d13;
  /* gap: var(--gap); */
  padding: 0px 10px 0 10px;
  line-height: 1;
}
</style>
