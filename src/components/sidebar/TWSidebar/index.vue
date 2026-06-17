<template>
    <div class="container">
        <div class="header">
            <img class="icon" :src=tuijianIcon />
            <div class="text">{{ title }}</div>
        </div>
        <div class="body">
            <div class="article" v-for="(item,id) in article" :key="id">
                <div class="article-one">
                    <img class="ar-img" :src="item.img">
                    <div class="ar-text">{{ item.title }}</div>
                </div>
                <div class="article-two">
                    <img class="timeIcon" :src="calendar">
                    <div class="ar-time">{{ item.time }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";
import tuijianIcon from "@/assets/icon/tuijian.svg"
import calendar from "@/assets/icon/calendar.svg"

defineProps({
    title: {
        type: String,
        default: '暂无标题'
    },
    article: {
        type: Array,
        default: () => []
    }
})
</script>
<style scoped>
.container {
    width: 100%;
    height: 100%;
    /* background-color: #f50505; */
    display: flex;
    flex-direction: column;
}

.header {
    width: 100%;
    height: 38px;
    /* background-color: #f505053d; */
    display: flex;
    flex-direction: row;
    /* justify-content:center; */
    align-items: center;
    border-bottom: var(--color-line);
    padding: var(--padding-card);
}

.icon {
    width: 20px;
    height: 20px;
}

.text {
    font-size: 16px;
    font-family: "ZiHun144Hao-LangYuanTi-2";
    margin-left: 8px;
}
.body {
    width: 100%;
    height: 100%;
    /* background-color: #f50505; */
    display: flex;
    flex-direction: column;
    padding: var(--padding-sm);
    gap:var(--padding-ssm)
}
.article{
    width: 100%;
    height: fit-content;
    /* background-color: #f505053d; */
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.3s ease;
    cursor: pointer;
        border-radius: var(--border-radius-card);
}
.article:hover {
    transform: var(--transform-sm);
    box-shadow: var(--color-card-shadow);
}
.article-one{
    width: 100%;
    height: 100%;
    /* background-color: #f50505; */
    display: flex;
    flex-direction: row;
    /* align-items: center; */
}
.ar-img{
    width: 45%;
    max-height: 90px;
    min-height: 40px;
    /* background-color: #f50505; */
    border-radius: 4px;
    display: block;
}
.ar-text{
    width: 55%;
    height: 100%;
    /* background-color: #f50505; */
    padding:0 var(--padding-ssm);
    font-size: 14px;
    line-height: 1;
    color: var(--color-ar-text);
    font-family: "ZiHun144Hao-LangYuanTi-2";
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
}
.article-two{
    width: 100%;
    /* height: 100%; */
    height: 15px;
    /* background-color: #1df505; */
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 10px;
    font-family: "ZiHun144Hao-LangYuanTi-2";
    color: var(--color-card-time);
}
.timeIcon{
    height: 100%;
    aspect-ratio:1;
    margin-right: 5px;
}
</style>