<template>
    <div class="container" ref="containerRef">
        <cardAnimation :items="animationItems" :scroller="containerRef">
            <template #front="{ item }">
                <div class="card-cover">
                    <img :src="item.cover" :alt="item.title" class="card-cover-img" />
                </div>
                <div class="card-info">
                    <h3 class="card-title">{{ item.title }}</h3>
                    <p class="card-author">{{ item.author }}</p>
                </div>
            </template>
            <template #back="{ item }">
                <h3 class="card-title">{{ item.title }}</h3>
                <p class="card-author">{{ item.author }}</p>
                <p class="card-desc">{{ item.desc }}</p>
            </template>
        </cardAnimation>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import cardAnimation from '@/components/cardAnimation/index.vue'
import { getFeaturedBooksAPI } from '@/api/bookApi'
import { loadBooks } from '@/utils/dataLoader'

const containerRef = ref()
const animationItems = ref([] as any[])

onMounted(async () => {
  try {
    // 优先使用 MySQL API
    const featured = await getFeaturedBooksAPI()
    animationItems.value = featured.map((b) => ({
      title: b.name,
      cover: b.cover,
      author: b.author,
      desc: b.introduction,
    }))
  } catch {
    // 回退到静态数据
    const { bookList3 } = await loadBooks()
    animationItems.value = bookList3.map(b => ({
        title: b.name,
        cover: b.cover,
        author: b.author,
        desc: b.introduction,
    }))
  }
})
</script>
<style scoped>
.card-cover {
    width: 100%;
    height: 300px;
    /* object-fit: cover; */
}
.card-cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.container {
    width: 100%;
    height: 100%;
    overflow: auto;
}
</style>