<template>
    <div class="login-root">
        <div class="login-input-content">
            <el-image :src="head" class="login-head"/>
            <el-input v-model="loginInput.name" placeholder="请输入内容" class="login-input-name"></el-input>
            <el-input v-model="loginInput.pwd" placeholder="请输入内容" class="login-input-pwd"></el-input>
            <el-button type="primary" class="login-login" @click="login">登录</el-button>
        </div>

    </div>
</template>

<script>
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
                if(this.loginInput.name==='summer'&&this.loginInput.pwd==='123456'){
                    this.$router.push('/home',{})
                }
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