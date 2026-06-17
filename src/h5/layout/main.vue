<template>
    <div class="main">
        <div class="body">

            <router-view></router-view>
        </div>
        <actionBar class="actionBar"></actionBar>
    </div>

</template>
<script setup>
import actionBar from '../layout/actionBar.vue'
import mainjing from '../mainjing/index.vue'
</script>
<style scoped>
.main {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* background: var(--color-h5-top); */
}

.body {
    width: 100%;
    height: calc(100% - 70px);
    overflow: auto;
    /* background-color: yellowgreen; */
}

.actionBar {
    width: 92%;
    height: 60px;
    border-radius: 40px;
    margin-bottom: 2px;
    /* background: rgba(255, 255, 255, 0.2); */
    backdrop-filter: blur(24px) saturate(200%);
    -webkit-backdrop-filter: blur(24px) saturate(200%);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.1),
        0 2px 8px rgba(0, 0, 0, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.5);
    position: relative;
    z-index: 10;
}
</style>