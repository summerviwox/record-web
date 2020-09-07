<template>
  <div class="home-root" @mousemove="dragOnMouseMove($event)" @mouseup="dragOnMouseUp($event)">
    <el-dialog title="菜单" :visible.sync="dialogTableVisible">
      <div  class="home-dialog">
        <div class="item-dialog" @click="prepareForAdd(true)">新增根目录</div>
        <el-divider></el-divider>
        <div class="item-dialog" @click="prepareForAdd(false)">新建</div>
        <el-divider></el-divider>
        <div class="item-dialog" @click="deleltBog">删除</div>
      </div>
    </el-dialog>
    <div class="home-top">
      <div class="home-top-content">
        <div class="home-top-left">

        </div>
        <div class="home-top-right">
          <el-dropdown @command="dropdownMenu">
            <div class="home-top-right-content">
              <el-image
                  style="width: 40px; height: 40px"
                  :src="avatar"
                  :fit="fit"></el-image>
              <div class="home-top-right-name">summer</div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">个人中心</el-dropdown-item>
              <el-dropdown-item command="2">账号设置</el-dropdown-item>
              <el-dropdown-item command="3">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

    <div class="home-content">
      <div class="home-content-content">
        <div class="home-left" :style="{width:leftwidth +'px'}">
          <div class="home-left-content">
            <el-tree
                class="home-left-tree"
                @node-contextmenu="nodeContextMenu"
                :highlight-current="true"
                ref="tree"
                :data="data"
                :props="defaultProps"
                @node-click="handleNodeClick"
                node-key="id"></el-tree>
          </div>
        </div>
        <div class="home-mid-drag"   @mousedown="dragOnMouseDown($event)"></div>
        <div class="home-right">
          <div class="home-right-bottom">
            <div class="home-right-markdown">
              <mavon-editor v-model="content" class="home-right-markdown-input" ref="mavon"  @imgAdd="$imgAdd" @save="save" >
                <template v-slot:left-toolbar-after v-if="this.currentNode">
                  <div style="display: inline-flex;height: 30px;flex-direction: column">
                    <img class="share" src="../../assets/share.png" title="分享" @click="share" />
                  </div>
                </template>
              </mavon-editor>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="home-bottom"> </div>

  </div>
</template>

