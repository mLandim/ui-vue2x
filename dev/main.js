import { createApp } from 'vue'
import App from './App.vue'
import SyaraUi from '../dist/syara-ui.common'
import '../dist/syara-ui.css'

console.log(SyaraUi)
createApp(App).use(SyaraUi).mount('#app')
