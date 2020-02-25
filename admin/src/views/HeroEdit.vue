<template>
    <div class="about">
        <h1>{{id?'修改':'新建'}}英雄</h1>
        <el-form  @submit.native.prevent="save" label-width="120px">
            <el-tabs type="border-card" value="skills">
                <el-tab-pane label="基础信息" name="basic">
                    <el-form-item label="名称" >
                        <el-input v-model="model.name"></el-input>
                    </el-form-item>
                
                    <el-form-item label="称号" >
                        <el-input v-model="model.title"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" >
                        <el-select v-model="model.categories" multiple>
                            <el-option v-for="item of categories" :key="item._id"
                            :label="item.name" :value="item._id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="难度">
                        <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.difficult"></el-rate>
                    </el-form-item>
                    <el-form-item label="技能">
                        <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.skills"></el-rate>
                    </el-form-item>
                    <el-form-item label="攻击">
                        <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.attack"></el-rate>
                    </el-form-item>
                    <el-form-item label="生存">
                        <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.survive"></el-rate>
                    </el-form-item>
                    <el-form-item label="头像" >
                        <el-upload
                            class="avatar-uploader"
                            :action="$http.defaults.baseURL+'/upload'"
                            :show-file-list="false"
                            :on-success="afterUpload">
                            <img v-if="model.avatar" :src="model.avatar" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="顺风出装" >
                        <el-select v-model="model.items1" multiple>
                            <el-option v-for="item of items" :key="item._id"
                            :label="item.name" :value="item._id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="逆风出袭" >
                        <el-select v-model="model.items2" multiple>
                            <el-option v-for="item of items" :key="item._id"
                            :label="item.name" :value="item._id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="使用技巧">
                        <el-input type="textarea" v-model="model.usageTips">
                        </el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="技能" name="skills">
                    <el-button type="button" size="small"
                    @click="model.skills.push({})"><i class="el-icon-plus"></i>添加技能</el-button>
                    <el-row type="flex" style="flex-wrap:wrap;">
                        <el-col :md="12" v-for="(item,index) in model.skills" :key="index">
                            <el-form-item label="名称">
                                <el-input v-model="item.name"></el-input>
                            </el-form-item>
                            <el-form-item label="图标">
                                <el-upload
                                    class="avatar-uploader"
                                    :action="$http.defaults.baseURL+'/upload'"
                                    :show-file-list="false"
                                    :on-success="res => $set(item,'icon',res.url)">
                                    <img v-if="item.icon" :src="item.icon" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="描述">
                                <el-input type="textarea" v-model="item.description"></el-input>
                            </el-form-item>
                             <el-form-item label="提示">
                                <el-input type="textarea" v-model="item.tip"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button size="small" type="danger" @click="model.skills.splice(i,1)">
                                    删除
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                 
                </el-tab-pane>
            </el-tabs>
            <el-form-item style="margin-top:1rem;">
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
            categories:[],
            items:[],
            model:{
                name:'',
                avatar:'',
                scores:{},
                items1:[],
                items2:[],
                usageTip:'',
                skills:[]
            }
        }
    }, 
    methods:{
            async save(){
                //调用接口，跳转页面
                // eslint-disable-next-line no-unused-vars
                let res 
                if(this.id){
                   res = await this.$http.put(`rest/heros/${this.id}`,this.model) 
                }else{
                   res = await this.$http.post('rest/heros',this.model)
                }
               this.$router.push('/heros/list')
               this.$message({
                   type:'success',
                   message:'保存成功'
               })
            },
            async fetch(){
                const res = await this.$http.get(`rest/heros/${this.id}`,this.model) 
                // this.model = res.data
                this.model = Object.assign({}, this.model, res.data)
                //避免没有获取到数据使得初始化的数据为undefined
            },
            async fetchCategories(){
                const res = await this.$http.get(`rest/categories`,this.model) 
                this.categories = res.data
            },
             async fetchItems(){
                const res = await this.$http.get(`rest/items`,this.model) 
                this.items = res.data
            },
            afterUpload(res){
                this.model.avatar = res.url 
            }
        },
    created(){
        this.id && this.fetch()
        this.fetchCategories()
        this.fetchItems()
    }
}
</script>
<style scoped>
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 78px;
    height: 78px;
    display: block;
  }
</style>