import { UserLayout, TabLayout } from '@/components/layouts'

/**
 * 走菜单，走权限控制
 * @type {[null,null]}
 */
export const asyncRouterMap = [];

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      }
    ]
  },
  {
    path: '/personal',
    component: TabLayout,
    redirect: '/personal/info',
    hidden: true,
    children: [
      {
        path: 'info',
        name: 'info',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/info')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },
  {
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/dashboard/Analysis')
  },
  {
    path : "/managementDetails",
    component: () => import(/* webpackChunkName: "fail" */ '@/views/monitoring-Supervision/managementDetails'),
    //  beforeEnter:(to,from,next)=>{
    //    alert("进入到这个页面了");
    //    next(false,alert("您没有权限"));
       
    //  }
  },
  {
    path: '/reportListDetails',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/monitoring-Supervision/monitoring-Supervision/Report-list-details')
  },
  {
    path: '/violationDataProcessing',
    name : 'violationDataProcessing',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/monitoring-Supervision/monitoring-Supervision/Violation-data-list-processing')
  },
  {
    path: '/emergencySearchTaskDetails',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/monitoring-Supervision/monitoring-Supervision/Emergency-search-task-details')
  },
  // Go-custom-auxiliary-area
  {
    path: '/GoCustomAuxiliaryArea',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/monitoring-Supervision/monitoring-Supervision/Violation-data-list-processing-template/Go-custom-auxiliary-area'),
    meta : {
      keepAlive : true,
    }
  },
];
