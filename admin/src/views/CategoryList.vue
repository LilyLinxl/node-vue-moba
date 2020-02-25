<template>
  <el-table :data="items">
     <el-table-column prop="_id" label="ID" width="250">
     </el-table-column>
     <el-table-column prop="name" label="分类名称" width="200">
     </el-table-column>
      <el-table-column prop="parents.name" label="父级分类" width="200">
     </el-table-column>
      <el-table-column
      label="操作"
      width="100">
      <template v-slot="scope">
        <el-button type="text" size="small" @click="$router.push(`/categories/edit/${scope.row._id}`)">编辑</el-button>
        <el-button type="text" size="small" @click="remove(scope.row)">删除</el-button>
      </template>
    </el-table-column>
   </el-table>
</template>

<script>
export default {
  name:'CategoryList',
  data () {
    return {
      items:[]
    }
  },
  methods:{
    async fetch(){
      const res = await this.$http.get('rest/categories')
      this.items = res.data
      window.console.log(res.data)
    },
    async remove(row){
      this.$confirm(`确认删除"${row.name}"吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          // eslint-disable-next-line no-unused-vars
          const res = await this.$http.delete(`rest/categories/${row._id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.fetch()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })        
        })
    }
  },
  created(){
    this.fetch()
  }
}

</script>
<style scoped>
</style>