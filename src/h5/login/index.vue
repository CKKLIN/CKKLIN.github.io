<template>
    <div class="login-page">
        <div class="top">
            <img src='https://sky-lkc.oss-cn-beijing.aliyuncs.com/icon/back.svg' class="back" @click="goBack()">
        </div>
        <div class="card-wrap">
            <div class="logo"><img :src="logoIcon"></div>
            <div class="card">
                <div class="card-header">
                    <div class="header-slider" :class="{ right: isRegister }"></div>
                    <span :class="{ active: !isRegister }" @click="isRegister = false">登录</span>
                    <span :class="{ active: isRegister }" @click="isRegister = true">注册</span>
                </div>

                <Transition name="slide" mode="out-in">
                    <!-- 登录 -->
                    <div v-if="!isRegister" key="login" class="form">
                        <div class="field">
                            <input v-model="loginForm.name" type="text" placeholder="用户名">
                        </div>
                        <div class="field">
                            <input v-model="loginForm.password" type="password" placeholder="密码">
                        </div>
                        <button class="submit-btn" @click="handleLogin">登录</button>
                    </div>

                    <!-- 注册 -->
                    <div v-else key="register" class="form">
                        <div class="field">
                            <input v-model="registerForm.name" type="text" placeholder="用户名">
                        </div>
                        <div class="field">
                            <input v-model="registerForm.password" type="password" placeholder="密码">
                        </div>
                        <div class="field">
                            <input v-model="registerForm.confirmPassword" type="password" placeholder="确认密码">
                        </div>
                        <button class="submit-btn" @click="handleRegister">注册</button>
                    </div>
                </Transition>

                <div v-if="msg" class="msg" :class="{ error: isError }">{{ msg }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/stores/token'
import { fetchUsers, registerUser } from '@/api/userApi'
import logoIcon from '../../../public/logo.png'


const router = useRouter()
const tokenStore = useTokenStore()

const isRegister = ref(false)
const msg = ref('')
const isError = ref(false)

const loginForm = ref({ name: '', password: '' })
const registerForm = ref({ name: '', password: '', confirmPassword: '' })

const showMessage = (text, error = false) => {
    msg.value = text
    isError.value = error
    setTimeout(() => { msg.value = '' }, 2500)
}
const goBack = () => {
    router.back()
}

const handleLogin = async () => {
    const { name, password } = loginForm.value
    if (!name || !password) {
        showMessage('请填写完整信息', true)
        return
    }
    const users = await fetchUsers()
    const found = users.find(u => u.name === name && u.password === password)
    if (!found) {
        showMessage('用户名或密码错误', true)
        return
    }
    tokenStore.setToken(`h5_token_${found.id}_${Date.now()}`)
    localStorage.setItem('username', found.name)
    localStorage.setItem('userId', String(found.id))
    showMessage('登录成功')
    setTimeout(() => {
        router.push('/myh5')
    }, 800)
}

const handleRegister = async () => {
    const { name, password, confirmPassword } = registerForm.value
    if (!name || !password || !confirmPassword) {
        showMessage('请填写完整信息', true)
        return
    }
    if (password !== confirmPassword) {
        showMessage('两次密码不一致', true)
        return
    }
    const users = await fetchUsers()
    if (users.find(u => u.name === name)) {
        showMessage('用户名已存在', true)
        return
    }
    const result = await registerUser({
        name,
        password,
        level: 1,
        role: 1,
        avatar: 'default',
        collectList: [{ id: 1, collect: '' }]
    })
    if (result.success) {
        tokenStore.setToken(`h5_token_${result.id}_${Date.now()}`)
        localStorage.setItem('username', name)
        localStorage.setItem('userId', String(result.id))
        showMessage('注册成功')
        setTimeout(() => {
            router.push('/myh5')
        }, 800)
    } else {
        showMessage('注册失败，请重试', true)
    }
}
</script>

<style scoped>
.back {
    width: 35px;
    aspect-ratio: 1/1;
    position: absolute;
    left: 8px;
}

.top {
    width: 100%;
    height: 7%;
    /* background-color: var(--color-h5Top); */
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    /* padding: var(--padding-ssm); */
}

.login-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;

    background: linear-gradient(160deg, rgba(153, 205, 50, 0.815), rgba(153, 205, 50, 0.322), rgba(153, 205, 50, 0.377));
    /* background-color: yellowgreen; */
    /* background: linear-gradient(160deg, rgba(154, 205, 50, 0.12), rgba(255, 255, 255, 0.4), rgba(154, 205, 50, 0.06)); */
    position: relative;
    overflow: hidden;
}

