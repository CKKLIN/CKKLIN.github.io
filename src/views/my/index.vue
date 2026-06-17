<template>
    <div class="container">
        <div class="center">
            <div class="center-one">
                <div class="my-left">
                    <infoCard :userInfo="user" class="info-card" />
                </div>
                <div class="my-right">
                    <div class="right-one">
                        <div class="model-text">形象展示</div>
                        <model modelUrl="https://sky-lkc.oss-cn-beijing.aliyuncs.com/model/ikun2.glb"></model>
                    </div>
                </div>
            </div>
            <div class="center-two"></div>
        </div>
    </div>
</template>
<script setup>
import InfoCard from "@/components/info/infoCard/index.vue"
import model from "@/components/3DModel/index.vue"
import { ref } from "vue"



const user = ref({
    id: null,
    userName: '木二支',
    avatarUrl: 'https://sky-lkc.oss-cn-beijing.aliyuncs.com/pictures/ikun.jpg',
    title: 1223,
    look: 45654,
    signature: "钞人不会说不行",
    resources: 23432,
    createTime: "2022-01-01",
    level: 1,
    link: [
        { id: 1, name: "github", url: "https://github.com/CKKLIN" },
        { id: 2, name: "CSDN", url: "https://blog.csdn.net/weixin_56181202?spm=1000.2115.3001.5343" },
    ],
})
</script>
<style scoped>
.center-two {
    width: 100%;
    height: 100%;
    background: #e6e6e6;
    border-radius: var(--border-radius-card);
}

.model-text {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    /* margin-left: 20px; */
    position: absolute;
    /* left:5px; */
    font-family: "ZiHun144Hao-LangYuanTi-2";
    background-color: rgb(59, 54, 44);
    padding: 3px 5px 5px 5px;
    border-radius: var(--border-radius-card);
}

.right-one {
    width: 100%;
    height: 100%;
    background-color: #5f5f5f;
    /* border-radius: var(--border-radius-card); */
    position: relative;

    background: url('https://sky-lkc.oss-cn-beijing.aliyuncs.com/bj/bj10.jpg');
    background-size: cover;
    background-position: center;
    box-shadow: var(--color-card-shadow);
    border-radius: var(--border-radius-card);
    border: var(--color-card-border);
}

.container {
    width: 100%;
    height: 100%;
    overflow: auto;
    /* position: relative; */
    /* background-color: #9e8a8a; */
    background: url('https://sky-lkc.oss-cn-beijing.aliyuncs.com/bj/bj11.jpg');
    /* background-size: cover;
    background-position: center;   */
    /* background-size: cover; */
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.center {
    width: 50vw;
    height: 100%;
    /* background: #5f5f5f; */
    margin-top: 10vh;
    display: flex;
    flex-direction: column;
    gap: var(--gap);

}

.center-one {
    width: 100%;
    height: fit-content;
    /* background: #5f5f5f; */
    display: flex;
    flex-direction: row;
    gap: var(--gap);
}

.my-left {
    width: 35%;
    height: fit-content;
    /* background: #b93b3b; */
    display: flex;
    flex-direction: column;
}

.info-card {
    width: 100%;
    /* height: 50%; */
    box-shadow: var(--color-card-shadow);
    border-radius: var(--border-radius-card);
    border: var(--color-card-border);
    background: linear-gradient(rgba(14, 62, 134, 0), rgba(57, 158, 241, 0.692), rgb(57, 159, 241)), url('https://sky-lkc.oss-cn-beijing.aliyuncs.com/bj/bj4.jpeg');
    background-size: cover;
    background-position: center;
}

.my-right {
    width: 65%;
    height: 100%;
    /* background: #55a713; */
}
</style>