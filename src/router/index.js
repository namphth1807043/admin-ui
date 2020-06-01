import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import {goLogin} from "src/utils/auth";

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({x: 0, y: 0}),
    routes,
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
      goLogin()
    } else {
      let allowedToEnter = true;

      to.matched.some((record) => {
        let isLoggedIn = (typeof localStorage.getItem(process.env.TOKEN_NAME) !== 'undefined' && localStorage.getItem(process.env.TOKEN_NAME) !== null);

        if (!isLoggedIn && record.name === 'home') {
          next({
            path: '/login',
            replace: true
          });
          return
        }

        if ('meta' in record) {
          if ('requiresAuth' in record.meta) {
            if (record.meta.requiresAuth) {
              if (!isLoggedIn) {
                allowedToEnter = false;
                next({
                  path: '/login',
                  replace: true,
                  query: {redirect: to.fullPath}
                })
              }
            }
          }
        }
      });

      if (allowedToEnter) {
        const {slug, articleSlug} = (to || {}).params
        const breakToCategoryPage = slug && articleSlug && !isEndingByValidTimeStamp(articleSlug)

        if (breakToCategoryPage) {
          store.dispatch('category/getFilterParams', {slug, filterUrl: articleSlug})
          next({
            path: `/${slug}`,
            replace: true
          })
        } else {
          next()
        }
      }
    }
  });

  return Router
}
