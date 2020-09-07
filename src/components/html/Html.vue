<template>
    <div class="html-root">
        <div v-html="html" class="html-content markdown-body"></div>
    </div>
</template>

<script>
    export default {
        name: "Html",
        data(){
            return{
                html:'',
                id:-1,
                http:"http://222.186.36.75:9999/record-b",
            }
        },
        methods:{
            getHtml(){
                this.$axios.post(this.http+'/blog/selectHtmlById', {id:this.id}).then(res=>{
                    this.html = res.data.data.html
                }).catch(e=>{
                    this.$message(e)
                })
            }
        },
        mounted(){
            this.id = this.$route.query.id
            this.getHtml()
        }
    }
</script>

<style scoped>
@import '../../../node_modules/mavon-editor/dist/css/index.css';

    .html-root{
        height: 100%;
        overflow: auto;
        padding: 10px;
    }
.html-content{
    text-align: left;
}
    /deep/ .hljs{
        border-radius: 4px;
        background: black;
        display: block;
        text-align: left;
        padding: 10px;
        color: white;
    }
    /deep/ .hljs-comment{
        color: limegreen;
    }
</style>