<template>
  <div class="home-root" @mousemove="dragOnMouseMove($event)" @mouseup="dragOnMouseUp($event)">
    <el-dialog title="菜单" :visible.sync="dialogTableVisible">
      <div>
        <div class="contextmenu-root-add contextmenu-item hand" @click="prepareForAdd(true)">新增根目录</div>
        <el-divider></el-divider>
        <div class="contextmenu-add  contextmenu-item hand" @click="prepareForAdd(false)">新建</div>
        <el-divider></el-divider>
        <div class="contextmenu-delete  contextmenu-item hand" @click="deleltBog">删除</div>
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
          <div class="home-right-top">
            <div class="home-right-top-tabscontent">
              <el-tabs class="el-tabs" v-model="editableTabsValue" type="card" closable @tab-remove="removeTabList" @tab-click="tabClick">
                <el-tab-pane
                    v-for="(item) in tabList"
                    :key="item.id"
                    :label="item.title"
                    :name="item.id.toString()"
                >
                </el-tab-pane>
              </el-tabs>
            </div>
            <div class="home-right-top-save">
              <el-button class="home-right-top-save-btn" size="medium" @click="insert">{{getOperateStr}}</el-button>
              <el-button class="home-right-top-share-btn" size="medium" @click="share" v-if="this.currentNode">分享</el-button>
            </div>
          </div>
          <div class="home-right-bottom">
            <div class="home-right-markdown">
              <mavon-editor v-model="content" class="home-right-markdown-input" ref="mavon"  @imgAdd="$imgAdd" @save="save" >
                <template v-slot:left-toolbar-after v-if="this.currentNode">
                  <div style="display: inline-flex;height: 30px;flex-direction: column">
                    <img class="save" src="../../assets/share.png" title="分享" @click="share" />
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
        case "3"://退出登录
          localStorage.removeItem('loginres')
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
    if(!localStorage.getItem('loginres')){
      this.$router.push('/login',{});
    }else{
      this.getchildData(0)
    }
    // document.getElementsByClassName("v-show-content scroll-style scroll-style-border-radius")[0].style.backgroundColor = 'transparent'
    // document.getElementsByClassName("content-input-wrapper")[0].style.backgroundColor = 'transparent'
    // document.getElementsByClassName("auto-textarea-wrapper content-input")[0].style.backgroundColor = 'transparent'



  },
  computed:{
    getOperateStr(){
      return this.insertModel ?"新增":"更新"
    }
  }
};
</script>

<style scoped>
.save{
  padding: 3px;
  width: 20px;
  height: 20px;
  position: relative;
  top: 8px
}
.save:hover{
  background-color: #E9E9EB;
  border-radius: 4px;
}
.hand{
  cursor: pointer;
}
.el-divider{
  margin-top: 5px;
  margin-bottom: 5px;
}
.home-root{
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-image: url("../../assets/noisy_grid.png") ;

}
.home-content{
  display: flex;
  flex-direction: row;
  flex: 1;
  height: 100%;
  overflow-y: scroll;
  width: 100%;
  overflow: hidden;
}
.home-content-content{
  display: flex;
  flex-direction: row;
  flex: 1;
  height: 100%;
  width: 100%;
}
.home-top{
  border-bottom: 1px gainsboro solid;
  display: flex;
  flex-direction: column;
  /*background: #F7F7F7;*/
  height: 50px;
}
.home-top-content{
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.home-top-left{
  flex: 1;
}
.home-top-right{
  padding-right: 10px;
  cursor: pointer;
}
.home-top-right-content{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.home-top-right-name{
  padding-left: 2px;
}

.el-tabs{
  width: 100%;
}
.home-right-top-tabscontent{
  width: calc(100% - 160px);
}


.home-right-top-save{
  display: flex;
  width: 150px;
  justify-content: flex-end;
  flex-direction: row;
  padding-right: 4px;
  padding-left: 4px;
}
.home-right-top-save-btn{
  height: 35px;
}
.home-left{
  border-right: 1px gainsboro solid;
  /*background: white;*/
  width: auto;
  min-width: 200px;
  overflow-y: auto;
  background: url("../../assets/hexellence.png");

}

.home-mid-drag{
  width: 10px;
  cursor:pointer;
}

.home-left::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.home-left::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background:darkgray;
}
.home-left::-webkit-scrollbar-track {
  background: gainsboro;
}

/deep/.v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper.scroll-style::-webkit-scrollbar {
  width: 4px;
  background-color: #e5e5e5;
}

/deep/.v-note-wrapper .v-note-panel .v-note-show .v-show-content.scroll-style::-webkit-scrollbar, .v-note-wrapper .v-note-panel .v-note-show .v-show-content-html.scroll-style::-webkit-scrollbar {
  width: 4px;
  background-color: #e5e5e5;
}

.home-left-content{
  width: 100%;

}
.contextmenu-item{
  padding: 10px;
  font-size: 18px;

}
.home-left-tree{
  width: 100%;
}
.home-right{
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.home-right-top{
  display: flex;
  flex-direction: row;
  padding-top: 2px;
  background: url("../../assets/hexellence.png");
  align-items: center;
  display: none;
}

.home-right-bottom{
  display: flex;
  flex-direction: row;
  height: 100%;
}

.home-right-markdown{
  flex: 1;
  overflow-y: hidden;
  height: 100%;
}
.home-right-html{
  flex: 1;
  height: 100%;
}
.home-right-html-content{
  height: 100%;
  overflow-y: scroll;
  text-align: left;
}
.home-right-markdown-input{
  height: 100%;
  width: 100%;
}
.el-tree{
  background: transparent;
  color: black;
}


.el-menu-demo{
  display: flex;
  flex-direction: row;
}
/deep/ .el-tabs__header{
  margin-bottom: 0px;
}

/deep/.is-current>.el-tree-node__content{
  /*background: white;*/
  position: relative;
}

/deep/ .el-tree-node__content{
  height: 40px;
  border-bottom: 1px gainsboro solid;
}

/deep/.is-current>.el-tree-node__content::before{
  content: "";
  position: absolute;
  width:5px;
  height: 100%;
  background: #409EFF;
  top: 0;
  left: 0;;
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

/*/deep/ .v-note-wrapper{*/
/*    background-color: transparent;*/
/*}*/
/*/deep/ textarea{*/
/*    background-color: transparent;*/
/*}*/
/*/deep/ .content-input-wrapper{*/
/*    background-color: transparent;*/
/*}*/
/*/deep/ .content-input{*/
/*    background-color: transparent;*/
/*}*/

/*/deep/ element.style{*/
/*    background-color: transparent;*/
/*}*/



/deep/ .v-note-edit{
  width: 10px;
}
/deep/ .v-note-show{
  flex: 1;
}

.home-bottom{
  height: 20px;
  border-top: 1px gainsboro solid;
  /*background-color:white;*/
}
</style>
