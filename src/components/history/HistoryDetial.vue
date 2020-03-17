<template>
  <div class="historyDetial">
    <el-card>
      <el-row>
        <el-button type="primary" icon="el-icon-back" @click="returnBack()">返回</el-button>
      </el-row>
      <el-row>
        <h1>{{detialEvent.eventTitle}}</h1>
      </el-row>
      <hr>
      <el-row>
        <p>{{detialEvent.eventBrief}}</p>
      </el-row>
      <hr>
      <el-row>
        <div class="content ">
          {{detialEvent.eventContennt}}
        </div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "historyDetial",
    data() {
      return {
        detialEvent: {}
      }
    },
    created() {
      this.getHistoryDetialById(this.$route.params.id);
    },
    methods: {
      async getHistoryDetialById(id) {
        const {data: res} = await this.$http.get('historyBriefEvent/' + id);
        if (res.meta.status !== 200) {
          return this.$message.error('查询用户信息失效!');
        }
        this.detialEvent = res.data
        // console.log(this.detialEvent);
      },
      returnBack(){
        this.$router.push({path: `/historyBrief`});
      }
    },

  }
</script>

<style scoped>
  .content {
    width: 100%;
    height: 400px;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
</style>
