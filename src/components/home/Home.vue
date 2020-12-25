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

    </div>

    <div class="home-mid">
      <div class="home-mid-left blockborder"  v-if="visible.blogDirs" ref="homemidleft" :style="{width:leftwidth +'px'}">

        <el-tabs v-model="activeName" type="border-card" class="home-left-tabs" :stretch="tabstretch">
          <el-tab-pane label="目录" name = "目录">
            <div class="home-left-dir-content scroll">
              <el-tree
                  class="home-left-tree"
                  @node-contextmenu="nodeContextMenu"
                  :highlight-current="true"
                  ref="tree"
                  :data="data"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                  node-key="id"
                  @node-drop="handleDrop"
                  draggable
              ></el-tree>
            </div>
          </el-tab-pane>
          <el-tab-pane label="搜索" class="home-left-search" name="搜索">
            <el-input v-model="searchInput" placeholder="请输入内容" @keyup.enter.native="articleSearch($event)" class="home-left-search-input" size="small" suffix-icon="el-icon-search"></el-input>
            <div class="home-left-search-articles scroll">
              <el-tree
                  class="home-left-tree"
                  @node-contextmenu="nodeContextMenu"
                  :highlight-current="true"
                  ref="searchtree"
                  :data="searchArtilces"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                  node-key="id"
              ></el-tree>
              <!--                <div class="home-mid-left-search-article"  v-for="item in searchArtilces" :key="item.id" @click="handleNodeClick(item)">-->
              <!--                  {{item.title}}-->
              <!--                </div>-->
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="home-mid-drag"  ref="homemiddrag" v-if="visible.dragArea"  @mousedown="dragOnMouseDown($event)"></div>
      <div class="home-mid-right home-review">
        <mavon-editor class="home-review-markdown" :scrollStyle="scrollStyle" :code_style="code_style" v-model="content" ref="mavon" @imgAdd="$imgAdd" @save="save" >
          <template v-slot:left-toolbar-after v-if="this.currentNode">
            <div style="display: inline-flex;height: 30px;flex-direction: column">
              <img class="share" src="../../assets/share.png" title="分享" @click="share" />
            </div>
            <el-slider @input="slderchange" class="slider" :step="10" v-model="slidervalue"></el-slider>

            <img src="../../assets/reset.png" class="reset" @click="sliderReset"/>
          </template>
          <template v-slot:left-toolbar-before>
            <el-switch
                @change="lefttreeSwitchChangeMethod"
                v-model="lefttreeSwitchValue"
                active-color="#409EFF"
                inactive-color="gray">
            </el-switch>
          </template>
        </mavon-editor>
        <div class="home-review-html">
          <div class="home-review-html-top">
            <input type="text" v-model="reviewhtml"/>
          </div>
          <iframe class="home-review-html-mid" :src="reviewhtml"></iframe>
        </div>
        <re-view class="home-review-code"></re-view>
      </div>
    </div>

    <div class="home-bottom">
      <div class="home-top-content">
        <div class="home-top-left">
        </div>
        <div class="home-top-right">
          <el-dropdown @command="dropdownMenu">
            <div class="home-top-right-content">
              <el-image
                  style="width: 30px; height:30px"
                  :src="avatar"
                  fit="fill"></el-image>
              <div class="home-top-right-name">summer</div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="4">review</el-dropdown-item>
              <el-dropdown-item command="1">个人中心</el-dropdown-item>
              <el-dropdown-item command="2">账号设置</el-dropdown-item>
              <el-dropdown-item command="3">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import userDE from "@/logic/UserDE"
