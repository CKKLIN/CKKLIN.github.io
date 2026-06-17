<template>
  <div class="comment-view">
    <div class="comments-section">
      <div class="top">
        |&ensp;{{ comments.length }}条留言
        <!-- <el-button class="top-button" @click="$emit('getComment', 'll', null)">最新</el-button>
        <el-button class="top-button" @click="$emit('getComment', null, 1)">最火</el-button> -->
      </div>
      <div class="comment" v-for="item in sortedComments" :key="item.id">
        <div class="comment-header">
          <img class="avatar" :src="item.imageUrl" alt="头像" @error="setDefaultImage($event)">
          <div class="comment-meta">
            <span class="username">{{ item.name }}</span>
            <br>
            <small class="date">{{ item.createTime }}</small>
          </div>
        </div>
        <div class="comment-body">{{ item.comment }}</div>
        <!-- <div class="comment-actions">
          <span class="like-count">{{ item.good }}</span>
          <div class="goodBox">
            <img v-if="item.isgood == false" style="width: 20px;height: 20px;" @click="$emit('isGood', item.id)"
              :src="goodIcon">
            <img v-else style="width: 20px;height: 20px;" @click="$emit('noGood', item.id)"
              :src="goodedIcon">
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  comments: {
    type: Array,
    default: () => []
  }
})

const sortedComments = computed(() =>
  [...props.comments].sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
)

defineEmits(['getComment', 'isGood', 'noGood'])

const setDefaultImage = (event) => {
  event.target.src = 'https://p3fx.kgimg.com/v2/fxuserlogo/eac9145ecd909b9606c4f8e5f3e936e7.jpg_200x200.jpg'
}
</script>

<style scoped>
.comment-view {
  width: 100%;
  height: auto;
  padding-bottom: 10px;
  background-color: var(--color-white);
}

.top {
  width: 50%;
  margin-bottom: 20px;
  color: rgb(87, 87, 87);
}

.comments-section {
  margin: 0 auto 30px auto;
  max-width: 800px;
  background-color: var(--color-white);
  padding: 20px 10px 0 10px;
  border-radius: 15px;
}

.comment {
  position: relative;
  margin-bottom: 10px;
  border-bottom: solid 1px rgba(0, 0, 0, 0.123);
}

.comment-header {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 10px;
}

.comment-meta {
  flex-grow: 1;
}

.username {
  font-size: 16px;
  font-weight: bold;
  color: rgb(221, 107, 13);
}

.date {
  color: #aaa;
}

.comment-body {
  margin-top: 15px;
  margin-left: 50px;
  line-height: 1.6;
  background-color: #1111110e;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
}

.comment-actions {
  position: absolute;
  top: 0;
  right: 0;
  color: #aaa;
  display: flex;
  flex-direction: row;
}

.like-count {
  font-size: 14px;
  vertical-align: middle;
  margin-right: 6px;
}

.top-button {
  background-color: #e06b0b91;
  border-style: none;
  box-shadow: -3px 3px 3px rgba(0, 0, 0, 0.32);
  width: 3em;
  height: 1.5em;
  color: aliceblue;
  margin-bottom: 5px;
}

.goodBox {
  position: relative;
  top: -4px;
  width: 30px;
  height: 30px;
}

.gooded {
  position: absolute;
  width: 42px;
  height: 42px;
  top: -11px;
  left: -11px;
}
</style>
