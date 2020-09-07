import Vue from 'vue'
import VueRouter from "vue-router"
import Home from "@/components/home/Home";
import Login from "@/components/login/Login";
import html from "@/components/html/Html";
import person from "@/components/person/Person"
Vue.use(VueRouter)
const router = new VueRouter({
    routes:[
        {
            path:'/',
            component: Home,
            meta:{
                keepAlive:true
            }
        },
        {
            path:'/login',
            component:Login,
            meta:{
                keepAlive:true
            }
        },
        {
            path:'/home',
            component:Home,
            meta:{
                keepAlive:true
            }
        },
        {
            path:'/html',
            component:html,
            meta:{
                keepAlive:false
            }
        },
        {
            path:'/person',
            component: person,
            meta: {
                keepAlive: false
            }
        }
    ]
})
export  default router