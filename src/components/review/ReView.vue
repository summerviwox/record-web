<template>
  <div class="review-root">
    <div class="contain">
      {{showsrc}}
      <iframe class="left" :src="dirsrc" ref="mydir"></iframe>
      <div class="mid">
        <textarea ref="inputbox" v-model="textareamodel" @scroll="inputScroll"></textarea>
      </div>
      <div class="right" ref="right">
        <div class="html">

          <highlightjs language='java' :code="textareamodel" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReView",
  data(){
    return{
      //dirsrc:'http://222.186.36.75:8888/project',
      dirsrc:'',
      showsrc:'',
      textareamodel:''
    }
  },
  methods:{
    getDir(){
      return this.$refs.mydir.contentWindow.location.href
    },
    // eslint-disable-next-line no-unused-vars
     inputScroll(e){
        let sh = this.$refs.inputbox.scrollHeight
       let ch = this.$refs.inputbox.clientHeight
       let st = this.$refs.inputbox.scrollTop
       let rate = st/(sh-ch);

       let rsh = this.$refs.right.scrollHeight
       let rch = this.$refs.right.clientHeight

        this.$refs.right.scrollTop = rate*(rsh-rch)
       // console.log('滚动条'+sh)
       // console.log('可视区'+ch)
       // console.log('距离顶部'+st)
     }
  }
}
</script>

<style lang="less" scoped>
@import "ReView.less";
@import '../../assets/highlight/styles/summer-dark.css';
</style>