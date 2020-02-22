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
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表-->
      <el-table :data="roleList" border stripe>
        <!--展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',i1 ===0 ? 'bdtop':'']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限-->
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[i2 === 0 ? '' : 'bdtop']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col>
                    <el-tag type="success">{{item2.authName}}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col></el-col>
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
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "roles",
    data() {
      return {
        //权限列表
        roleList: [],

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
</style>
