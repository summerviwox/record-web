import Vue from 'vue'
import VueRouter from "vue-router"
import Home from "@/components/home/Home";
import Login from "@/components/login/Login";
Vue.use(VueRouter)
const router = new VueRouter({
    routes:[
        {
            path:'/login',
            component:Login,
        },
        {
            path:'/home',
            component:Home,
        }
    ]
})
export  default router