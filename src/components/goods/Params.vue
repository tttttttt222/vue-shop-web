<template>
  <div class="params">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="主要只允许三级分类" type="warning" :closable="false" show-icon></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            v-model="selectKeys"
            :options="catelist"
            :props="cascaderProps"
            @change="parentCateChange" clearable></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisable">添加参数</el-button>

        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisable">添加属性</el-button>

        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "params",
    data() {
      return {
        catelist: [],
        selectKeys: [],
        cascaderProps: {
          expandTrigger: 'hover',
          children: 'children',
          label: 'cat_name',
          value: 'cat_id',
        },
        activeName: 'many',
      }
    },
    created() {
      this.getCateList();
    },
    methods: {
      async getCateList() {
        const {data: res} = await this.$http.get('categories', {params: {type: 3}});
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败');
        }
        this.catelist = res.data.list;
      },
      async parentCateChange() {
        this.getParamsData();
      },
      handleTabClick() {
        this.getParamsData();
      },
      async getParamsData() {
        if (this.selectKeys.length !== 3) {
          this.selectKeys = [];
          return;
        }
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: this.activeName}});
        if (res.meta.status !== 200) {
          return this.$message.error('获取分类属性失败');
        }
      }
    },
    computed: {
      isBtnDisable() {
        if (this.selectKeys.length !== 3) {
          return true;
        }
        return false;
      },
      //当前选中的三级分类id
      cateId() {
        if (this.selectKeys.length === 3) {
          return this.selectKeys[2];
        }
        return null
      }
    }
  }
</script>

<style lang="less" scoped>
  .cat_opt {
    margin: 15px 0px;
  }
</style>
