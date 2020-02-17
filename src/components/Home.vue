<template>
  <el-container class="home-container">
    <!-- 头部-->
    <el-header>
      <div>
        <img class="elimg" src="../assets/logo.png" alt="">
        <span>管理后台</span>
      </div>
      <el-button @click="logout" type="info">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧栏-->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse"><i :class="toggleIcon"></i></div>
        <!-- 侧边菜单-->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened
                 :collapse="isCollapse" :collapse-transition="false" :router="true"
                 :default-active="activePath">
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id"
                          @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: 'home',
    data() {
      return {
        //左侧菜单
        menulist: [],
        iconsObj: {
          '1': 'iconfont icon-user',
          '2': 'iconfont icon-tijikongjian',
          '3': 'iconfont icon-shangpin',
          '4': 'iconfont icon-danju',
          '5': 'iconfont icon-baobiao'
        },
        //是否折叠
        isCollapse: false,
        activePath: '',
        toggleIcon:'el-icon-caret-left'
      };
    },
    methods: {
      logout() {
        window.sessionStorage.clear();
        this.$router.push("/login");
      },
      //获取左侧菜单
      async getMemuList() {
        const {data: res} = await this.$http.get('menus');
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.menulist = res.data;
      },
      //切换菜单折叠
      toggleCollapse() {
        this.isCollapse = !this.isCollapse;
        if(this.isCollapse){
          this.toggleIcon = 'el-icon-caret-right';
        }else {
          this.toggleIcon = 'el-icon-caret-left';
        }
      },
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath', activePath);
        this.activePath = activePath;
      }
    },
    created() {
      this.getMemuList();
      this.activePath=window.sessionStorage.getItem('activePath');
    }
  }
</script>

<style lang="less" scoped>
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffffff;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }
  }

  .elimg {
    height: 60px;
    width: 60px;
  }

  .el-aside {
    background-color: #333744;

    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  .home-container {
    height: 100%;
  }

  .iconfont {
    margin-left: 10px;
  }

  .toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
