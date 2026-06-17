<template>
    <div class="mainjing">
        <!-- 内容包裹层：控制具体的排列方式 -->
        <div class="button-grid">
            <button class="capsule-btn" @click="lookContent('vue')">Vue</button>
            <button class="capsule-btn" @click="lookContent('uniapp')">Uni-app</button>
            <button class="capsule-btn" @click="lookContent('react')">React</button>
            <button class="capsule-btn" @click="lookContent('微信小程序')">微信小程序</button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const lookContent = (category) => {
    router.push({ path: '/mianjingListh5', query: { category } })
}
</script>

<style scoped>
/* 1. 外层容器：负责把内容推到屏幕正中间 */
.mainjing {
    width: 100%;
    height: 100vh; /* 确保占满全屏高度 */
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center;     /* 垂直居中 */
    background-color: #f5f7fa; /* 可选：加个背景色方便看效果 */
}

/* 2. 内部网格：负责两列布局和间距 */
.button-grid {
    display: grid;
    /* 定义两列，每列宽度相等 (1fr) */
    grid-template-columns: repeat(2, 1fr);
    /* 关键：设置行间距和列间距 */
    gap: 20px;
    width: 80%;      /* 限制整体宽度，防止在大屏上太宽 */
    max-width: 400px; /* 限制最大宽度，保证美观 */
}

/* 3. 按钮样式：恢复胶囊形状 */
.capsule-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 0; /* 固定高度，让文字垂直居中 */
    border: none;
    border-radius: 999px; /* 胶囊圆角 */
    background: rgba(255, 255, 255, 0.8);
    color: #333;
    font-size: 16px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap; /* 防止文字换行 */
}

.capsule-btn:active {
    transform: scale(0.95);
    background: #fff;
}
</style>