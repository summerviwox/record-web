<template>
    <div class="home-root">
        <div class="home-left">
            <div @click="getData" >保存</div>
            <el-tree
                    ref="tree"
                    :data="data"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                    node-key="id"></el-tree>
        </div>
        <div class="home-right">
            <div class="home-right-markdown">
                <el-input
                        ref="input"
                        class="home-right-markdown-input"
                        autosize
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="content">
                </el-input>
<!--                <div contenteditable="true">-->
<!--                    {{content}}-->
<!--                </div>-->
            </div>
            <div class="home-right-html" ref="html">
                <markdown-it-vue class="home-right-html-content" :content="content"/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'Home',
        data() {
            return {
                content: '# your markdown content',
                data:[],
                currentNode:null,
                defaultProps: {
                    children: 'blogs',
                    label: 'title'
                },
                textarea:'123'
            }
        },
        methods: {
            getData(){
                this.$axios.post('/blog/insert',{
                    parentid:this.currentNode.id,
                    title:'text',
                    html:this.$refs.html.outerHTML,
                    markdown:this.content,
                    ctime:new Date().getTime(),
                    utime:new Date().getTime(),
                    type:0
                }).then(res=>{
                    alert(res)
                }).catch(e=>{
                    alert(e)
                })

            },
            // eslint-disable-next-line no-unused-vars
            handleNodeClick(object,node,self){
                this.$axios.get('/blog/selectByParentId',{params:{id:node.id}}).then(res=>{
                    this.$refs.tree.updateKeyChildren(node.id,res.data)
                    this.currentNode = node
                    this.content = object.markdown
                }).catch(e=>{
                    alert(e)
                })
            },
            getchildData(i){
                this.$axios.get('/blog/selectByParentId',{params:{id:i}}).then(res=>{
                    this.data = res.data
                }).catch(e=>{
                    alert(e)
                })
            }
        },
        mounted() {
            this.getchildData(0)
        }
    };
</script>

<style scoped>
    .home-root{
        display: flex;
        flex-direction: row;
    }
    .home-left{
        width: 200px;
    }
    .home-right{
        flex: 1;
        display: flex;
        flex-direction: row;
    }
    .home-right-markdown{
        flex: 1;
        overflow-y: hidden;
    }
    .home-right-html{
        flex: 1;
    }
    .home-right-markdown-input{
        overflow-y: hidden;
    }
</style>
