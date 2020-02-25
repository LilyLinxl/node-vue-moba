<template>
    <div class="about">
        <h1>{{id?'修改':'新建'}}分类</h1>
        <el-form  @submit.native.prevent="save" label-width="120px">
            <el-form-item>
                 <el-select v-model="model.parents" placeholder="请选择">
                    <el-option
                    v-for="item in parents"
                    :key="item._id"
                    :label="item.name"
                    :value="item._id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称" >
                <el-input v-model="model.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    props:{
      id:{}
    },
    data(){
        return {
            model:{},
            parents:[]
        }
    }, 
    methods:{
            async save(){
                //调用接口，跳转页面
                // eslint-disable-next-line no-unused-vars
                let res 
                if(this.id){
                   res = await this.$http.put(`rest/categories/${this.id}`,this.model) 
                }else{
                   res = await this.$http.post('rest/categories',this.model)
                }
               this.$router.push('/categories/list')
               this.$message({
                   type:'success',
                   message:'保存成功'
               })
            },
            async fetch(){
                const res = await this.$http.get(`rest/categories/${this.id}`,this.model) 
                this.model = res.data
            },
            async fetchParents(){
                const res = await this.$http.get('rest/categories')
                window.console.log(res)
                this.parents = res.data
            }
        },
    created(){
        this.id && this.fetch()
        this.fetchParents()
    }
}
</script>