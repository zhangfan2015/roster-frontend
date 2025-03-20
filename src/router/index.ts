import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Home from '../components/Home.vue'
import MenuList from '../components/menu/MenuList.vue'
import UserList from "../components/user/UserList.vue";
import DepartList from "../components/DepartList.vue";
import RoleList from "../components/role/RoleList.vue";
import PositionList from "../components/position/PositionList.vue";
import CompanyList from "../components/company/CompanyList.vue";
import MessageList from "../components/message/MessageList.vue";

// 定义路由参数的类型

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'menu',
          name: 'menu',
          component: MenuList
        },
        {
          path: 'user',
          name: 'user',
          component: UserList
        },
        {
          path: 'depart',
          name: 'depart',
          component: DepartList
        },
        {
          path: 'role',
          name: 'role',
          component: RoleList
        },
        {
          path: 'company',
          name: 'company',
          component: CompanyList
        },
        {
          path: 'position',
          name: 'position',
          component: PositionList
        },
        {
          path: 'message',
          name: 'message',
          component: MessageList,
          meta: {
            title: '消息列表'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    }
  ]
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') // 检查是否已登录
  if (to.path !== '/login' && to.path !== '/register' && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router 