<template>
    <div class="about">
        <h1>{{id?'修改':'新建'}}管理员</h1>
        <el-form  @submit.native.prevent="save" label-width="120px">
            <el-form-item label="用户名" >
                <el-input v-model="model.username"></el-input>
            </el-form-item>
             <el-form-item label="密码" >
                <el-input type="password" v-model="model.password"></el-input>
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
        }
    }, 
    methods:{
            async save(){
                //调用接口，跳转页面
                // eslint-disable-next-line no-unused-vars
                let res 
                if(this.id){
                   res = await this.$http.put(`rest/admin_users/${this.id}`,this.model) 
                }else{
                   res = await this.$http.post('rest/admin_users',this.model)
                }
               this.$router.push('/admin_users/list')
               this.$message({
                   type:'success',
                   message:'保存成功'
               })
            },
            async fetch(){
                const res = await this.$http.get(`rest/admin_users/${this.id}`,this.model) 
                this.model = res.data
            }
        },
    created(){
        this.id && this.fetch()
    }
}
</script>