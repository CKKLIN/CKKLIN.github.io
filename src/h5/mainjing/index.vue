<template>
    <div class="mainjing">
        <button class="capsule-btn" @click="lookContent('vue')">VUE</button>
        <button class="capsule-btn" @click="lookContent('uniapp')">UNIAPP</button>
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
.mainjing {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

.capsule-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 40px;
    border: none;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(12px) saturate(150%);
    -webkit-backdrop-filter: blur(12px) saturate(150%);
    color: #333;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 2px;
    box-shadow:var(--color-card-shadow-one);
    cursor: pointer;
    transition: all 0.3s ease;
}

.capsule-btn:active {
    transform: scale(0.95);
}
</style>