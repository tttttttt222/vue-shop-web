<template>
  <div class="historyBrief">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>历史事件</el-breadcrumb-item>
      <el-breadcrumb-item>历史事件表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-form ref="historyBriefForm" :model="historyBriefQuery" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="时间">
              <el-input v-model="historyBriefQuery.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地点">
              <el-input v-model="historyBriefQuery.name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="活动名称">
              <el-input v-model="historyBriefQuery.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-timeline>
        <el-timeline-item v-for="(item, year) in historyBriefList" :key="item.year" :timestamp="''+item.year"
                          placement="top" size="large">
          <el-card>
            <!--            <h4>{{item.historyBriefInfos[0].eventName}}</h4>-->
            <!--            <p>王小虎 提交于 2018/4/12 20:46</p>-->
            <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
              <el-tab-pane v-for="(item1, id) in item.historyBriefInfos" :key="item1.id" :label="'测试标签'+item1.continent"
                           :name="'测试标签'+item1.continent">{{item1.eventName}}
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "historyBrief",
    data() {
      return {
        historyBriefList: [],
        historyBriefQuery: {},
        activeTabName: '',
      }
    },
    created() {
      this.getHistoryBriefList();
    },
    methods: {
      async getHistoryBriefList() {
        const {data: res} = await this.$http.post('historyBrief/query', this.historyBriefQuery);
        if (res.meta.status !== 200) {
          return this.$message.error('获取历史简介列表失败');
        }
        this.historyBriefList = res.data.list;
        // console.log(this.historyBriefList);
      },
      handleTabClick() {

      }


    },

  }
</script>

<style scoped>

</style>
