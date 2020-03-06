<template>
  <div class="rights">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限配置</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区-->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addMainRightsDialogShow()">添加权限</el-button>
        </el-col>
      </el-row>
      <el-table :data="rightsList" row-key="id" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === 1">一级</el-tag>
            <el-tag v-else-if="scope.row.level === 2" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-circle-plus-outline" size="mini"
                       @click="addRightsFormDialogShow(scope.row)" v-if="scope.row.level !== 3"></el-button>
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="showRightsEditDialog(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="removeMenuById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--添加权限-->
    <el-dialog title="添加权限" :visible.sync="addDialogVisible" width="60%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addRightesFormRef" label-width="100px">
        <el-form-item label="权限名称" prop="authName">
          <el-input v-model="addForm.authName"></el-input>
        </el-form-item>
        <el-form-item label="权限路径" prop="path">
          <el-input v-model="addForm.path"></el-input>
        </el-form-item>
        <el-form-item label="父权限" prop="pid">
          <el-select v-model="addForm.pid" placeholder="请选择父id" disabled>
            <el-option v-for="item in pidOptList" :key="item.id" :label="item.authName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否展示" prop="display">
          <el-select v-model="addForm.display" placeholder="请选择是否菜单展示" disabled>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-tag v-if="addForm.level === 1">一级</el-tag>
          <el-tag v-else-if="addForm.level === 2" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRightes">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户-->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="60%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editRightsFormRef" label-width="100px">
        <el-form-item label="权限名称" prop="authName">
          <el-input v-model="editForm.authName"></el-input>
        </el-form-item>
        <el-form-item label="权限路径" prop="path">
          <el-input v-model="editForm.path"></el-input>
        </el-form-item>
        <el-form-item label="父权限" prop="pid">
          <el-select v-model="editForm.pid" placeholder="请选择父id" disabled>
            <el-option v-for="item in pidOptList" :key="item.id" :label="item.authName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否展示" prop="display">
          <el-select v-model="editForm.display" placeholder="请选择是否菜单展示" disabled>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-tag v-if="editForm.level === 1">一级</el-tag>
          <el-tag v-else-if="editForm.level === 2" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editMenuInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "rights",
    data() {
      return {
        //权限列表
        rightsList: [],
        addDialogVisible: false,
        editDialogVisible: false,
        addForm: {
          authName: '',
          path: '',
          pid: 0,
          display: 0,
          level: 1
        },
        addFormRules: {
          authName: [{required: true, message: '请输入权限名称', trigger: 'blur'}],
          pid: [{required: true, message: '请选择父权限', trigger: 'blur'}],
          display: [{required: true, message: '请选择是否展示', trigger: 'blur'}],
        },
        pidOptList: [],
        editForm: {
          authName: '',
          path: '',
          pid: 0,
          display: 0,
          level: 1
        },
        editFormRules: {
          authName: [{required: true, message: '请输入权限名称', trigger: 'blur'}],
          pid: [{required: true, message: '请选择父权限', trigger: 'blur'}],
          display: [{required: true, message: '请选择是否展示', trigger: 'blur'}],
        },
      }
    },
    created() {
      this.getRightsList();
      this.getRightsOptList();
    },
    methods: {
      async getRightsList() {
        const {data: res} = await this.$http.get('rights/tree');
        if (res.meta.status != 200) {
          return this.$message.error('获取权限列表失败');
        }
        this.rightsList = res.data;
      },
      async getRightsOptList() {
        const {data: res} = await this.$http.get('rights/list');
        if (res.meta.status != 200) {
          return this.$message.error('获取权限列表失败');
        }
        this.pidOptList = res.data;
        this.pidOptList.push({id: 0, authName: '主菜单'});
      },
      addRightsFormDialogShow(row) {
        this.addForm.level = row.level + 1;
        if (this.addForm.level == 3) {
          this.addForm.display = 0;
        } else {
          this.addForm.display = 1;
        }
        this.addForm.pid = row.id;
        this.addDialogVisible = true;
      },
      addMainRightsDialogShow() {
        this.addForm.level = 1;
        this.addForm.display = 1;
        this.addForm.pid = 0;
        this.addDialogVisible = true;
      },
      addRightes() {
        this.$refs.addRightesFormRef.validate(async valid => {
          if (!valid) return;
          const {data: res} = await this.$http.post('rights', this.addForm);
          if (res.meta.status != 200) {
            return this.$message.error('添加权限列表失败');
          }
          this.$message.success('添加权限列表成功!');
          //隐藏添加用户的对话框
          this.addDialogVisible = false;
          this.getRightsList();
          this.getRightsOptList();
        });
      },
      addDialogClosed() {
        this.$refs.addRightesFormRef.resetFields();
      },
      async removeMenuById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该菜单权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除');
        }
        const {data: res} = await this.$http.delete('rights/' + id);
        if (res.meta.status !== 200) {
          return this.$message.error('删除菜单权限失败');
        }
        this.$message.success('删除菜单权限成功!');
        this.getRightsList();
        this.getRightsOptList();
      },
      showRightsEditDialog(row) {
        this.editForm.id = row.id;
        this.editForm.authName = row.authName;
        this.editForm.path = row.path;
        this.editForm.level = row.level;
        this.editForm.display = row.display;
        this.editForm.pid = row.pid;
        this.editDialogVisible = true;
      },
      editDialogClosed() {
        this.$refs.editRightsFormRef.resetFields();
      },
      editMenuInfo() {
        this.$refs.editRightsFormRef.validate(async valid => {
          if (!valid) return;
          //编辑用户的网络请求
          const {data: res} = await this.$http.put('rights/' + this.editForm.id
            , this.editForm);
          if (res.meta.status !== 200) {
            return this.$message.error('更新菜单权限失败');
          }
          this.$message.success('更新菜单权限成功!');
          this.editDialogVisible = false;
          this.getRightsList();
          this.getRightsOptList();
        })
      },

    }
  }
</script>

<style lang="less" scoped>

</style>
