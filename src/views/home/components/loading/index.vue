<template>
    <div class="container">
        <div class="gif">
            <img class="img" src="https://sky-lkc.oss-cn-beijing.aliyuncs.com/gif/loading6.gif">
        </div>
        <div class="gif">
            <img class="img" src="https://sky-lkc.oss-cn-beijing.aliyuncs.com/gif/loading2.gif">
        </div>
        <div class="gif">
            <img class="img" src="https://sky-lkc.oss-cn-beijing.aliyuncs.com/gif/loading3.gif">
        </div>
        <div class="gif">
            <img class="img" src="https://sky-lkc.oss-cn-beijing.aliyuncs.com/gif/loading4.gif">
        </div>
        <div class="gif">
            <img class="img" src="https://sky-lkc.oss-cn-beijing.aliyuncs.com/gif/loading5.gif">
        </div>
        <div class="gif">
            <img class="img" src="https://sky-lkc.oss-cn-beijing.aliyuncs.com/gif/loading1.gif">
        </div>
    </div>
    </template>
    <!-- <script setup lang="ts">
</script> -->
<style scoped > 
.container{
    
    width:100%;
    height:200px;
    /* background-color:red; */
    display:flex;
    flex-direction:row;
    /* flex:1; */
}
.gif{
    flex: 1;
}
.img{
    width: 100%;
    object-fit: contain;
}
img{
    /* height:fit-content; */
    /* aspect-ratio:1/1; */
}
</style>