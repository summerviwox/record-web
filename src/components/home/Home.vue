<template>
    <div class="home-root">
        <el-dialog title="菜单" :visible.sync="dialogTableVisible">
            <div>
                <div class="contextmenu-root-add contextmenu-item hand" @click="prepareForAdd(true)">新增根目录</div>
                <div class="contextmenu-add  contextmenu-item hand" @click="prepareForAdd(false)">新建</div>
                <div class="contextmenu-delete  contextmenu-item hand" @click="deleltBog">删除</div>
            </div>
        </el-dialog>
        <div class="home-top">
            <el-menu
                    class="el-menu-demo"
                    mode="horizontal"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                <el-menu-item index="1">处理中心</el-menu-item>
                <el-submenu index="2">
                    <template slot="title">我的工作台</template>
                    <el-menu-item index="2-1">选项1</el-menu-item>
                    <el-menu-item index="2-2">选项2</el-menu-item>
                    <el-menu-item index="2-3">选项3</el-menu-item>
                    <el-submenu index="2-4">
                        <template slot="title">选项4</template>
                        <el-menu-item index="2-4-1">选项1</el-menu-item>
                        <el-menu-item index="2-4-2">选项2</el-menu-item>
                        <el-menu-item index="2-4-3">选项3</el-menu-item>
                    </el-submenu>
                </el-submenu>
                <el-menu-item index="3" disabled style="flex: 1"></el-menu-item>
                <div class="home-top-save">
                    <el-button class="home-top-save-btn" type="primary" size="medium" @click="insert">{{getOperateStr}}</el-button>
                </div>
            </el-menu>
        </div>

        <div class="home-content">
            <div class="home-content-content">
                <div class="home-left">
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
                <div class="home-right">
                    <div class="home-right-top">
                        <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTabList" @tab-click="tabClick">
                            <el-tab-pane
                                    v-for="(item) in tabList"
                                    :key="item.id"
                                    :label="item.title"
                                    :name="item.id.toString()"
                            >
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <div class="home-right-bottom">
                        <div class="home-right-markdown">
                        <textarea
                                ref="input"
                                class="home-right-markdown-input"
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="content">
                        </textarea>
                            <!--                <div contenteditable="true">-->
                            <!--                    {{content}}-->
                            <!--                </div>-->
                        </div>
                        <div class="home-right-html" ref="html">
                            <markdown-it-vue class="home-right-html-content" :content="content" :options="options" />
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name:'Home',
        components: {
        },
        data() {
            return {
                insertModel:true,//新增还是更新
                editableTabsValue: '2',
                tabList:[],
                dialogTableVisible:false,
                tabIndex: 2,


                content: '# your markdown content',
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
            deleltBog(){
                this.$axios.post('/blog/deleteByPrimaryKey',this.currentNode).then(res=>{
                    this.dialogTableVisible = false
                    alert(res.data==1?true:false)
                }).catch(e=>{
                    this.dialogTableVisible = false
                    alert(e)
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
            //保存
            insert(){
                if(this.insertModel){
                    this.$axios.post('/blog/insert',{
                        parentid:this.currentNode==null?0:this.currentNode.id,
                        title:this.getFirstLineStr(this.content),
                        html:this.$refs.html.outerHTML,
                        markdown:this.content,
                        ctime:new Date().getTime(),
                        utime:new Date().getTime(),
                        type:0
                    }).then(res=>{
                        alert(res.data==1?true:false)
                    }).catch(e=>{
                        alert(e)
                    })
                }else{
                    if(this.currentNode==null){
                        return
                    }
                    this.$axios.post('/blog/updateByPrimaryKey',{
                        id:this.currentNode.id,
                        parentid:this.currentNode.parentid,
                        title:this.getFirstLineStr(this.content),
                        html:this.$refs.html.outerHTML,
                        markdown:this.content,
                        ctime:new Date().getTime(),
                        utime:new Date().getTime(),
                        type:0
                    }).then(res=>{
                        alert(res.data==1?true:false)
                    }).catch(e=>{
                        alert(e)
                    })
                }
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
                this.$axios.get('/blog/selectByParentId',{params:{id:object.id}}).then(res=>{
                    this.$refs.tree.updateKeyChildren(object.id,res.data)
                    this.content = object.markdown
                    this.pushTabList(object)
                }).catch(e=>{
                    alert(e)
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
                this.$axios.get('/blog/selectByParentId',{params:{id:i}}).then(res=>{
                    this.data = res.data
                    for(let i=0;i<this.data.length;i++){
                        this.pushTabList(this.data[i])
                    }
                }).catch(e=>{
                    alert(e)
                })
            }
        },
        mounted() {
            this.getchildData(0)
        },
        computed:{
            getOperateStr(){
                return this.insertModel ?"新增":"更新"
            }
        }
    };
</script>

<style scoped>
    .hand{
        cursor: pointer;
    }
    .home-root{
        display: flex;
        flex-direction: column;
        overflow: hidden;
        width: 100%;
        height: 100%;
    }
    .home-content{
        display: flex;
        flex-direction: row;
        flex: 1;
        height: 100%;
        overflow-y: scroll;
    }
    .home-content-content{
        display: flex;
        flex-direction: row;
        flex: 1;
        height: 100%;
        overflow-y: hidden;
    }
    .home-left{
        background: #545C64;
        width: 200px;
    }
    .contextmenu-item{
        padding: 10px;
    }
    .home-left-tree{
    }
    .home-right{
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 100%;
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
    .el-menu-demo{
        display: flex;
        flex-direction: row;
    }
    .home-top-save{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding-right: 20px;
    }
    .home-top-save-btn{
        height: 35px;
    }
    /deep/.is-current>.el-tree-node__content{
        background: white;
        position: relative;
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
