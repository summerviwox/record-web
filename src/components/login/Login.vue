<template>
    <div class="login-root">
        <div class="login-input-content">
            <el-image :src="head" class="login-head"/>
            <el-input v-model="loginInput.name" placeholder="请输入内容" class="login-input-name"></el-input>
            <el-input v-model="loginInput.pwd" placeholder="请输入内容" class="login-input-pwd" show-password></el-input>
            <el-button type="primary" class="login-login" @click="login">登录</el-button>
        </div>

    </div>
</template>

<script>
    import userDE from "@/logic/UserDE";

    export default {
        name: "Login",
       data(){
            return{
                head:"http://222.186.36.75:8888/blog/13.png",
                loginInput:{
                    name:"summer",
                    pwd:"123456"
                }
            }
       },
        methods:{
            login(){
              let o = {name:this.loginInput.name,pwd:this.loginInput.pwd,time:new Date().getTime()}
              this.$axios.post("https://222.186.36.75:9999/record-b"+"/user/login",o).then(res=>{
                if(res.data){
                  localStorage.setItem('loginres',JSON.stringify(o) )
                  localStorage.setItem("token",res.data)
                  this.$router.push('/home',{})
                }else{
                  this.$message.error("登录失败")
                }
              }).catch(error=>{
                  console.error(error)
                this.$message.error("登录失败")
              })

            }
        },
        mounted(){
          if(userDE.isLogined()){
            this.$route.meta.keepAlive = false
            this.$router.push('/login',{});
            this.$router.push({path:'/home',query:''})
          }
        }
    }
</script>

<style scoped>
    .login-root{
        width: 100%;
        height: 100%;
    }
    .login-input-content{
        width: 300px;
        position: relative;
        left: 50%;
        top: 40%;
        transform: translateX(-50%) translateY(-50%);
    }
    .login-head{
        width: 100px;
        height: 100px;
    }
   .login-input-pwd{
       margin-top: 10px;
   }
    .login-login{
        margin-top: 10px;
        height: 35px;
        width: 100%;
    }

</style>