<template>
  <div class="user">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable @clear="getUserList" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column prop="status" label="状态">
          <!-- 作用域插槽-->
          <template slot-scope="scope">
            <!--{{scope.row}}-->
            <el-switch v-model="scope.row.mg_state"
                       @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="removeUserById(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[1,2, 10, 30,50]" :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!--添加用户-->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户-->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!--分配角色对话框-->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisiable" width="50%" @close="setRoleDialogClosed()">
      <div>
        <p>当前的用户:{{userInfo.username}}</p>
        <p>当前的角色:{{userInfo.roleName}}</p>
        <p>分配新角色</p>
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">

          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "Users.vue",
    data() {
      //验证email
      var checkEmail = (rule, value, cb) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          return cb();
        }
        cb(new Error('请输入合法邮箱'));
      }
      //验证手机号
      var checkMobile = (rule, value, cb) => {
        const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value)) {
          return cb();
        }
        cb(new Error('请输入合法手机号'));
      }
      return {
        //查询参数
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        userList: [],
        total: 0,
        addDialogVisible: false,
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        addFormRules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '用户名长度3-10字符之间', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '密码长度3-10字符之间', trigger: 'blur'}],
          email: [{required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}],
          mobile: [{required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}]
        },
        editDialogVisible: false,
        editForm: {},
        editFormRules: {
          email: [{required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}],
          mobile: [{required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}]
        },
        setRoleDialogVisiable: false,
        userInfo: {},
        rolesList: [],
        selectedRoleId: ''
      }
    },
    created() {
      this.getUserList();
    },
    methods: {
      async getUserList() {
        const {data: res} = await this.$http.get('users', {params: this.queryInfo});
        if (res.meta.status != 200) return this.$message.error('用户列表获取失败');
        this.userList = res.data.users;
        this.total = res.data.total;
      },
      //监听pagesize切换
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getUserList();
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getUserList();
      },
      async userStateChanged(userinfo) {
        const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return this.$message.error('更新用户状态失败');
        }
        this.$message.success('更新用户状态成功');
      },
      addDialogClosed() {
        this.$refs.addFormRef.resetFields();
      },
      addUser() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return;
          //添加用户的网络请求
          const {data: res} = await this.$http.post('users', this.addForm);
          if (res.meta.status != 200) {
            return this.$message.error('添加用户失效!');
          }
          this.$message.success('添加用户成功!');
          //隐藏添加用户的对话框
          this.addDialogVisible = false;
          this.getUserList();
        })
      },
      async showEditDialog(id) {
        const {data: res} = await this.$http.get('users/' + id);
        if (res.meta.status !== 200) {
          return this.$message.error('查询用户信息失效!');
        }
        this.editForm = res.data
        this.editDialogVisible = true;
      },
      editDialogClosed() {
        this.$refs.editFormRef.resetFields();
      },
      editUserInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return;
          //编辑用户的网络请求
          const {data: res} = await this.$http.put('users/' + this.editForm.id
            , {email: this.editForm.email, mobile: this.editForm.mobile});
          if (res.meta.status !== 200) {
            return this.$message.error('更新用户信息失败');
          }
          this.$message.success('更新用户成功!');
          this.editDialogVisible = false;
          this.getUserList();
        })
      },
      async removeUserById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除');
        }
        //删除用户
        const {data: res} = await this.$http.delete('users/' + id);
        if (res.meta.status !== 200) {
          return this.$message.error('删除用户信息失败');
        }
        this.$message.success('删除用户成功!');
        this.getUserList();
      },
      //分配角色
      async setRole(userInfo) {
        this.userInfo = userInfo;
        const {data: res} = await this.$http.get('roles');
        if (res.meta.status != 200) return this.$message.error('角色列表获取失败');
        this.rolesList = res.data;
        this.setRoleDialogVisiable = true;
      },
      async saveRoleInfo() {
        if (!this.selectedRoleId) {
          return this.$message.error('请选择分配的角色')
        }
        const {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`, {rid: this.selectedRoleId});
        if (res.meta.status != 200) return this.$message.error('更新角色失败');
        this.$message.success('更新角色成功');
        this.getUserList();
        this.setRoleDialogVisiable = false;
      },
      setRoleDialogClosed() {
        this.selectedRoleId = '';
        this.userInfo = {};
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
