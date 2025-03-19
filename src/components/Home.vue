<script setup lang="ts">
import { ref , onMounted} from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()

function aclick(divDisplay: string, event: Event): void {
  const element = document.getElementById(divDisplay);
  const arrow = (event.currentTarget as HTMLElement).querySelector('.zhankai');
  if (element && arrow) {
    if (element.style.display !== "block") {
      element.style.display = "block";
      arrow.style.transform = 'rotate(180deg)';
    } else {
      element.style.display = "none";
      arrow.style.transform = 'rotate(0deg)';
    }
  }
}

interface NavItem {
  menuName: string;
  icon?: string;
  url: string;
  children?: NavItem[];
}

const navData = ref<NavItem[]>([]);

// const expandedMenus = ref<{ [key: string]: boolean }>({});


const fetchMenuData = async () => {
  try {
    const response = await request.get('/api/menu/tree');
    navData.value = response.data.result;
  } catch (error) {
    console.error('获取菜单数据失败:', error);
  }
};

// 组件挂载时获取菜单数据
onMounted(() => {
  fetchMenuData();
});


const handleMenuClick = (url: string) => {
  if (url) {
    router.push("/home"+url);
  }
}
</script>

<template>
  <div class="layout">
    <div class="nav_left">
      <div class="nav_logo"><img src="@/assets/img/logo.png"></div>
      <div class="nav_1" v-for="(item, index) in navData" :key="index">
        <a class="nav_one"
           @click="(event) => aclick(`divOne_${index}`, event)"
           style="cursor:pointer;">
          {{ item.menuName }}
          <span class="zhankai"></span>
          <div class="fgx"></div>
        </a>
        <ul class="nav_2"
            :id="`divOne_${index}`"
            style="display:none;">
          <li v-for="(subItem, subIndex) in item.children" :key="subIndex">
            <a class="nav_3" @click="handleMenuClick(subItem.url)">{{ subItem.menuName }}</a>
          </li>
          <div class="fgx"></div>
        </ul>
      </div>
    </div>
    <!-- 左侧 结束 -->

    <div class="content">
      <!-- 右侧 top -->
      <div class="nav_right">
        <a href="" class="zhedie"></a>
        <a href="" class="tongzhi"></a>
        <a href="" class="shuomingshu"></a>
        <a href="" class="touxiang"></a>
        <p class="top_name">admin</p>
        <div class="tishi"></div>
      </div>
      <!-- 主要内容区域 -->
      <div class="nav_right_a">
<!--        <div class="nav_right_b">-->
          <router-view></router-view>
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<style>
.zhankai {
  transition: transform 0.3s ease;
  display: inline-block;
}
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
.hm_nav {
  display: flex;
  justify-content: space-between;
  position: relative;
  height: 100%;
}

.hm_nav li:nth-child(2) {
  flex: 1;
  position: relative;
}
.nav_right_a{
  overflow:auto;
  height: 100%;
  background-color: #e8eefa;
}
.nav_right{
  position: absolute;
  left:0px;
  top:0px;
  width: 100%;
  overflow:auto;
}
.touxiang:hover {
  background-color: #fff;
}
.nav_right_b{
  margin: 75px 15px 0 15px;
  background-color: #fff;
}
html{
  height: 100%;
}
body{
  height: 100%;
}
/*左侧导航部分*/
.nav_left{
  height: 100%;
  width: 300px;
  background-color: #001529;
}
img{
  width: 300px;
  height: 120px;
}

.nav_one{
  display:block;
  width: 184px;
  font-size:18px;
  color: #ffffff;
  padding-top:30px;
  padding-bottom:30px;
  padding-left: 60px;
  padding-right: 56px;
  background:url(../assets/img/tubiao01.png) no-repeat ;
  background-position:20px 26px;
  position: relative;
  word-wrap: normal;

}
.nav_one:hover{
  background-color: #94b0cc;
  color:#ffffff;
}
.fgx {
  width: 260px;
  height: 1px;
  background-color: #fff;
  position: absolute;
  left: 20px;
  bottom:0px;
}
.zhankai{
  position: absolute;
  right: 20px;
  top:34px;
  display:inline-block;
  width: 17px;
  height: 10px;
  background:url(../assets/img/tubiao02.png) no-repeat ;

}
.nav_2{
  position: relative;
}
.nav_3 {
  display:block;
  font-size:14px;
  color:#fff;
  width: 160px;
  padding-top:16px;
  padding-bottom:16px;
  padding-left: 100px;
  padding-right: 40px;
  background:url(../assets/img/tubiao03.png) no-repeat ;
  background-position:64px 14px;
  word-wrap: normal;

}
ul li a:hover{
  background-color: #94b0cc;
  color:#ffffff;
  cursor:pointer
}
/*左侧导航部分 结束*/

/*右侧顶部*/
body{
  position: relative;
  background-color: #f0f2f5;
}

.nav_right{
  height: 60px;
  background-color: #fff;
  position: relative;
}

.zhedie{
  display:inline-block;
  width: 30px;
  height: 30px;
  background:url(../assets/img/zhedie01.png) center center no-repeat ;
  margin-top: 15px;
  margin-left: 30px;
}
.zhedie:hover{
  background:url(../assets/img/zhedie02.png) center center no-repeat ;
}
.shuomingshu{
  display:inline-block;
  width: 30px;
  height: 30px;
  background:url(../assets/img/shuomingshu01.png) center center no-repeat ;
  position: absolute;
  right:130px;
  top:15px;
}
.shuomingshu:hover{
  background:url(../assets/img/shuomingshu02.png) center center no-repeat ;
}
.tongzhi {
  display:inline-block;
  width: 30px;
  height: 30px;
  background:url(../assets/img/tongzhi01.png) center center no-repeat ;
  position: absolute;
  right:180px;
  top:15px;
}
.tongzhi:hover{
  background:url(../assets/img/tongzhi02.png) center center no-repeat ;
}
.touxiang {
  display:inline-block;
  width: 30px;
  height: 30px;
  background:url(../assets/img/touxiang.png) center center no-repeat ;
  position: absolute;
  right:74px;
  bottom:15px;
}
.top_name {
  display:inline-block;
  position: absolute;
  right:30px;
  top:20px;
}
.tishi {
  width: 8px;
  height: 8px;
  background:url(../assets/img/tishi.png) center center no-repeat ;
  position: absolute;
  right:182px;
  top:16px;
}

.layout {
  display: flex;
  height: 100vh;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow: auto;
  background-color: #f0f2f5;
  padding: 20px;
}
</style>