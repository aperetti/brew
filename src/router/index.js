import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Monitor from '@/components/Monitor'
import NewBrew from '@/components/Brew'
import Kegs from '@/components/Kegs'
import User from '@/api/user'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'hello',
      component: Hello
    },
    {
      path: '/kegs',
      name: 'kegs',
      meta: {description: 'Kegs'},
      component: Kegs
    },
    {
      path: '/brew',
      name: 'brew',
      meta: {description: 'Brew'},
      component: NewBrew
    },
    {
      path: '/monitor',
      name: 'monitor',
      meta: {description: 'Brew Sensors'},
      component: Monitor
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/') {
    User.getStatus()
      .then(data => {
        console.log('test')
        return next()
      }).catch(e => {
        console.log('error')
        return next('/')
      })
  } else {
    return next()
  }
})

export default router
