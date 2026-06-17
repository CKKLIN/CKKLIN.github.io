<template>
  <div class="login-register">
    <div class="contain" :class="{ register: !isLogin }">
      <div class="big-box" :class="{ active: isLogin }">
        <div class="big-contain" key="bigContainLogin" v-if="isLogin"  style="background-position: 80vw 80vh;"
          :style="{ backgroundImage: `url('https://sky-lkc.oss-cn-beijing.aliyuncs.com/bj/bj5.jpg'`, backgroundSize: '100vw 100vh'}">
          <el-form :model="loginForm" label-width="auto" class="login" ref="loginFormRef" :rules="loginRules">
            <div class="btitle">用户登录</div>
            <el-form-item style="width: 40%;" prop="account" label-width="0">
              <el-input v-model.trim="loginForm.account" placeholder="请输入账号" :prefix-icon="User" />
            </el-form-item>
            <el-form-item style="width: 40%;" prop="password" label-width="0">
              <el-input v-model.trim="loginForm.password" placeholder="请输入密码" :prefix-icon="Lock" />
            </el-form-item>
            <el-form-item style="width: 40%;" prop="captcha" label-width="0">
              <el-input v-model.trim="loginForm.captcha" placeholder="验证码" @keyup.enter="handleLogin(loginFormRef)"
                style="width: 50%;" />
              <img :src="captcha" style="width: calc(50% - 4px); height: 32px; margin-left: 4px; border-radius: 4px; cursor: pointer"
                @click="getCaptcha()" />
            </el-form-item>
            <el-form-item style="width: 40%;">
              <el-radio-group v-model.number="loginForm.state">
                <el-radio :value="1">用户</el-radio>
                <el-radio :value="0">管理员</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-button type="primary" @click="handleLogin(loginFormRef)" class="menu">登录</el-button>
          </el-form>
        </div>

        <div class="big-contain" key="bigContainRegister" v-else  style="background-position: 53vw 80vh;"
          :style="{ backgroundImage: `url('https://sky-lkc.oss-cn-beijing.aliyuncs.com/bj/bj4.jpeg')`, backgroundSize: '100vw 100vh' }">
          <el-form :model="registForm" label-width="auto" class="regist" ref="registFormRef" :rules="registRules">
            <div class="retitle">注册</div>
            <el-form-item style="width: 40%;" prop="account">
              <el-input v-model.number="registForm.account" placeholder="请输入账号" :prefix-icon="User" />
            </el-form-item>
            <el-form-item style="width: 40%;" prop="name">
              <el-input v-model="registForm.name" placeholder="请输入姓名" :prefix-icon="User" />
            </el-form-item>
            <el-form-item style="width: 40%;" prop="phone">
              <el-input v-model="registForm.phone" placeholder="请输入手机号" :prefix-icon="Iphone" />
            </el-form-item>
            <el-form-item style="width: 40%;" prop="password">
              <el-input v-model="registForm.password" placeholder="请输入密码" :prefix-icon="Lock" type="password" />
            </el-form-item>
            <el-form-item style="width: 40%;" prop="checkPassword">
              <el-input v-model="registForm.checkPassword" placeholder="请再次输入密码" :prefix-icon="Lock" type="password" />
            </el-form-item>
            <el-form-item prop="state">
              <el-radio-group v-model="registForm.state">
                <el-radio :value="1">用户</el-radio>
                <el-radio :value="0">管理员</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-button type="primary" @click="handleRegist(registFormRef)" class="menu">注册</el-button>
          </el-form>
        </div>
      </div>

      <div class="small-box" :class="{ active: isLogin }">
        <div class="small-contain" key="smallContainRegister" v-if="isLogin"  style="background-position: 50vw 80vh;"
          :style="{ backgroundImage: `url('https://sky-lkc.oss-cn-beijing.aliyuncs.com/bj/bj1.jpg')`, backgroundSize: '100vw 100vh' }">
          <div class="stitle">欢迎回来!</div>
          <p class="scontent">请登录你的账户</p>
          <button class="sbutton" @click="changeType">注册</button>
        </div>
        <div class="small-contain" key="smallContainLogin" v-else  style="background-position: 80vw 80vh;"
          :style="{ backgroundImage: `url('https://sky-lkc.oss-cn-beijing.aliyuncs.com/bj/bj4.jpeg')`, backgroundSize: '100vw 100vh' }">
          <div class="stitle">
            <span>欢迎使用</span>
            <!-- <span>erzhi-blog</span> -->
          </div>
          <p class="scontent">开始注册</p>
          <button class="sbutton" @click="changeType">登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock, Iphone } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { registAPI, getCaptchaAPI } from '@/api/login'
