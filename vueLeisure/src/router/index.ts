import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import aboutJs from '../views/aboutJs.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/aboutHtml',
    name: 'aboutHtml',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutHome.vue'),
  },
  {
    path: '/aboutJs',
    name: 'aboutJs',
    component: () => import(/* webpackChunkName: "aboutJs" */ '../views/AboutJs.vue'),
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
