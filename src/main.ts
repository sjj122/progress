import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 创建vue实例
const app = createApp(App)

// 全局引入element组件
import {
    ElMenu, ElMenuItem, ElSubmenu, ElCard, ElInput, ElSelect, ElOption, ElOptionGroup,
    ElTimeline, ElTimelineItem, ElImage, ElDialog, ElButton, ElTag, ElTooltip, ElPopconfirm
} from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css';
app.use(ElMenu).use(ElMenuItem).use(ElSubmenu).use(ElCard).use(ElInput).use(ElSelect).use(ElOption)
.use(ElOptionGroup).use(ElTimeline).use(ElTimelineItem).use(ElImage).use(ElDialog).use(ElButton).use(ElTag)
.use(ElTooltip).use(ElPopconfirm)
// 使用vuex，router
app.use(store).use(router)

// 挂载到#app元素上
app.mount('#app')