import ReView from "@/components/review/ReView";
export default {
  name:'Home',
  components: {
    ReView
  },
  data() {
    return {
      reseturl:require('@/assets/reset.png'),
      visible:{
        blogDirs:true,
        dragArea:true,
      },
      lefttreeSwitchValue:true,
      slidervalue:50,
      reviewhtml:'http://www.baidu.com',
      scrollStyle:false,
      code_style:'dracula',
      tabstretch:true,
      activeName:"目录",
      searchArtilces:[],
      searchInput:"",
      avatar:'http://222.186.36.75:8888/blog/13.png',
      http:"https://www.summerman.top:9999/record-b",
      insertModel:true,//新增还是更新
      editableTabsValue: '2',
      tabList:[],
      dialogTableVisible:false,
      tabIndex: 2,
      drag:false,
      leftwidth:250,
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
      if(this.activeName!=='目录'){
        return
      }
      this.currentNode = object
      console.log(this.currentNode)
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
          localStorage.setItem('loginres','')
          this.$router.push('/login',{})
          break
        case "4":
          this.$router.push('/review',{})
          break
      }
    },
    deleltBog(){
      this.$Http.post(this.getHttp()+'/blog/deleteByPrimaryKey',this.currentNode).then(res=>{
        this.dialogTableVisible = false
        this.$message({message:res.data.data==1?"删除成功":"删除失败",duration:1000})
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
    //保存
    insert(){
      if(this.insertModel){
        if(this.content==""){
          this.$message("至少需要一些内容")
          return;
        }
        this.$Http.post(this.getHttp()+'/blog/insert',{
          parentid:this.currentNode==null?0:this.currentNode.id,
          title:this.getFirstLineStr(this.content),
          html:this.$refs.mavon.d_render,
          markdown:this.content,
          ctime:new Date().getTime(),
          utime:new Date().getTime(),
          type:0
        }).then(res=>{
          this.$message({message:res.data.data.id!=0?"新增成功":"新增失败",duration:1000})
          if(res.data.data.id!=0){
            this.$refs.tree.append(res.data.data,this.currentNode.id)//res.data.data 已关联data
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
        this.$Http.post(this.getHttp()+'/blog/updateByPrimaryKey',{
          id:this.currentNode.id,
          parentid:this.currentNode.parentid,
          title:this.getFirstLineStr(this.content),
          html:this.$refs.mavon.d_render,
          markdown:this.content,
          ctime:new Date().getTime(),
          utime:new Date().getTime(),
          type:0
        }).then(res=>{
          this.$message({message:res.data==1?"更新成功":"更新失败"+res.data,duration:1000})
          if(res.data==1){
            this.currentNode.markdown = this.content
          }
          var node = (this.activeName === '目录')?this.$refs.searchtree.getNode(this.currentNode.id):this.$refs.tree.getNode(this.currentNode.id)
          if(node){
            node.data = this.currentNode
          }
        }).catch(e=>{
          this.$message(e)
        })
      }
    },

    share(){
      // this.$router.push({
      //   path:'/html',
      //   query:{id:this.currentNode.id}
      // })

      let routeData = this.$router.resolve({
        name:'html',
        query:{id:this.currentNode.id}
      })
      window.open(routeData.href,'_blank')
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

      this.$Http.get(this.getHttp()+'/blog/selectWithOutHtmlDataByParentId',{params:{id:object.id}}).then(res=>{
        this.toHttps(res.data)
        if(this.activeName==="目录"){
          this.$refs.tree.updateKeyChildren(object.id,res.data)
        }else{
          this.$refs.searchtree.updateKeyChildren(object.id,res.data)
        }
        this.content = object.markdown
      }).catch(e=>{
        this.$message(e)
      })
    },
    getchildData(i){
      this.$Http.get(this.getHttp()+'/blog/selectWithOutHtmlDataByParentId',{params:{id:i}}).then(res=>{
        this.toHttps(res.data)
        this.data = res.data
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
      this.$Http({
        url: this.getHttp()+"/blog/upload",
        method: 'post',
        data: formdata,
        accept: "file",
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
    },
    //文章搜索
    articleSearch(){
      if(this.searchInput==''){
        this.$message.warning("请输入搜索内容")
        return
      }
      this.$Http.post(this.getHttp()+'/blog/search',{
        markdown:this.searchInput
      }).then(res=>{
        this.searchArtilces = res.data.data
      }).catch(e=>{
        this.$message(e)
      })
    },
    //拖拽功能
    handleDrop(draggingNode, dropNode, dropType) {
      console.log('tree drop: ',draggingNode.data, dropNode.data,dropType);
      this.$Http.post(this.getHttp()+"/blog/updateParentIdByPrimaryKey",{
        id:draggingNode.data.id,
        parentid:(dropType==="inner")?dropNode.data.id:dropNode.data.parentid
      })
          .then(res=>{
            this.$message((res.data===1)?"成功":"失败")
          })
          .catch(e=>{
            this.$message(e)
          })
    },
    //滑动改变编辑栏和预览栏比例
    slderchange(v){
      this.$refs.mavon.$el.getElementsByClassName("v-note-edit divarea-wrapper transition")[0].style.flex  = v
      this.$refs.mavon.$el.getElementsByClassName("v-note-show")[0].style.flex  =100- v
    },
    sliderReset(){
      this.slidervalue = 50
    },
    // eslint-disable-next-line no-unused-vars
    lefttreeSwitchChangeMethod(is){
        this.visible.dragArea = is
        this.visible.blogDirs = is
    },
    toHttps(data){
      for(let i=0;i<data.length;i++){
        data[i].markdown = data[i].markdown.replace("http://222.186.36.75:8888","https://www.summerman.top:7777")
      }
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
  },
};
</script>

<style lang="less" scoped>
@import "home.less";
</style>
