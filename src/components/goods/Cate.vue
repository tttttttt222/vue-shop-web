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
      <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index
                  index-text="#" border :show-row-hover="false" stripe>
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen;"></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag size="min" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="min" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="min" v-else>三级</el-tag>
        </template>

        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="min">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="min">删除</el-button>
        </template>
      </tree-table>
      <!--分页-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[1,5, 10, 30,50]" :page-size="queryInfo.pagesize"
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
        total: 0,
        columns: [{label: '分类名称', prop: 'cat_name'},
          {label: '是否有效', type: 'template', template: 'isok'},
          {label: '排序', type: 'template', template: 'order'},
          {label: '操作',type: 'template', template: 'opt'},
        ]
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
        console.log(res);
        this.catelist = res.data.list;
        this.total = res.data.total;
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getCateList();
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getCateList();
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
