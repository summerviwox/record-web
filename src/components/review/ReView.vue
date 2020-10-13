<template>
  <div class="root">
    <div class="contain">
      <div class="left"></div>
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
      textareamodel:''
    }
  },
  methods:{
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
       console.log(rate)
     }
  }
}
</script>

<style lang="less" scoped>
@import "ReView.less";
</style>