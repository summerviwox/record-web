import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'
 import Axios from "axios";
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(MarkdownItVue)
Vue.prototype.$axios = Axios

new Vue({
  render: h => h(App),
}).$mount('#app')
