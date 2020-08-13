import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Axios from "axios";
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import router from "@/router";

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$axios = Axios
Vue.use(mavonEditor)
Vue.use(router)
new Vue({
  router,
  render: h => h(App)

}).$mount('#app')
