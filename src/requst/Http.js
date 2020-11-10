import axios from 'axios'

let instance = axios.create({

})
instance.interceptors.request.use(
    config=>{
        const token = localStorage.getItem("token")
        if(config.method==='get'){
            config.params['token'] = token
        }else if(config.method==='post'){
            config.data.append('token',token)
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)
instance.interceptors.response.use(
    respone=>{
        return respone
    },
    error => {
        return Promise.reject(error)
    }
)
export default instance