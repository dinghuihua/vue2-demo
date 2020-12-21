import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Antv from 'ant-design-vue'
Vue.config.productionTip = false
Vue.use(Antv)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
