import axios from 'axios'
import router from "@/router";

let instance = axios.create({

})
instance.interceptors.request.use(
    config=>{
        const token = localStorage.getItem("token")
        if(token){
            if(config.method.trim()=='get'){
                config.params.token = token
            }
            config.headers["token"] = token
        }
        console.error(config)
        return config
    },
    error => {
        return Promise.reject(error)
    }
)
instance.interceptors.response.use(
    respone=>{
        if(respone.data=='500'){
            localStorage.setItem('loginres','')
            router.push("/login",{})
        }
        return respone
    },
    error => {
        return Promise.reject(error)
    }
)
export default instance