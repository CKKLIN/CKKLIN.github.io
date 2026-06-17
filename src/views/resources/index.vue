<template>
    <div class="container">
        <div class="center-card">
            <memoCard :headers="headers">
                <template #body-0>
                    <zoomCard :list="cardList.filter(c => c.label === 1)" showDownload />
                </template>
                <template #body-1>
                    <zoomCard :list="cardList.filter(c => c.label === 2)" showLink />
                </template>
                <template #body-2>
                    <zoomCard :list="cardList.filter(c => c.label === 3)" showDownload />
                </template>
                <template #body-3>
                    <zoomCard :list="cardList.filter(c => c.label === 4)" showDownload />
                </template>
            </memoCard>
        </div>
    </div>
</template>
<script lang="ts" setup>
import memoCard from '@/components/card/memoCard/index.vue'
import zoomCard from '@/components/card/zoomCard/index.vue'
import { ref } from 'vue'
import resourceData from '@/assets/linshi/data/resources.json'

const headers = ref(resourceData.headers)
const cardList = resourceData.cards
</script>
<style scoped>
.container {
    width: 100%;
    height: 100%;
    /* background-color: rgb(167, 73, 73); */
    display: flex;
    justify-content: center;
    /* align-items: center; */
    background: url('https://sky-lkc.oss-cn-beijing.aliyuncs.com/bj/bj22.jpg');
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    overflow-y: auto;
    padding-bottom:30px;
    margin-bottom: 30px;
}

.center-card {
    margin-top: 100px;
    /* padding-bottom:300px;
    margin-bottom: 300px; */
    width: 70%;
    min-width: 745.5px;
    /* height: fit-content; */
    /* background-color: #4b7424; */
    /* border-radius: var(--border-radius-card); */
    /* overflow: hidden; */
}
</style>