import Vue from 'vue'
import VueRouter from "vue-router"
import Home from "@/components/home/Home";
import Login from "@/components/login/Login";
import html from "@/components/html/Html";
import person from "@/components/person/Person"
import ReView from "@/components/review/ReView";
Vue.use(VueRouter)
const router = new VueRouter({
    routes:[
        {
            path:'/',
            component: Home,
            meta:{
                keepAlive:false
            }
        },
        {
            path:'/login',
            component:Login,
            meta:{
                keepAlive:false
            }
        },
        {
            path:'/home',
            component:Home,
            meta:{
                keepAlive:false
            }
        },
        {
            path:'/html',
            name:"html",
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
        },
        {
            path:"/review",
            component: ReView,
            meta:{
                keepAlive: false
            }
        }
    ]
})
export  default router