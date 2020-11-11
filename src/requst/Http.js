import axios from 'axios'
import router from "@/router";

let instance = axios.create({

})
instance.interceptors.request.use(
    config=>{
        const token = localStorage.getItem("token")
        if(config.method==='get'){
            config.params['token'] = token
        }else if(config.method==='post'){
            config.data.token = token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)
instance.interceptors.response.use(
    respone=>{
        if(respone.data=='500'){
            router.push("/login",{})
        }
        return respone
    },
    error => {
        return Promise.reject(error)
    }
)
export default instance