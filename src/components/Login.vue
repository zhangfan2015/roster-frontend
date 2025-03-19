<script setup lang="ts">
import { ref } from 'vue'
import {useRoute, useRouter} from 'vue-router'
import { message } from 'ant-design-vue';
import request from '@/utils/request'

const router = useRouter()
const route = useRoute()
const form = ref({
  username: '',
  password: '',
  remember: false,
  id:route.query.userId,
  status:route.query.status
})

// 使用 query 获取参数
const userId = route.query.userId
const status = route.query.status

console.log("用户ID:", userId)
console.log("状态:", status)

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  try {
    if (userId && status) {

        const { data } = await request.post('/api/user/login', form.value)
        if (data.success) {
          message.success('登录成功')
          // 存储用户信息、token和refreshToken
          localStorage.setItem('user', JSON.stringify(data.result))
          localStorage.setItem('token', data.result.accessToken)
          localStorage.setItem('refreshToken', data.result.refreshToken)

          // 设置request默认headers
          request.defaults.headers.common['Authorization'] = `Bearer ${data.result.accessToken}`

          // 跳转到home页面
          router.push('/home')
        } else {
          message.error(data.message || '登录失败')
        }
    }
    else {
      // 如果没有 userId 和 status，直接进行登录
      const { data } = await request.post('/api/user/login', form.value)
      if (data.success) {
        message.success('登录成功')
        localStorage.setItem('user', JSON.stringify(data.result))
        localStorage.setItem('token', data.result.accessToken)
        localStorage.setItem('refreshToken', data.result.refreshToken)
        request.defaults.headers.common['Authorization'] = `Bearer ${data.result.accessToken}`
        router.push('/home')
      } else {
        message.error(data.message || '登录失败')
      }
    }
  } catch (error: any) {
    console.error('登录错误:', error)
    if (error.response?.status === 403) {
      message.error('没有权限访问该接口')
    } else {
      message.error(error.response?.data?.message || '登录失败，请稍后重试')
    }
  }
}
</script>

<template>
  <!-- 设置当前编码 -->
  <meta charset="UTF-8">
  <!-- 如果是用IE打开当前页面，那么就使用最引擎渲染 -->
  <meta heep-equiv="X-UA-Compatible" content="IE=edge"/>
  <!-- 背景图写在body里了 -->
  <!-- 左上角logo -->
  <img src="../assets/img/logo02.png" alt="" class="logo">
  <!-- 右侧登录部分 -->
  <div class="dl_bgc">
    <div class="dl_title"></div>
    <form class="dl_biaodan" @submit="handleSubmit">
      <input 
        v-model="form.username"
        class="dl_zhanghao" 
        type="text" 
        placeholder="Email Address"
        required
      />
      <input 
        v-model="form.password"
        class="dl_mima" 
        type="password" 
        placeholder="Password"
        required
      />

      <div class="remember-container">
        <input 
          type="checkbox" 
          id="remember"
          v-model="form.remember"
        />
        <label class="dl_Remember" for="remember">Remember Password</label>
      </div>

      <input class="dl_tijiao" type="submit" value="Login"/>
      <p class="account"><span class="wenzi01">Don't have an account?</span>&nbsp;&nbsp;
        <router-link to="/register" class="wenzi02">Create Account</router-link></p>
    </form>
    <!-- 账号和密码的图标 -->
    <div class="img_zhanghao"></div>
    <div class="img_mima"></div>

  </div>
</template>

