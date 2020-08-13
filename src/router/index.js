import Vue from 'vue'
import VueRouter from "vue-router"
import Home from "@/components/home/Home";
Vue.use(VueRouter)
const router = new VueRouter({
    routes:[
        {
            path:'/home',
            component:Home,
        }
    ]
})
export  default router