import Vue from 'vue'
import Router from 'vue-router'
import switchTab from '@/views/switchTab/switchTab'// 一级大路由
import childrenAssistant from '@/views/childrenAssistant/childrenAssistant' // 育儿助手
import parentLeaning from '@/views/parentLeaning/parentLeaning' // 父母学医
import askDoctor from '@/views/askDoctor/askDoctor'// 问医生
import vip from '@/views/vip/vip'// 会员中心
import detail from '@/views/detail/detail'// 详情
import childrenTool from '@/views/childrenTool/childrenTool'// 儿童药箱
import nearStore from '@/views/nearStore/nearStore'// 附近药店
import clearDoctor from '@/views/clearDoctor/clearDoctor'// 智能医生
import indexDetail from '@/views/indexDetail/indexDetail'// 智能医生

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/childrenassistant'
    },
    {
      name: 'switchtab',
      path: '/switchtab',
      component: switchTab,
      children: [
        {
          name: 'childrenassistant',
          path: '/childrenassistant',
          component: childrenAssistant
        },
        {
          name: 'parentLeaning',
          path: '/parentLeaning',
          component: parentLeaning
        },
        {
          name: 'askDoctor',
          path: '/askDoctor',
          component: askDoctor
        }, {
          name: 'vip',
          path: '/vip',
          component: vip
        }, {
          name: 'childrenTool',
          path: '/childrentool',
          component: childrenTool
        }, {
          name: 'clearDoctor',
          path: '/clearDoctor',
          component: clearDoctor
        }, {
          name: 'nearStore',
          path: '/nearStore',
          component: nearStore
        }
      ]
    },
    {
      path: '/detail/:id',
      component: detail
    },
    {
      path: '/indexDetail/:id',
      component: indexDetail
    }
  ]
})
