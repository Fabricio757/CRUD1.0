import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/Aves',
    name: 'Aves',
    component: () => import(/* webpackChunkName: "about" */ '../views/Aves.vue')
  },
  {
    path: '/Mammals',
    name: 'Mammals',
    component: () => import(/* webpackChunkName: "about" */ '../views/Mammals.vue')
  },
  {
    path: '/Test',
    name: 'Test',
    component: () => import(/* webpackChunkName: "about" */ '../views/test.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
