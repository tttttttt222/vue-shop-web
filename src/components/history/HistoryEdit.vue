<template>
  <div class="HistoryEdit">
    <el-card>
      <h1>编辑</h1>
      <el-row>
        <el-button type="primary" icon="el-icon-back" @click="returnBack()">返回</el-button>
      </el-row>
      <hr>
      <el-form ref="historyEditBriefFormRef" :model="editRequest.historyBrief" :rules="editBriefFormRules"
               label-width="80px" v-show="showStepOneForm" style="margin:10px; padding: 20px">
        <el-form-item label="id" prop="id">
          <el-input v-model="editRequest.historyBrief.id" readonly disabled></el-input>
        </el-form-item>

        <el-form-item label="事件名称" prop="eventName">
          <el-input v-model="editRequest.historyBrief.eventName"></el-input>
        </el-form-item>

        <el-form-item label="年" prop="year">
          <el-input v-model.number="editRequest.historyBrief.year"></el-input>
        </el-form-item>

        <el-form-item label="月" prop="month">
          <el-input v-model.number="editRequest.historyBrief.month"></el-input>
        </el-form-item>

        <el-form-item label="日" prop="date">
          <el-input v-model.number="editRequest.historyBrief.date"></el-input>
        </el-form-item>

        <el-form-item label="国家" prop="contry">
          <el-input v-model="editRequest.historyBrief.contry"></el-input>
        </el-form-item>

        <el-form-item label="城市" prop="city">
          <el-input v-model="editRequest.historyBrief.city"></el-input>
        </el-form-item>

        <el-form-item label="主要人物" prop="mainPerson">
          <el-input v-model="editRequest.historyBrief.mainPerson"></el-input>
        </el-form-item>

        <el-form-item label="时期" prop="period">
          <el-input v-model="editRequest.historyBrief.period"></el-input>
        </el-form-item>

        <el-form-item label="地点" prop="continent">
          <el-select v-model="editRequest.historyBrief.continent" placeholder="请选择地区">
            <el-option v-for="(value, key) in continentObj" :key="key" :label="value" :value="key"></el-option>
          </el-select>
        </el-form-item>

        <el-button type="primary" @click="afterStep()">下一步</el-button>
      </el-form>

      <el-form ref="historyEventEditFormRef" :model="editRequest.historyEvent" :rules="editEventFormRules"
               label-width="80px"
               v-show="showStepTwoForm" style="margin:10px; padding: 20px">
        <el-form-item label="id" prop="id">
          <el-input v-model="editRequest.historyEvent.id" readonly disabled></el-input>
        </el-form-item>

        <el-form-item label="标题" prop="eventTitle">
          <el-input v-model="editRequest.historyEvent.eventTitle"></el-input>
        </el-form-item>

        <el-form-item label="简介" prop="eventBrief">
          <el-input v-model="editRequest.historyEvent.eventBrief"></el-input>
        </el-form-item>

        <el-form-item label="详细内容" prop="eventContennt">
          <!--          <el-input type="textarea" :rows="20" v-model="editRequest.historyEvent.eventContennt"></el-input>-->
          <weditor :catchData="catchWeditorData"></weditor>
        </el-form-item>

        <el-button type="primary" @click="rollBackStep()">上一步</el-button>
        <el-button type="primary" @click="saveHistoryForm()">提交修改</el-button>
        <!--        <el-button type="info" @click="resetHistoryEventEditForm()">重置</el-button>-->
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import weditor from "../MyWangeditor.vue";

  export default {
    name: "HistoryEdit",
    components: {
      weditor,
    },
    data() {
      return {
        showStepOneForm: true,
        showStepTwoForm: false,
        editRequest: {
          historyEvent: {},
          historyBrief: {}
        },
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
        editBriefFormRules: {
          eventName: [{required: true, message: '请输入事件名称', trigger: 'blur'}],
          year: [{required: true, message: '请输入年', trigger: 'blur'}, {type: 'number', message: '年份必须为数字值'}],
          // month: [{type: 'number', message: '月份必须为数字值'}],
          // date: [{type: 'number', message: '日期必须为数字值'}],
          continent: [{required: true, message: '请输选择地点', trigger: 'blur'}],
        },
        editEventFormRules: {
          eventTitle: [{required: true, message: '请输入标题', trigger: 'blur'}],
        }
      }
    },
    created() {
      // console.log(this.$route.query.item);
      this.editRequest.historyBrief = this.$route.query.item;
      this.editRequest.historyBrief.continent = String(this.editRequest.historyBrief.continent);
      this.getHistoryDetialById(this.editRequest.historyBrief.eventId);
    },
    methods: {
      afterStep() {
        this.$refs.historyEditBriefFormRef.validate((valid) => {
          if (!valid) return;
          this.editRequest.historyEvent.eventTitle = this.editRequest.historyBrief.eventName;
          this.showStepOneForm = false;
          this.showStepTwoForm = true;
        });
      },
      rollBackStep() {
        this.showStepOneForm = true;
        this.showStepTwoForm = false;
      },
      saveHistoryForm() {
        this.$refs.historyEventEditFormRef.validate(async (valid) => {
          if (!valid) return;
          const {data: res} = await this.$http.post('historyBrief/update', this.editRequest);
          if (res.meta.status !== 200) {
            return this.$message.error('更新信息失败');
          }
          this.$message.success('更新信息成功!');
          this.returnBack();
        });
      },
      async getHistoryDetialById(id) {
        const {data: res} = await this.$http.get('historyBriefEvent/' + id);
        if (res.meta.status !== 200) {
          return this.$message.error('查询用户信息失效!');
        }
        this.editRequest.historyEvent = res.data;
      },
      returnBack() {
        this.$router.push({path: `/historyBrief`});
      },
      catchWeditorData(data) {
        this.editRequest.historyEvent.eventContennt = data;
      }


    }

  }
</script>

<style scoped>

</style>
