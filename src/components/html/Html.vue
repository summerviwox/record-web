<template>
  <div class="html-root">
    <div v-html="html" class="html-content markdown-body"></div>
    <mavon-editor v-model="content" style="display: none">
    </mavon-editor>
  </div>
</template>

<script>
export default {
  name: "Html",
  data(){
    return{
      content:"",
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
@import "../home/home.less";

.html-root{
  height: calc(100% - 20px);
  overflow: auto;
  padding: 10px;
}
.html-content{
  text-align: left;
}
</style>