import Vue from 'vue'
import router from './router'
import store from './store'
import notification from 'ant-design-vue/es/notification'
import {ACCESS_TOKEN} from '@/store/mutation-types'
import {generateIndexRouter} from "@/utils/util"
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList = ['/user/login', '/testEdit', '/dashboard']; // no redirect whitelist

router.beforeEach((to, from, next) => {
    NProgress.start();
    if (Vue.ls.get(ACCESS_TOKEN)) {
        if (to.path === '/user/login') {
            next({path: '/dashboard'});
            NProgress.done();
        } else {
            if (store.getters.permissionList.length === 0) {
                store.dispatch('GetPermissionList').then(res => {
                    const menuData = res.result.menu;
                    let roleData = res.result.rolePermissions;
                    if (menuData === null || menuData === "" || menuData === undefined) {
                        return;
                    }
                    let constRoutes = generateIndexRouter(menuData);
                    // 添加主界面路由
                    store.dispatch('UpdateAppRouter', {constRoutes}).then(() => {
                        // 根据roles权限生成可访问的路由表
                        // 动态添加可访问路由表
                        router.addRoutes(store.getters.addRouters);
                        store.dispatch('SetUserPermissions', roleData).then(() => {});
                        const redirect = decodeURIComponent(from.query.redirect || to.path);
                        if (to.path === redirect) {
                            // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                            next({...to, replace: true});
                        } else {
                            // 跳转到目的路由
                            next({path: redirect});
                        }
                    })
                })
                    .catch(() => {
                        notification.error({
                            message: '系统提示',
                            description: '请求用户信息失败，请重试！'
                        });
                        store.dispatch('Logout').then(() => {
                            next({path: '/user/login'});
                        });
                    })
            } else {
                console.log('进入');
                next()
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next()
        } else {
            next({path: '/user/login'});
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    NProgress.done();
});
