import Vue from 'vue'
import App from './App.vue'
import VueFormulate from '@braid/vue-formulate'
import SnomedSearch from '@/components/SnomedSearch.vue'
Vue.component('SnomedSearch', SnomedSearch)
Vue.config.productionTip = false
Vue.use(VueFormulate, {
  library: {
    snomed: {
      classification: 'text',
      component: 'SnomedSearch'
    }
  }
})
new Vue({
  render: h => h(App),
}).$mount('#app')
