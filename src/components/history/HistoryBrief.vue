<template>
  <div class="historyBrief">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>历史事件</el-breadcrumb-item>
      <el-breadcrumb-item>历史事件表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-form ref="historyBriefFormRef" :model="historyBriefQuery" label-width="80px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="开始时间" prop="yearStart">
              <el-input v-model="historyBriefQuery.yearStart"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="结束时间" prop="yearEnd">
              <el-input v-model="historyBriefQuery.yearEnd"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="地点" prop="continent">
              <el-select v-model="historyBriefQuery.continent" placeholder="请选择地区">
                <el-option v-for="(value, key) in continentObj" :key="key" :label="value" :value="key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-button type="primary" @click="searchHistory()">查询</el-button>
            <el-button type="info" @click="resetHistoryForm()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-timeline>
        <el-timeline-item v-for="(item, year) in historyBriefList" :key="item.year" :timestamp="item.year+'年'"
                          placement="top" size="large" color="#C7EDCC">
          <el-tabs v-model="activeTabNameObj[item.year]" @tab-click="handleTabClick" type="border-card">
            <el-tab-pane v-for="item1 in item.continents" :key="item1.continent"
                         :label="continentObj[item1.continent]"
                         :name="''+item1.continent">
              <el-collapse accordion>
                <el-collapse-item v-for="item2 in item1.historyBriefInfos" :key="item2.id" :title="item2.eventName"
                                  :name="item2.id">
                  <el-row>
                    <el-col :span="16">
                      <i class="el-icon-caret-right"></i>{{item2.eventBrief}}
                    </el-col>
                    <el-col :span="3">
                      <span style="cursor: pointer; color: #3a8ee6" @click="jumpTOdetial(item2.eventId)">详情</span>
                    </el-col>
                    <el-col :span="4">
                      <el-button type="warning" @click="editHistoryBrief(item2)" size="mini"
                                 icon="el-icon-edit"></el-button>
                      <el-button type="danger" @click="deleteHistoryBrief(item2.id,item2.eventId)" size="mini"
                                 icon="el-icon-delete"></el-button>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
          </el-tabs>
        </el-timeline-item>
      </el-timeline>

      <!--分页-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="historyBriefQuery.pagenum"
                     :page-sizes="[10,30,50]" :page-size="historyBriefQuery.pagesize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "historyBrief",
    data() {
      return {
        historyBriefList: [],
        historyBriefQuery: {
          yearStart: '',
          yearEnd: '',
          continent: '',
          pagenum: 1,
          pagesize: 30
        },
        total: 0,
        activeTabNameObj: {},
        continentObj: {
          0: '东亚',
          1: '西亚',
          2: '东欧',
          3: '西欧',
          4: '非洲',
          5: '澳洲',
          6: '北美',
          7: '南美'
        },
      }
    },
    created() {
      this.getHistoryBriefList();
    },
    methods: {
      async getHistoryBriefList() {
        this.activeTabNameObj = {};
        const {data: res} = await this.$http.post('historyBrief/query', this.historyBriefQuery);
        if (res.meta.status !== 200) {
          return this.$message.error('获取历史简介列表失败');
        }
        this.historyBriefList = res.data.list;
        this.total = res.data.total;
        this.historyBriefList.forEach(item => {
          // console.log(item);
          this.activeTabNameObj[item.year] = item.continents[0].continent + '';
        });
        // console.log(this.activeTabNameObj);
      },
      handleTabClick() {

      },
      searchHistory() {
        this.getHistoryBriefList();
      },
      resetHistoryForm() {
        this.$refs.historyBriefFormRef.resetFields();
      },
      handleSizeChange(newSize) {
        this.historyBriefQuery.pagesize = newSize;
        this.getHistoryBriefList();
      },
      handleCurrentChange(newPage) {
        this.historyBriefQuery.pagenum = newPage;
        this.getHistoryBriefList();
      },
      jumpTOdetial(id) {
        this.$router.push({
          path: `/historyDetial/${id}`,
        })
      },
      async deleteHistoryBrief(id, eventid) {
        const {data: res} = await this.$http.post(`historyBrief/delete/${id}/${eventid}`);
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败');
        }
        this.$message.success('删除成功');
        this.getHistoryBriefList();
      },
      editHistoryBrief(item) {
        this.$router.push({
          path: '/historyEdit',
          query: {item: item},
        })
      }
    },
    computed: {},
    watch: {}

  }
</script>

<style scoped>
  .el-button {
    margin-left: 30px;
  }

  .box-card {
    width: 480px;
  }
</style>
