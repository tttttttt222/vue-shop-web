<template>
  <div class="historyBrief">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>历史事件</el-breadcrumb-item>
      <el-breadcrumb-item>历史事件表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card :body-style="{ padding: '0px' }" v-show="cardShow">
      <el-button icon="el-icon-minus" size="min" @click="reduceTimeLine()" v-if="num>1"></el-button>
      <el-button icon="el-icon-plus" size="min" @click="plusTimeLine()" v-if="num<3"></el-button>
      <div style="background-color: #f0f7ff;width: 100%;height: 13px" @click="cardShow = false"></div>
    </el-card>
    <el-card :body-style="{ padding: '10px'}" @click.native="cardShow = true" v-show="!cardShow"></el-card>
    <el-row :gutter="10">
      <el-col v-for="(item,index) in lst" :key="item.id" :span="colSpan">
        <historyTimeLine></historyTimeLine>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import historyTimeLine from "../HistoryTimeLine.vue";

  export default {
    name: "historyBrief",
    components: {
      historyTimeLine,
    },
    data() {
      return {
        lst: [{id: "1"}],
        num: 1,
        colSpan: 24,
        cardShow: false,
      }
    },
    methods: {
      plusTimeLine() {
        this.num++;
        var obj = {id: ""};
        obj.id = String(this.num);
        this.lst.push(obj);
        this.colSpan = Math.round(24 / this.num);
      },
      reduceTimeLine() {
        this.num--;
        this.lst.pop();
        this.colSpan = Math.round(24 / this.num);
      }
    },
    computed: {},
    watch: {}

  }
</script>

<style scoped>
  .el-button {
    margin-top: 10px;
    margin-left: 10px;
  }

</style>
