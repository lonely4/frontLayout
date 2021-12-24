import Vue from 'vue'
import router from './router/index'
import App from './App.vue'
import ElementUI from 'element-ui'
import '@/css/reset.scss'
import 'element-ui/lib/theme-chalk/index.css'
import '@/css/layout.scss'
import '@/css/flex.scss'

Vue.config.productionTip = false

Vue.use(ElementUI)
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