<script>
import userDE from "@/logic/UserDE"
export default {
  name:'Home',
  components: {
  },
  data() {
    return {
      avatar:'http://222.186.36.75:8888/blog/13.png',
      http:"http://222.186.36.75:9999/record-b",
      insertModel:true,//新增还是更新
      editableTabsValue: '2',
      tabList:[],
      dialogTableVisible:false,
      tabIndex: 2,
      drag:false,
      leftwidth:200,
      initX:0,
      content: '',
      data:[],
      currentNode:null,
      defaultProps: {
        children: 'blogs',
        label: 'title'
      },
      textarea:'123',
      options: {
        linkAttributes: {
          attrs: {
            target: '_blank',
            rel: 'noopener'
          }
        },
        katex: {
          throwOnError: false,
          errorColor: '#cc0000'
        },
        icons: 'font-awesome',
        githubToc: {
          tocFirstLevel: 2,
          tocLastLevel: 3,
          tocClassName: 'toc',
          anchorLinkSymbol: '',
          anchorLinkSpace: false,
          anchorClassName: 'anchor',
          anchorLinkSymbolClassName: 'octicon octicon-link'
        }
      }
    }
  },
  methods: {
    getHttp(){
      return this.http
    },
    save(){
      this.insert()
    },
    //右键菜单
    // eslint-disable-next-line no-unused-vars
    nodeContextMenu(event,object,node,self){
      this.currentNode = object
      this.dialogTableVisible = true
    },
    prepareForAdd(root){
      if(root){
        this.currentNode = null
      }
      this.insertModel = true
      this.dialogTableVisible = false
      this.tabList.push({id:new Date().getTime(),title:'新建'})
      this.content = ''
    },
    dropdownMenu(command){
      switch (command) {
        case "1":
          this.$router.push('/person',{})
          break
        case "3"://退出登录
          localStorage.removeItem('loginres')
            this.$route.meta.keepAlive = false
          this.$router.push('/login',{})
          break
      }
    },
    deleltBog(){
      this.$axios.post(this.getHttp()+'/blog/deleteByPrimaryKey',this.currentNode).then(res=>{
        this.dialogTableVisible = false
        this.$message(res.data.data==1?"删除成功":"删除失败")
        if(res.data.data==1){
          this.$refs.tree.remove(this.currentNode)
        }else{
          this.$message(res.data.errorMessage)
        }
      }).catch(e=>{
        this.dialogTableVisible = false
        this.$message(e)
      })
    },
    tabClick(tab){
      if(Number(tab.name)!='新增'){
        this.insertModel = false
      }
      this.content = this.getTabData(Number(tab.name)).markdown
    },
    getTabData(name){
      for(let i=0;i<this.tabList.length;i++){
        if(name==this.tabList[i].id){
          return this.tabList[i]
        }
      }
    },
    updateTabData(name,markdown){
      for(let i=0;i<this.tabList.length;i++){
        if(name==this.tabList[i].id){
          this.tabList[i].markdown = markdown
        }
      }
    },
    //保存
    insert(){
      if(this.insertModel){
        if(this.content==""){
          this.$message("至少需要一些内容")
          return;
        }
        this.$axios.post(this.getHttp()+'/blog/insert',{
          parentid:this.currentNode==null?0:this.currentNode.id,
          title:this.getFirstLineStr(this.content),
          html:this.$refs.mavon.d_render,
          markdown:this.content,
          ctime:new Date().getTime(),
          utime:new Date().getTime(),
          type:0
        }).then(res=>{
          this.$message(res.data.data.id!=0?"新增成功":"新增失败")
          if(res.data.data.id!=0){
            this.$refs.tree.append(res.data.data,this.currentNode.id)
            this.currentNode = res.data.data
            this.insertModel = false
          }
        }).catch(e=>{
          this.$message(e)
        })
      }else{
        if(this.currentNode==null){
          return
        }
        this.$axios.post(this.getHttp()+'/blog/updateByPrimaryKey',{
          id:this.currentNode.id,
          parentid:this.currentNode.parentid,
          title:this.getFirstLineStr(this.content),
          html:this.$refs.mavon.d_render,
          markdown:this.content,
          ctime:new Date().getTime(),
          utime:new Date().getTime(),
          type:0
        }).then(res=>{
          this.$message('这是一条消息提示');
          this.$message(res.data==1?"更新成功":"更新失败"+res.data)
          if(res.data==1){
            this.currentNode.markdown = this.content
            this.updateTabData(this.currentNode.id,this.content)
            // this.$refs.tree.updateKeyChildren(this.currentNode.id,)
          }
        }).catch(e=>{
          this.$message(e)
        })
      }
    },
    share(){
      this.$router.push({
        path:'/html',
        query:{id:this.currentNode.id}
      })

      // let routeData = this.$router.resolve({
      //     path:'/html',
      //     query:{id:this.currentNode.id}
      // })
      // window.open(routeData.href,'_blank')
    },
    getFirstLineStr(str){
      let title =  str.indexOf('\n')==-1?str:str.substring(0,str.indexOf('\n'))
      if(title.indexOf("# ")!=-1){
        title = title.substring(2,title.length)
      }
      return title.trim()
    },
    // eslint-disable-next-line no-unused-vars
    handleNodeClick(object,node,self){
      this.currentNode = object
      this.insertModel = false
      this.$axios.get(this.getHttp()+'/blog/selectWithOutHtmlDataByParentId',{params:{id:object.id}}).then(res=>{
        this.$refs.tree.updateKeyChildren(object.id,res.data)
        this.content = object.markdown
        this.pushTabList(object)
      }).catch(e=>{
        this.$message(e)
      })
    },
    removeTabList(id){
      //name 和 id 相等
      for(let i=0;i<this.tabList.length;i++){
        if(id==this.tabList[i].id){
          this.tabList.splice(i,1)
          break
        }
      }
    },
    pushTabList(object){
      var have = false
      for(let i=0;i<this.tabList.length;i++){
        if(object.id==this.tabList[i].id){
          have = true
          break
        }
      }
      if(!have){
        this.tabList.push(object)
      }
    },
    getchildData(i){
      this.$axios.get(this.getHttp()+'/blog/selectWithOutHtmlDataByParentId',{params:{id:i}}).then(res=>{
        this.data = res.data
        for(let i=0;i<this.data.length;i++){
          this.pushTabList(this.data[i])
        }
        this.currentNode = {id:0}
      }).catch(e=>{
        this.$message(e)
      })
    },
    // 绑定@imgAdd event
    $imgAdd(pos, $file){
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append('file', $file);
      this.$axios({
        url: this.getHttp()+"/blog/upload",
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((url) => {
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        // $vm.$img2Url 详情见本页末尾
        if(url.data.data!=null){
          this.$refs.mavon.$img2Url(pos, url.data.data);
        }
      }).catch(e=>{
        this.$message(e)
      })
    },

    dragOnMouseDown(e){
      this.drag = true
      this.initX = e.clientX
    },
    dragOnMouseMove(e){
      if(this.drag){
        let a = (e.clientX - this.initX)
        this.leftwidth = (this.leftwidth +a)
        console.error(this.leftwidth )
        this.initX = e.clientX
      }
    },
    dragOnMouseUp(e){
      e.target.clientX
      this.drag = false
    }
  },
  mounted() {
    if(!userDE.isLogined()){
      this.$route.meta.keepAlive = false
      this.$router.push('/login',{});
    }else{
      this.$route.meta.keepAlive = true
      this.getchildData(0)
    }
  }
};
</script>

<style lang="less" scoped>
@import "home.less";
</style>