.login-page::before {
    content: '';
    position: absolute;
    top: -60px;
    right: -60px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(154, 205, 50, 0.15);
    filter: blur(40px);
}

.login-page::after {
    content: '';
    position: absolute;
    bottom: -80px;
    left: -40px;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    background: rgba(154, 205, 50, 0.1);
    filter: blur(50px);
}

.card-wrap {
    width: 100%;
    max-width: 380px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
}

.logo {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    /* background: linear-gradient(135deg, #9acd32, #6ebf1a); */
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    /* box-shadow: 0 6px 20px rgba(154, 205, 50, 0.3); */
    position: relative;
    z-index: 1;
}

.logo img {
    width: 100%;
    height: 100%;
    display: block;
}

/* .logo span {
    font-size: 28px;
    font-weight: 800;
    color: #fff;
} */
.card {
    width: 100%;
    max-width: 380px;
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 24px;
    padding: 32px 24px 28px;
    box-shadow:
        0 12px 40px rgba(0, 0, 0, 0.06),
        0 2px 8px rgba(0, 0, 0, 0.04),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
    position: relative;
    z-index: 1;
}

.card-header {
    display: flex;
    gap: 0;
    justify-content: center;
    margin-bottom: 28px;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 14px;
    padding: 4px;
    position: relative;
}

.header-slider {
    position: absolute;
    top: 4px;
    left: 4px;
    width: calc(50% - 4px);
    height: calc(100% - 8px);
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    box-shadow: var(--color-card-shadow-one);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 0;
}

.header-slider.right {
    transform: translateX(100%);
}

.card-header span {
    flex: 1;
    text-align: center;
    cursor: pointer;
    padding: 10px 0;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    color: #999;
    transition: color 0.3s ease;
    position: relative;
    z-index: 1;
}

.card-header span.active {
    color: #333;
    background: transparent;
    box-shadow: none;
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.25s ease;
}

.slide-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.slide-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}

.form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.field {
    position: relative;
}

.field input {
    width: 100%;
    padding: 16px 18px;
    border: 1.5px solid rgba(200, 200, 200, 0.35);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.6);
    font-size: 15px;
    color: #333;
    outline: none;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.field input::placeholder {
    color: #bbb;
}

.field input:focus {
    border-color: rgba(154, 205, 50, 0.5);
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 0 4px rgba(154, 205, 50, 0.08);
}

.submit-btn {
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 16px;
    background: linear-gradient(135deg, #9acd32, #6ebf1a);
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    cursor: pointer;
    margin-top: 8px;
    box-shadow: var(--color-card-shadow-one);
    /* box-shadow: 0 4px 16px rgba(154, 205, 50, 0.3); */
    transition: all 0.25s ease;

}

.submit-btn:active {
    transform: scale(0.97);
    background: linear-gradient(135deg, #8ec02d, #62b015);
    box-shadow: 0 2px 8px rgba(154, 205, 50, 0.2);
}

.msg {
    text-align: center;
    margin-top: 16px;
    font-size: 14px;
    font-weight: 500;
    padding: 8px;
    border-radius: 10px;
    background: rgba(154, 205, 50, 0.08);
    color: yellowgreen;
}

.msg.error {
    background: rgba(255, 70, 70, 0.06);
    color: #ff4d4f;
}
</style>
