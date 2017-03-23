// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import App from './App'
import router from './router'
import _ from 'lodash'
import Vuetify from 'vuetify'
window._ = _
Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(VueMaterial)
Vue.use({install: (Vue, options) => {
  Vue.prototype.$token = (function () {
    return window.localStorage.getItem('token')
  })()
  Vue.prototype.$setToken = function (token) {
    return window.localStorage.setItem('token', token)
  }
  Vue.prototype.$logout = function () {
    return window.localStorage.removeItem('token')
  }
}})
Vue.material.registerTheme('default', {
  primary: {color: 'orange', hue: 800},
  accent: 'white',
  warn: 'red',
  background: 'white'
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
