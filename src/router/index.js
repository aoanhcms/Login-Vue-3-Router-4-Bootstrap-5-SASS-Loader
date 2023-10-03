import { createRouter, createWebHistory } from 'vue-router'

import ChatBox from '../views/box-chat-widget/ChatWidget'
import PaginaDashboard from '../views/PaginaDashboard.vue'
import PaginaHome from '../views/Home.vue'
import PaginaLogin from '../views/Login.vue'
import PaginaLogout from '../views/Logout.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: PaginaHome
  },
  /*****************************
   * Login / Logout
   *****************************/
  {
    path: '/login',
    name: 'login',
    props: true,
    component: PaginaLogin,
  },
  {
    path: '/pages/:page_id/box-chat-widget',
    name: 'box',
    component: ChatBox, 
    meta: { authOnly: true },
    props: true,
  },
  {
    path: '/logout',
    name: 'logout',
    props: true,
    component: PaginaLogout,
  },
  /*****************************
   * Dashboard 
   *****************************/
  {
    path: '/dashboard',
    name: 'dashboard',
    props: true,
    component: PaginaDashboard, 
    meta: { authOnly: true }
  },
]

function isLoggedIn() {
  return localStorage.getItem("accessToken")
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authOnly)) {
    if (!isLoggedIn()) {
      console.log('to.fullPath', to.fullPath);
      next({
        name: "login",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.guestOnly)) {
    if (isLoggedIn()) {
      next({
        path: "/dashboard",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router