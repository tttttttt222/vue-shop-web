<template>
  <div class="cate">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <el-table>

      </el-table>
      <!--分页-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[1,2, 10, 30,50]" :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
  export default {
    name: "cate",
    data() {
      return {
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        catelist: [],
        total:0,
      }
    },
    created() {
      this.getCateList();
    },
    methods: {
      //获取商品列表
      async getCateList() {
        const {data: res} = await this.$http.get('categories', {params: this.queryInfo});
        if (res.meta.status !== 200) {
          return this.$message.error('获取列表失败');
        }
        this.catelist = res.data;
        this.total = res.total;
      },
      handleSizeChange(){

      },
      handleCurrentChange(){

      }
    }
  }
</script>

<style lang="less" scoped>

</style>
