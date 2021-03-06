import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Axios from "axios";
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import router from "@/router";
import  highlight from  "@/assets/highlight/highlight.pack.js"//代码高亮
import '@/common/style.less'
import Http from '@/requst/Http'
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$axios = Axios
Vue.use(mavonEditor)
Vue.use(router)
Vue.use(highlight.vuePlugin)
Vue.prototype.$Http = Http

new Vue({
    router,
    render: h => h(App)

}).$mount('#app')
