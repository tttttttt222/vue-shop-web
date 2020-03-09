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
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index
                  index-text="#" border :show-row-hover="false" stripe>
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === 0" style="color:lightgreen;"></i>
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

    <!--添加权限-->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClose()">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_pid">
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCateList()">确 定</el-button>
      </span>
    </el-dialog>
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
          {label: '操作', type: 'template', template: 'opt'},
        ],
        addCateDialogVisible: false,
        addCateForm: {
          cat_name: '',
          cat_pid: 0,
          cat_level: 0,
        },
        addCateFormRules: {
          cat_name: [{required: true, message: '请输入邮箱', trigger: 'blur'}],
        },
        parentCateList: [],
        cascaderProps: {
          expandTrigger: 'hover',
          children: 'children',
          label: 'cat_name',
          value: 'cat_id',
          checkStrictly: true
        },
        selectKeys: []
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
      },
      showAddCateDialog() {
        this.getParentCateList();
        this.addCateDialogVisible = true;
      },
      async getParentCateList() {
        const {data: res} = await this.$http.get('categories', {params: {type: 2}});
        if (res.meta.status !== 200) {
          return this.$message.error('获取父级列表失败');
        }
        this.parentCateList = res.data.list;
      },
      parentCateChange() {
        // console.log(this.selectKeys)
        if (this.selectKeys.length > 0) {
          this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
          this.addCateForm.cat_level = this.selectKeys.length;
          return;
        } else {
          this.addCateForm.cat_pid = 0;
          this.addCateForm.cat_level = 0;
        }
      },
      async saveCateList() {
        this.$refs.addCateFormRef.validate(async valid => {
          if (!valid) return;
          const {data: res} = await this.$http.post('categories', this.addCateForm);
          if (res.meta.status !== 200) {
            return this.$message.error('添加分类失败');
          }
          this.$message.success('添加分类成功');
          this.getCateList();
          this.addCateDialogVisible = false;
        })
      },
      addCateDialogClose() {
        this.$refs.addCateFormRef.resetFields();
        this.selectKeys = [];
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-cascader {
    width: 100%;
  }
</style>
