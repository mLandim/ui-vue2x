// Vue 2x 
import Vue from 'vue'
import App from './App.vue'
// import App from './TestFormBase.vue'
import SyaraUi from '../src/index'

console.log(SyaraUi)
Vue.use(SyaraUi)

new Vue({
    render: h => h(App),
}).$mount('#app')
