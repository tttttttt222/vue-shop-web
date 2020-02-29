<template>
  <div class="roles">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区-->
    <el-card class="box-card">
      <!--添加角色-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表-->
      <el-table :data="roleList" border stripe>
        <!--展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',i1 ===0 ? 'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children"
                    :key="item1.id">
              <!-- 渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[i2 === 0 ? '' : 'bdtop','vcenter']" v-for="(item2,i2) in item1.children"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" closable
                            @close="removeRightById(scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!--          <pre>-->
            <!--            {{scope.row}}-->
            <!--          </pre>-->
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除
            </el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>


    <!--添加用户-->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色-->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限-->
    <el-dialog title="修改角色" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed()">
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all
               :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "roles",
    data() {
      return {
        //权限列表
        roleList: [],
        addForm: {
          roleName: '',
          roleDesc: ''
        },
        addDialogVisible: false,
        addFormRules: {
          roleName: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
          roleDesc: [{required: true, message: '请输入角色描述', trigger: 'blur'}],
        },
        editForm: {},
        editDialogVisible: false,
        editFormRules: {
          roleName: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
          roleDesc: [{required: true, message: '请输入角色描述', trigger: 'blur'}],
        },
        setRightDialogVisible: false,
        rightsList: [],
        treeProps: {
          label: 'authName',
          children: 'children',
        },
        //默认选中的id
        defKeys: [],
        //分配权限的id
        roleId: ''
      }
    },
    created() {
      this.getRolesList();
    },
    methods: {
      async getRolesList() {
        const {data: res} = await this.$http.get('roles');
        if (res.meta.status != 200) {
          return this.$message.error('获取角色列表失败');
        }
        this.roleList = res.data;
      },
      async removeRightById(role, rightId) {
        //弹框提示用户是否删除
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return info.$message.info('取消了删除!')
        }

        const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败');
        }
        // this.getRolesList();
        role.children = res.data;
      },
      addDialogClosed() {
        this.$refs.addFormRef.resetFields();
      },
      async addRoleInfo() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return;
          const {data: res} = await this.$http.post("roles/", this.addForm);
          if (res.meta.status !== 200) {
            return this.$message.error('角色信息添加失败');
          }
          this.$message.success('角色信息添加成功!');
          this.addDialogVisible = false;
          this.getRolesList();
        })
      },
      async showEditDialog(id) {
        const {data: res} = await this.$http.get("roles/" + id);
        if (res.meta.status !== 200) {
          return this.$message.error('查询角色信息失败!');
        }
        this.editForm = res.data;
        this.editDialogVisible = true;
      },
      editDialogClosed() {
        this.$refs.editFormRef.resetFields();
      },
      async editRoleInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return;

          const {data: res} = await this.$http.put("roles/" + this.editForm.id, {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          });
          if (res.meta.status !== 200) {
            return this.$message.error('更新角色信息失败');
          }
          this.$message.success('更新角色信息成功!');
          this.editDialogVisible = false;
          this.getRolesList();
        })
      },
      async removeRoleById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除');
        }
        //删除用户
        const {data: res} = await this.$http.delete('roles/' + id);
        if (res.meta.status !== 200) {
          return this.$message.error('删除角色信息失败');
        }
        this.$message.success('删除角色成功!');
        this.getRolesList();
      },
      async showSetRightDialog(role) {
        this.roleId = role.id;
        //获取权限
        const {data: res} = await this.$http.get('rights/tree');
        if (res.meta.status !== 200) {
          return this.$message.error('获取权限信息失败');
        }
        this.rightsList = res.data;
        // console.log(this.rightsList);
        this.getLeafKeys(role, this.defKeys);
        console.log(this.defKeys);
        this.setRightDialogVisible = true;
      },
      //获取树形结构所需的id defKeys
      getLeafKeys(node, arr) {
        if (!node.children) {
          return arr.push(node.id);
        }
        node.children.forEach(item => this.getLeafKeys(item, arr));
      },
      setRightDialogClosed() {
        this.defKeys = [];
      },
      //点击为角色分配权限
      async allotRights() {
        const keys = [...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()];
        const idStr = keys.join(',');
        const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr});

        if (res.meta.status != 200) {
          return this.$message.error('分配权限失败');
        }
        this.getRolesList();
        this.setRightDialogVisible = false;
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eeeeee;
  }

  .bdbottom {
    border-bottom: 1px solid #eeeeee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