import { useTokenStore } from '@/stores/token'
import useCounter from '@/stores/pinia'

useCounter()
const router = useRouter()
useTokenStore()
const isLogin = ref(true)
const captcha = ref()
const loginPassword = ref()
const registAccount = ref()
const loginFormRef = ref<FormInstance>()
const registFormRef = ref<FormInstance>()

const loginForm = reactive({
  account: '',
  password: '',
  state: 1,
  captcha: '',
})

const registForm = reactive({
  account: '',
  name: '',
  state: 1,
  phone: '',
  createTime: '',
  sex: 1,
  imageUrl: '',
  password: '',
  checkPassword: '',
})

const resetForms = () => {
  loginForm.account = ''
  loginForm.password = ''
  loginForm.state = 1
  loginForm.captcha = ''
  registForm.account = ''
  registForm.name = ''
  registForm.state = 1
  registForm.phone = ''
  registForm.createTime = ''
  registForm.sex = 1
  registForm.imageUrl = ''
  registForm.password = ''
  registForm.checkPassword = ''
}

const changeType = () => {
  isLogin.value = !isLogin.value
  resetForms()
}

const handleLogin = async (_formEl: FormInstance | undefined) => {
  // if (!formEl) return
  // await formEl.validate(async (valid) => {
  //   if (valid) {
  //     const result = await loginAPI(loginForm)
  //     if (result.data.code === 200) {
  //       tokenStore.setToken(result.data.data)
  //       counterStore.jwt = result.data.data
        ElMessage.success('登录成功')
        router.push({ path: '/home' })
  //     } else {
  //       loginPassword.value = result.data.msg
  //       formEl.validate(() => {})
  //     }
  //   }
  // })
}

const handleRegist = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      const now = new Date()
      const pad = (n: number) => String(n).padStart(2, '0')
      registForm.createTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

      const result = await registAPI(registForm)
      if (result.data.code === 200) {
        ElMessage.success('注册成功，请返回登录')
        isLogin.value = !isLogin.value
      } else {
        registAccount.value = result.data.msg
        formEl.validate()
      }
    }
  })
}

const getCaptcha = async () => {
  const result = await getCaptchaAPI()
  captcha.value = result.data.data
}

// 登录校验规则
const loginRules = reactive<FormRules<typeof loginForm>>({
  account: [{
    validator: (_rule: any, value: any, callback: any) => {
      if (!value) return callback(new Error('请输入账号'))
      if (!/^\d+$/.test(value)) return callback(new Error('请输入纯数字账号'))
      if (loginPassword.value === '账号或密码错误') return callback(new Error('账号或密码错误'))
      callback()
    }, trigger: 'blur'
  }],
  password: [{
    validator: (_rule: any, value: any, callback: any) => {
      if (!value) return callback(new Error('请输入密码'))
      if (loginPassword.value === '账号或密码错误') return callback(new Error('账号或密码错误'))
      callback()
    }, trigger: 'blur'
  }],
  captcha: [{
    validator: (_rule: any, value: any, callback: any) => {
      if (!value) return callback(new Error('请输入验证码'))
      if (loginPassword.value === '验证码错误') return callback(new Error('验证码错误'))
      callback()
    }, trigger: 'blur'
  }],
})

