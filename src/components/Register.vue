<script setup lang="ts">
import { ref } from 'vue'
import MutiSelect from "@/components/menu/MutiSelect.vue";
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()
const selected = ref([])
const password = ref('')
const repeatPassword = ref('')
const passwordError = ref('')
const firstName = ref('')
const lastName = ref('')
const fullName = ref('')
const email = ref('')
const emailError = ref('')
const loading = ref(false)
const userId = ref('')



const options = [
  { label: 'AUDI - LE', value: 'audi' },
  { label: 'BAIC - LE', value: 'baic' },
  { label: 'BMW - LE', value: 'bmw' },
  { label: 'EFR - LE', value: 'fff' },
  { label: 'FHN - LE', value: 'bgn' },
  { label: 'SSS - LE', value: 'kut' },
  { label: 'EGJ - LE', value: 'sgh' },
]

const options2 = [
  { label: 'BEIJING', value: 'bj' },
  { label: 'HEILONGJIANG', value: 'hj' },
  { label: 'HUNAN', value: 'hn' },
  { label: 'JILIN', value: 'jl' },
  { label: 'LIAONING', value: 'ln' },
  { label: 'SHANGHAI', value: 'sh' },
  { label: 'XINJIANG', value: 'xj' },
]
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleChange = (values) => {
  console.log('选中的值：', values)
}

const handleChange2 = (values) => {
  console.log('选中的值：', values)
}
const validateForm = () => {
  let isValid = true

  // 验证邮箱
  if (!email.value) {
    emailError.value = 'Please enter your email!'
    isValid = false
  } else if (!validateEmail(email.value)) {
    emailError.value = 'Please provide a valid email!'
    isValid = false
  } else {
    emailError.value = ''
  }

  // 验证密码
  if (!password.value) {
    passwordError.value = 'Please provide a valid password!'
    isValid = false
  } else if (!validatePasswords()) {
    isValid = false
  }

  return isValid
}

