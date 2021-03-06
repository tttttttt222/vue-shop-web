import Vue from 'vue'
import Router from 'vue-router'
import Login from "./components/Login.vue";
import Home from "./components/Home.vue";
import Welcome from "./components/welcome.vue";
import Users from "./components/user/Users.vue";
import Rightes from "./components/power/Rightes.vue";
import RightesDeploy from "./components/power/RightesDeploy.vue";
import Roles from "./components/power/Roles.vue";
import Cate from "./components/goods/Cate.vue";
import Params from "./components/goods/Params.vue";
import HistoryBrief from "./components/history/HistoryBrief.vue";
import HistoryAdd from "./components/history/HistoryAdd.vue";
import HistoryDetial from "./components/history/HistoryDetial.vue";
import HistoryEdit from "./components/history/HistoryEdit.vue";


Vue.use(Router)

const router = new Router({
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login', component: Login},
    {
      path: '/home', component: Home, redirect: '/welcome', children: [
        {path: '/welcome', component: Welcome},
        {path: '/users', component: Users},
        {path: '/rights', component: Rightes},
        {path: '/rightesDeploy', component: RightesDeploy},
        {path: '/roles', component: Roles},
        {path: '/params', component: Params},
        {path: '/categories', component: Cate},
        {path: '/goods', component: Welcome},
        {path: '/orders', component: Welcome},
        {path: '/historyBrief', component: HistoryBrief},
        {path: '/historyDetial/:id', component: HistoryDetial},
        {path: '/historyEdit', component: HistoryEdit},
        {path: '/historyBriefAdd', component: HistoryAdd},
      ]
    },
  ],
  mode: "history"
})

//挂在路由导航守卫
router.beforeEach((to, from, next) => {
  //to将要访问的路径
  //from代表从那个路径跳转而来
  //next 是放行 ,next('/login')代表转到哪个路径
  if (to.path == '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
})

export default router