<style>
html, body, div, ul, li, ol, dl, dd, dt, p, h1, h2, h3, h4, h5, h6, form, legend, span, img { margin:0; padding:0; }
fieldset,input,button { border:none; padding:0;margin:0;outline-style:none; }
ul, ol { list-style:none; }
input,textarea{
  border:none;
  outline:none;
  /*清楚移动端默认的表单样式*/
  -webkit-appearance:none;
  -moz-appearance: none;
}
img {border:0;  vertical-align:middle;}/*去掉图片底下默认3像素缝隙*/
body {
  font:12px/150% "Microsoft YaHei",Arial,"\5fae\8f6f\96c5\9ed1";
  color:#333;
}
a {color:#666; text-decoration:none; }
a:hover{color:#C81623;}
article,aside,dialog,footer,header,section,footer,nav,figure,menu{display:block}
h1,h2,h3,h4,h5,h6{text-decoration: none;font-weight: normal;font-size: 100%;}
s,i,em{font-style: normal;text-decoration: none;}

html{
  height: 100%;
}
body{
  height: 100%;
  background-color: #f0f2f5;
}
/*背景图*/
body{
  background:url(../assets/img/bgm03.png)  center center no-repeat ;
  background-size:cover;
}
.logo{
  margin-left: 88px;
  margin-top: 80px;
  width: 132px;
  height: 39px;
}
/*右侧登录部分*/
.dl_bgc{
  width: 514px;
  height: 500px;
  margin-top: 150px;
  margin-right: 184px;
  background-color:rgba(0,0,0,0.3);
  border-radius:15px;
  box-shadow:1px 2px 8px rgba(0,0,0,0.3);
  float:right;
  position: relative;
}
/*右侧Horae图片*/
.dl_title {
  width: 162px;
  height: 37px;
  margin:0 auto;
  margin-top: 78px;
  margin-bottom: 62px;
  background:url(../assets/img/title.png)  center center no-repeat ;
}
/*注册表单*/
.dl_biaodan{
  width: 100%;
  margin:0 auto;
}
.dl_zhanghao{
  display:block;
  margin:0 auto;
  width: 262px;
  height: 44px;
  border-radius:22px;
  background-color:rgba(255,255,255,0.15);
  margin-bottom:28px;
  font-size: 16px;
  padding-left: 58px;
  color:#fff;
}
.dl_zhanghao::placeholder{
  color:#fff;
}
.dl_zhanghao:focus{
  box-shadow: inset 0 0 0 2px #b5becc;
}
.dl_mima{
  display:block;
  margin:0 auto;
  width: 262px;
  height: 44px;
  border-radius:22px;
  background-color:rgba(255,255,255,0.15);
  font-size: 16px;
  padding-left: 58px;
  color:#fff;
  margin-bottom:14px;
}
.dl_mima::placeholder{
  color:#fff;
}
.dl_mima:focus{
  box-shadow: inset 0 0 0 2px #b5becc;
}

.dl_Remember{
  display:inline-block;
  padding-left:150px;
  background-position:122px 1px;
  color: #fff;
  margin-bottom:44px;
  background:url(../assets/img/yxz.png)  no-repeat ;
  background-position:118px 1px;
}
.dl_tijiao{
  display:block;
  margin:0 auto;
  width: 320px;
  height: 44px;
  background-color: #29384f;
  font-size:16PX;
  border-radius:22px;
  color: #fff;
  margin-bottom: 14px;
}
.dl_tijiao:hover{
  background-color: #3b495d;
}
/*点击文字进行注册*/
.account{
  text-align:center;
}
.wenzi01{
  color: #3b495d;
}

.wenzi02{
  color: #c91818;
}

.wenzi02:hover{
  text-decoration:none;
  color:#00f;
  cursor:pointer;
  text-decoration:underline;
  color: #c91818;
}
/*账号和密码的图标*/
.img_zhanghao{
  width: 18px;
  height: 20px;
  background:url(../assets/img/yhm.png) no-repeat ;
  position: absolute;
  top: 188px;
  left: 122px;
}
.img_mima{
  width: 18px;
  height: 20px;
  background:url(../assets/img/mm.png) no-repeat ;
  position: absolute;
  top: 260px;
  left: 122px;
}

.remember-container {
  display: flex;
  align-items: center;
  /* margin-bottom: 44px; */
  /* padding-left: 150px; */
}

.remember-container input[type="checkbox"] {
  margin-right: 8px;
}

.remember-container label {
  color: #fff;
  cursor: pointer;
}
</style>