const validatePasswords = () => {
  if (password.value !== repeatPassword.value) {
    passwordError.value = 'password not correct!'
    return false
  }
  passwordError.value = ''
  return true
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true
    // 组合名字
    fullName.value = `${firstName.value.trim()}${lastName.value.trim()}`

    const { data } = await request.post('/api/user/register', {
      fullName: fullName.value,
      email: email.value,
      password: password.value
    })

    if (data.success) {
      const { data: userData } = await request.get('/api/user/getUserByName', {
        params: { username: fullName.value }
      })
      
      if (userData.success) {
        userId.value = userData.result.id
        const { data: emailData } = await request.post('http://124.220.206.34:8083/email/sendEmail', {
          out: "2893737565@qq.com",
          code: "waunjqoonbpadecd",
          to: email.value,
          subject: fullName.value,
          userId: userId.value
        })
        
        if (emailData.code === 200) {
          message.success('注册成功')
          setTimeout(() => {
            router.push({
              path: '/',
              query: {
                userId: userId.value,
                status: '1'
              }
            })
          }, 1000)
        }
      } else {
        message.error('不存在该用户！')
      }
    } else {
      message.error(data.message || '注册失败')
    }
  } catch (error: any) {
    console.error('注册请求失败:', error)
    if (error.response?.status === 403) {
      message.error('没有权限访问该接口')
    } else {
      message.error(error.response?.data?.message || '注册失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <!-- 背景图写在body里了 -->
  <!-- 左上角logo -->
  <img src="../assets/img/logo02.png" alt="" class="logo">
  <!-- 右侧登录部分 -->
  <div class="cr_bgc">
    <div class="content">
      <p class="wenzi_01">Create Account</p>
      <p class="wenzi_02">Please enter personal information to continue</p>
      <form class="" action="">

        <div class="tame_01">
          <div class="tame_02">
            <p class="wenzi_03">First name</p>
            <input class="first_name" type="text"  palceholder="" v-model="firstName"/>
          </div>
          <div class="tame_03">
            <p class="wenzi_03">Last name</p>
            <input class="last_name" type="text" placeholder="" v-model="lastName"/>
          </div>
        </div>

        <div class="tame_01">
          <div class="tame_02">
            <p class="wenzi_03">Business</p>
            <select name="#" class="Business">
              <option class="tachu_a_01" value="">ALL</option>
              <option class="tachu_a_02" value="">LV</option>
              <option class="tachu_a_03" value="">CVI</option>
            </select>
          </div>
          <div class="tame_03">
            <p class="wenzi_03">Customer</p>
            <div style="width: 180px;">
              <MutiSelect v-model="selected"
                          :options="options"
                          @change="handleChange"
              />
            </div>
          </div>
        </div>
        <div class="tame_04">
          <p class="wenzi_03">Working Location</p>
          <div style="width: 380px;">
          <MutiSelect v-model="selected"
                      :options="options2"
                      @change="handleChange2"
          />
        </div>
        </div>
        <div class="tame_04">
          <p class="wenzi_03">Function</p>
          <select name="#" class="Function">
            <option class="tachu_a_01" value="">AFO</option>
            <option class="tachu_a_03" value="">BBA</option>
            <option class="tachu_a_02" value="">CHINA</option>
            <option class="tachu_a_03" value="">PDL</option>
          </select>
        </div>

        <div class="tame_04">
          <p class="wenzi_03">Email Address</p>
          <input class="Email" type="text" placeholder="" v-model="email"/>
          <p v-if="emailError" class="error-message">{{ emailError }}</p>
        </div>

        <div class="tame_04">
          <p class="wenzi_03">Password</p>
          <input class="Email" type="password" placeholder="" v-model="password"/>
        </div>

        <div class="tame_04">
          <p class="wenzi_03">Repeat Password</p>
          <input class="Email" type="password" placeholder="" v-model="repeatPassword"/>
          <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
        </div>

        <input class="dl_tijiao" type="submit" value="Create Account" @click="handleSubmit"  :value="loading ? '注册中...' : 'Create Account'"  :disabled="loading"/>
        <p class="account"><span class="wenzi01">Already have an account? </span>&nbsp;&nbsp;
          <router-link to="/" class="wenzi02">Login</router-link></p>

      </form>
    </div>
  </div>
  <!-- 右侧登录部分  结束 -->
</template>

<style>
.error-message{
  color: red;
}
.dl_tijiao:disabled {
  background-color: #666;
  cursor: not-allowed;
}
.custom-multiselect {
  display:block;
  width: 166px;
  height: 44px;
  border-radius:2px;
  background-color:rgba(255,255,255,0.15);
  margin-bottom:10px;
  font-size: 16px;
  color:#fff;
  padding-left: 14px;
  border: none;
  outline:none;
}

:deep(.multiselect__tags) {
  height: 44px;
  padding: 8px;
  background-color: #C81623;
  border: none;

}

:deep(.multiselect__input) {
  background-color: white !important;
  border-radius: 2px;
  padding: 8px !important;
  margin: 0 !important;
  color: #333;
}

:deep(.multiselect__content-wrapper) {
  background-color: rgba(22,29,42,0.95);
  border: none;
  border-radius: 0 0 2px 2px;
}

:deep(.multiselect__option) {
  padding: 8px;
  color: white;
  background-color: transparent;
}

:deep(.multiselect__option--highlight) {
  background-color: #29384f;
  color: white;
}
:deep(.multiselect__tag){
  margin-bottom: 10px;
}
.select-all-option {
  display:inline-block;
  height: 44px;
  background-color:rgba(22,29,42,0.95);
  font-size: 16px;
  color: #fff;
  width: 166px;
}
.option-item {
  display:inline-block;
  height: 44px;
  background-color:rgba(22,29,42,0.95);
  font-size: 16px;
  color: #fff;
  padding-left: 20px;
  width: 100%;
}

/* 自定义复选框样式 */
.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 15px;
  margin-right: 8px;
  cursor: pointer;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  height: 16px;
  width: 16px;
  background-color: transparent;
  border: 2px solid white;
  border-radius: 2px;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: white;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid rgba(22,29,42,0.95);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

:deep(.multiselect__placeholder) {
  color: rgba(255,255,255,0.7);
  margin: 0;
  padding-top: 0;
}

:deep(.multiselect__single) {
  background-color: transparent;
  color: white;
  margin: 0;
}

:deep(.multiselect__tags-wrap) {
  display: none;
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
/*右侧注册部分*/
.cr_bgc{
  width: 802px;
  height: 840px;
  margin-top: 48px;
  margin-right: 50px;
  background-color:rgba(0,0,0,0.3);
  border-radius:15px;
  box-shadow:1px 2px 8px rgba(0,0,0,0.3);
  float:right;
  position: relative;
}
/*居中效果*/
.content{
  width: 380PX;
  margin:0 auto;
  position: relative;
}
/*内容部分从这里开始*/
.wenzi_01{
  text-align:center;
  font-size: 24PX;
  color: #FFF;
  margin-top: 45PX;
  margin-bottom: 30px;
}
.wenzi_02{
  font-size: 16PX;
  color: #fff;
  margin-bottom: 10px;
}
.tame_01 {
  width: 380px;
}
.twenzi_03 {
  font-size: 16PX;
  color: #fff;
  margin-bottom: 10px;
}
.first_name,.last_name,.Business,.Customer{
  display:block;
  width: 166px;
  height: 44px;
  border-radius:2px;
  background-color:rgba(255,255,255,0.15);
  margin-bottom:10px;
  font-size: 16px;
  color:#fff;
  padding-left: 14px;
  border: none;
  outline:none;
}
.Business,.Customer{
  width: 180px;
}
.Business:focus{
  box-shadow: inset 0 0 0 2px #b5becc;
}
.WorkingLocation{
  color:#fff;
  border: none;
  outline:none;
  font-size: 16px;
  padding-left: 14px;
}
.WorkingLocation:focus{
  box-shadow: inset 0 0 0 2px #b5becc;
}
.Function{
  width: 380px;
  height: 44px;
  border-radius:2px;
  background-color:rgba(255,255,255,0.15);
  color:#fff;
  border: none;
  outline:none;
  font-size: 16px;
  padding-left: 14px;
  margin-bottom:10px;
}
.Function:focus{
  box-shadow: inset 0 0 0 2px #b5becc;
}
.Email{
  width: 360px;
  height: 44px;
  border-radius:2px;
  background-color:rgba(255,255,255,0.15);
  color:#fff;
  border: none;
  outline:none;
  font-size: 16px;
  padding-left: 14px;
  margin-bottom:10px;
}
.Email:focus{
  box-shadow: inset 0 0 0 2px #b5becc;
}
.wenzi_03{
  font-size: 16px;
  color:#fff;
  margin-bottom: 10px;
}
.first_name{
  font-size: 16px;
  color:#fff;
  line-height:44px;
}
.first_name:focus{
  box-shadow: inset 0 0 0 2px #b5becc;
}
.last_name:focus{
  box-shadow: inset 0 0 0 2px #b5becc;
}
.tame_02{
  float: left;
}
.tame_03{
  float: right;
}
.WorkingLocation{
  width: 380px;
  height: 44px;
  border-radius:2px;
  background-color:rgba(255,255,255,0.15);
  margin-bottom:10px;
}

.dl_tijiao{
  display:block;
  margin:0 auto;
  width: 380px;
  height: 44px;
  background-color: #29384f;
  font-size:16PX;
  color: #fff;
  margin-bottom: 14px;
  margin-top: 30px;
  border-radius:2px;
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
/*弹出框1*/

.tachu_a_01,.tachu_a_02,.tachu_a_03 {
  display:inline-block;
  height: 44px;
  background-color:rgba(22,29,42,0.95);
  font-size: 16px;
  color: #fff;
  padding-left: 20px;
}


.tanchu_b {
  width: 180px;
  position: absolute;
  left:200px;
  top:236px;
}
/*弹出框2*/
.tachu_b_01{
  width: 160px;
  height: 44px;
  background-color: #fff;
  font-size: 16px;
  color: #999;
  line-height: 44px;
  padding-left: 20px;
  border-radius:2px 2px 2px 2px;
  box-shadow:inset 0 0 0 2px #b5becc;
}
.tachu_b_02{
  width: 138px;
  height: 44px;
  background-color:rgba(22,29,42,0.95);
  font-size: 16px;
  color: #fff;
  line-height: 44px;
  padding-left: 42px;
  border-bottom:1px #76787e solid ;
}
.tachu_b_03{
  width: 138px;
  height: 44px;
  background-color: #29384f;
  font-size: 16px;
  color: #fff;
  line-height: 44px;
  padding-left: 42px;
}
.tachu_b_04{
  width: 138px;
  height: 44px;
  background-color:rgba(22,29,42,0.95);
  font-size: 16px;
  color: #fff;
  line-height: 44px;
  padding-left: 42px;
  border-bottom:1px #76787e solid ;
  border-radius:0px 0px 2px 2px;
}
.tachu_b_05{
  width: 138px;
  height: 44px;
  background-color: rgba(22,29,42,0.95);
  font-size: 16px;
  color: #fff;
  line-height: 44px;
  padding-left: 42px;
}
/*复选框*/
.wxz_01{
  width: 16px;
  height: 16px;
  background:url(../assets/img/wxz.png) no-repeat ;
  position: absolute;
  left:214px;
  top:294px;
}

.wxz_02{
  width: 16px;
  height: 16px;
  background:url(../assets/img/wxz.png) no-repeat ;
  position: absolute;
  left:214px;
  top:339px;
}
.yxz_01{
  width: 16px;
  height: 16px;
  background:url(../assets/img/yxz.png) no-repeat ;
  position: absolute;
  left:214px;
  top:383px;
}
.wxz_03{
  width: 16px;
  height: 16px;
  background:url(../assets/img/wxz.png) no-repeat ;
  position: absolute;
  left:214px;
  top:428px;
}
/*小图标 展开*/
.zhankai_01{
  width: 14px;
  height: 18px;
  background:url(../assets/img/zk.png) no-repeat ;
  position: absolute;
  left:152px;
  top:206px;
}
.zhankai_02{
  width: 14px;
  height: 18px;
  background:url(../assets/img/zk.png) no-repeat ;
  position: absolute;
  left:353px;
  top:206px;
}
</style>