<template>
    <div class="home-root">
        <div class="home-left">
            <div @click="getData" >保存</div>
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
        <div class="home-right">
            <div class="home-right-markdown">
                <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="content">
                </el-input>
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
                data: [{
                    label: '一级 1',
                    children: [{
                        label: '二级 1-1',
                        children: [{
                            label: '三级 1-1-1'
                        }]
                    }]
                }, {
                    label: '一级 2',
                    children: [{
                        label: '二级 2-1',
                        children: [{
                            label: '三级 2-1-1'
                        }]
                    }, {
                        label: '二级 2-2',
                        children: [{
                            label: '三级 2-2-1'
                        }]
                    }]
                }, {
                    label: '一级 3',
                    children: [{
                        label: '二级 3-1',
                        children: [{
                            label: '三级 3-1-1'
                        }]
                    }, {
                        label: '二级 3-2',
                        children: [{
                            label: '三级 3-2-1'
                        }]
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                textarea:'123'
            }
        },
        methods: {
            handleNodeClick(data) {
                console.log(data);
            },
            //在 Input 失去焦点时触发
            blur(event){
                event
            },
            getData(){
                // this.$axios.post('http://222.186.36.75:9999/record-b/blog/insert',{
                //     parentid:0,
                //     title:'text',
                //     html:this.$refs.html.outerHTML,
                //     markdown:this.content,
                //     ctime:new Date().getTime(),
                //     utime:new Date().getTime(),
                //     type:0
                // }).then(res=>{
                //     alert(res)
                // }).catch(e=>{
                //     alert(e)
                // })
                this.$axios.get('http://222.186.36.75:9999/record-b/blog/selectByPrimaryKey',{id:0}).then(res=>{
                    alert(res)
                }).catch(e=>{
                    alert(e)
                })
            }
        },
        watch:{

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
    }
    .home-right-html{
        flex: 1;
    }
</style>