// 注册校验规则
const registRules = reactive<FormRules<typeof registForm>>({
  account: [{
    validator: (_rule: any, value: any, callback: any) => {
      if (!value) return callback(new Error('请输入账号'))
      if (!/^\d+$/.test(value)) return callback(new Error('请输入纯数字账号'))
      if (registAccount.value === '该账号已存在，请换一个') return callback(new Error(registAccount.value))
      callback()
    }, trigger: 'blur'
  }],
  name: [{
    validator: (_rule: any, value: any, callback: any) => {
      if (!value) return callback(new Error('请输入姓名'))
      callback()
    }, trigger: 'blur'
  }],
  phone: [{
    validator: (_rule: any, value: any, callback: any) => {
      if (!value) return callback(new Error('请输入手机号'))
      callback()
    }, trigger: 'blur'
  }],
  password: [{
    validator: (_rule: any, value: any, callback: any) => {
      if (!value) return callback(new Error('请输入密码'))
      callback()
    }, trigger: 'blur'
  }],
  checkPassword: [{
    validator: (_rule: any, value: any, callback: any) => {
      if (!value) return callback(new Error('请再次输入密码'))
      if (value !== registForm.password) return callback(new Error('两次密码输入不一致'))
      callback()
    }, trigger: 'blur'
  }],
})

onMounted(() => {
  getCaptcha()
})
</script>

<style scoped>
.login-register {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-image: url('https://sky-lkc.oss-cn-beijing.aliyuncs.com/bj/bj1.jpg');
  background-size: 100vw 100vh;
  background-position: center;
}

.contain {
  width: 60%;
  height: 60%;
  min-width: 760px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
}

.contain::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: calc(50% + 38px);
  height: calc(100% - 0.7px);
  box-shadow: -28px 28px 25px rgba(0, 0, 0, 0.801);
  pointer-events: none;
  border-radius: 20px;
  transition: all 1s;
}

.contain.register::after {
  left: auto;
  right: 0;
  box-shadow: 28px 28px 25px rgba(0, 0, 0, 0.801);
}

.big-box {
  width: 55%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 45%;
  transition: all 1s;
}

.big-box.active {
  left: 0;
}

.big-contain {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
}

.btitle {
  font-size: 1.5em;
  font-weight: bold;
  color: #f8f8f8;
  text-align: center;
  padding-bottom: 10%;
}

.login, .regist {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.retitle {
  font-size: 1.5em;
  font-weight: bold;
  color: #ffffff;
  padding-bottom: 2%;
}

.small-box {
  width: 50%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: all 1s;
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
}

.small-box.active {
  left: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
  transform: translateX(-100%);
}

.small-contain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 200px;
  border-radius: 20px;
}

.stitle {
  font-size: 1.5em;
  font-weight: bold;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scontent {
  font-size: 0.8em;
  color: #fff;
  text-align: center;
  padding: 2em 4em;
  line-height: 1.7em;
}

.sbutton {
  width: 60%;
  height: 40px;
  border-radius: 24px;
  outline: none;
  background-color: rgba(61, 60, 60, 0.699);
  color: #fff;
  font-size: 0.9em;
  cursor: pointer;
  border-style: none;
}

.sbutton:hover {
  background-color: #cccccc80;
  color: #3b3b3b;
  font-size: larger;
  font-weight: 700;
}

.menu {
  background-color: rgba(61, 60, 60, 0.795);
  width: 150px;
  border-radius: 24px;
  outline: 0;
  box-shadow: none;
  border: 0;
  font-weight: 400;
  font-size: 0.9em;
  border-style: none;
}

.menu:hover {
  background-color: #cccccc80;
  box-shadow: none;
  color: #3b3b3b;
  border: 0;
  font-size: medium;
  font-weight: 700;
}

:deep(.el-radio) {
  --el-radio-text-color: rgb(0, 255, 13);
}
</style>
