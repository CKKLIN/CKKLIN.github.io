<template>
    <div class="infoBox">
        <div class="info-avatar" v-if="userInfo.avatarUrl">
            <img style="width: 100%; height: 100%;border-radius: 50%;" :src="userInfo.avatarUrl" />
            <div class="level">
                <span class="level-num">LV{{ userInfo.level }} &ensp;</span>
                <span class="level-text">{{ currentLevelName }}</span>
            </div>
        </div>
        <div class="info-name" v-if="userInfo.userName">{{ userInfo.userName }}</div>
        <div class="info-signature" v-if="userInfo.signature">
            <span class="signature-text">赛博纹身:</span>{{ userInfo.signature }}
        </div>
        <div class="info-createTime" v-if="userInfo.createTime">
            <span class="createTime-text">入坑时间:</span>{{ userInfo.createTime }}
        </div>
        <div class="info-link" v-if="userInfo.link && userInfo.link.length">
            <div class="link-item" v-for="item in userInfo.link">
                <span class="link-text">{{ item.name }}:&ensp;</span><a :href="item.url" target="_blank">{{ item.url
                    }}</a>
            </div>
        </div>
        <div class="info-toji">
            <div class="info-toji-box" v-if="userInfo.title">
                <div class="info-toji-top">
                    <img src='https://sky-lkc.oss-cn-beijing.aliyuncs.com/icon/title.svg' class="tojiIcon"></img>
                    <div class="toji-text">文章</div>
                </div>
                <div class="info-toji-num">{{ userInfo.title }}</div>

            </div>
            <div class="info-toji-box" v-if="userInfo.resources">
                <div class="info-toji-top">
                    <img src='https://sky-lkc.oss-cn-beijing.aliyuncs.com/icon/ziyuan.svg' class="tojiIcon"></img>
                    <div class="toji-text">资源</div>
                </div>
                <div class="info-toji-num">{{ userInfo.resources }}</div>

            </div>
            <div class="info-toji-box" v-if="userInfo.look">
                <div class="info-toji-top">
                    <img src='https://sky-lkc.oss-cn-beijing.aliyuncs.com/icon/hot.svg' class="tojiIcon"></img>
                    <div class="toji-text">访客量</div>
                </div>
                <div class="info-toji-num">{{ userInfo.look }}</div>

            </div>

        </div>
    </div>

</template>
<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
    userInfo: {
        type: Object,
        default: () => ({})
    }
})
const levelList = ref([
    { id: 1, level: '咸鱼干' },
    { id: 2, level: '翻个面' },
    { id: 3, level: '撒点盐' },
    { id: 4, level: '下锅煎' },
    { id: 5, level: '真香警告' },
])
const currentLevelName = computed(() => {
    const item = levelList.value.find(item => item.id === props.userInfo.level);
    return item ? item.level : '未知等级';
});
</script>
<style scoped>
.link-text {
    font-weight: bold;
    font-size: 12px;
    color: rgb(8, 8, 8);
}

.info-link {
    margin-top: 10px;
    max-width: 80%;
    padding: 0 var(--padding-ssm);
    font-size: 12px;
    line-height: 1;
    color: rgb(255, 255, 255);
    font-family: "ZiHun144Hao-LangYuanTi-2";
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 6px;
    /* overflow: hidden; */
    align-self: flex-start;
    margin-left: 10%;
}

.link-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    white-space: nowrap;
    /* overflow: hidden; */
    /* text-overflow: ellipsis; */
    max-width: 100%;
}

.link-item a {
    color: rgb(255, 255, 255);
}

.info-avatar {
    width: 120px;
    aspect-ratio: 1 / 1;
    /* 强制高度与宽度相等 */
    border-radius: 50%;
    background-color: antiquewhite;
    /* position: absolute; */
    /* overflow: hidden; */
    margin-top: 10px;
    /* left: 35px; */
    /* top: -50px; */
    /* box-shadow: -5px 5px 12px rgba(0, 0, 0, 0.555); */
    border: 2px solid #b1b0b0;
    position: relative;
    z-index: 10;
}

.level {
    position: absolute;
    bottom: -10px;
    right: 19%;
    background-color: rgb(235, 180, 31);
    border-radius: 5px;
    padding: 3px 3px 4px 3px;
    font-size: 12px;
    line-height: 1;
    color: rgb(255, 255, 255);
    font-family: "ZiHun144Hao-LangYuanTi-2";
    z-index: 11;
}

.info-signature {
    margin-top: 10px;
    max-width: 80%;
    /* background-color: #f50505; */
    padding: 0 var(--padding-ssm);
    font-size: 12px;
    line-height: 1;
    color: rgb(255, 255, 255);
    font-family: "ZiHun144Hao-LangYuanTi-2";
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    overflow: hidden;
    align-self: flex-start;
    margin-left: 10%;
}

.signature-text {
    font-weight: bold;
    font-size: 12px;
    color: rgb(8, 8, 8);
}

.info-createTime {
    margin-top: 10px;
    max-width: 80%;
    /* background-color: #f50505; */
    padding: 0 var(--padding-ssm);
    font-size: 12px;
    line-height: 1;
    color: rgb(255, 255, 255);
    font-family: "ZiHun144Hao-LangYuanTi-2";
    align-self: flex-start;
    margin-left: 10%;
}

.createTime-text {
    font-weight: bold;
    font-size: 12px;
    color: rgb(8, 8, 8);
}

.infoBox {
    width: 100%;
    /* background-color: rgb(78, 133, 133); */
    /* padding: 8px; */
    /* float: right; */
    /* border-radius: 8px; */
    display: flex;
    flex-direction: column;
    position: relative;
    align-items: center;
    /* gap: 4px; */
overflow: hidden;
    padding: var(--padding-card);
}

.info-name {
    width: fit-content;
    height: 24px;
    max-height: 24px;
    white-space: nowrap;
    overflow: hidden;
    font-weight: bold;
    text-overflow: ellipsis;
    font-family: YuWoErYanNiZuiKeAi-2;
    font-size: 23px;
    line-height: 24px;
    margin-top: 10px;
}

.info-toji {
    width: 100%;
    height: 50px;
    /* background-color: rgba(155, 14, 14, 0.685); */
    display: flex;
    flex-direction: row;
    gap: var(--gap);
    align-items: center;
    justify-content: center;
    font-family: YuWoErYanNiZuiKeAi-2;
    margin-top: 15px;
}

.info-toji-box {
    width: fit-content;
    height: 50px;
    /* background-color: rgba(101, 155, 14, 0.685); */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.info-toji-top {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    /* background-color:red; */
    width: fit-content;
}

.tojiIcon {
    height: 20px;
    aspect-ratio: 1;
    margin-right: 5px;
}

.toji-text {
    font-size: 12px;
}
</style>