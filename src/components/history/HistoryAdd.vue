<template>
  <div class="HistoryAdd">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>历史事件</el-breadcrumb-item>
      <el-breadcrumb-item>历史事件添加</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row style="margin:30px;">
        <el-col :span="8">
          <el-steps :active="active" finish-status="success">
            <el-step title="基本信息" icon="el-icon-edit"></el-step>
            <el-step title="详细信息" icon="el-icon-upload"></el-step>
            <el-step title="完成" icon="el-icon-s-order"></el-step>
          </el-steps>
        </el-col>
      </el-row>
      <hr/>
      <el-form ref="historyAddBriefFormRef" :model="addRequest.historyBrief" :rules="addBriefFormRules"
               label-width="80px" v-show="showStepOneForm" style="margin:10px; padding: 20px">
        <el-form-item label="事件名称" prop="eventName">
          <el-input v-model="addRequest.historyBrief.eventName"></el-input>
        </el-form-item>

        <el-form-item label="年" prop="year">
          <el-input v-model="addRequest.historyBrief.year"></el-input>
        </el-form-item>

        <el-form-item label="月" prop="month">
          <el-input v-model="addRequest.historyBrief.month"></el-input>
        </el-form-item>

        <el-form-item label="日" prop="date">
          <el-input v-model="addRequest.historyBrief.date"></el-input>
        </el-form-item>

        <el-form-item label="国家" prop="contry">
          <el-input v-model="addRequest.historyBrief.contry"></el-input>
        </el-form-item>

        <el-form-item label="城市" prop="city">
          <el-input v-model="addRequest.historyBrief.city"></el-input>
        </el-form-item>

        <el-form-item label="主要人物" prop="mainPerson">
          <el-input v-model="addRequest.historyBrief.mainPerson"></el-input>
        </el-form-item>

        <el-form-item label="时期" prop="period">
          <el-input v-model="addRequest.historyBrief.period"></el-input>
        </el-form-item>

        <el-form-item label="地点" prop="continent">
          <el-select v-model="addRequest.historyBrief.continent" placeholder="请选择地区">
            <el-option v-for="(value, key) in continentObj" :key="key" :label="value" :value="key"></el-option>
          </el-select>
        </el-form-item>

        <el-button type="primary" @click="afterStep()">下一步</el-button>
        <el-button type="info" @click="resetHistoryAddForm()">重置</el-button>
      </el-form>

      <el-form ref="historyEventFormRef" :model="addRequest.historyEvent" :rules="addEventFormRules" label-width="80px"
               v-show="showStepTwoForm" style="margin:10px; padding: 20px">
        <el-form-item label="标题" prop="eventTitle">
          <el-input v-model="addRequest.historyEvent.eventTitle"></el-input>
        </el-form-item>

        <el-form-item label="简介" prop="eventBrief">
          <el-input v-model="addRequest.historyEvent.eventBrief"></el-input>
        </el-form-item>

        <el-form-item label="详细内容" prop="eventContennt">
          <el-input type="textarea" :rows="20" v-model="addRequest.historyEvent.eventContennt"></el-input>
        </el-form-item>

        <el-button type="primary" @click="rollBackStep()">上一步</el-button>
        <el-button type="primary" @click="saveHistoryForm()">提交</el-button>
        <el-button type="info" @click="resetHistoryEventAddForm()">重置</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "HistoryAdd",
    data() {
      return {
        showStepOneForm: true,
        showStepTwoForm: false,
        active: 0,
        addRequest: {
          historyEvent: {
            eventTitle: '',
            eventBrief: '',
            eventContennt: '',
            eventCateIds: '',
          },
          historyBrief: {
            year: '',
            month: '',
            date: '',
            continent: '',
            contry: '',
            city: '',
            mainPerson: '',
            period: '',
            eventName: '',
          }
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
        addBriefFormRules: {
          eventName: [{required: true, message: '请输入事件名称', trigger: 'blur'}],
          year: [{required: true, message: '请输入年', trigger: 'blur'}],
          continent: [{required: true, message: '请输选择地点', trigger: 'blur'}],
        },
        addEventFormRules: {
          eventTitle: [{required: true, message: '请输入标题', trigger: 'blur'}],
        }
      }
    },
    created() {

    },
    methods: {
      afterStep() {
        this.$refs.historyAddBriefFormRef.validate((valid) => {
          if (!valid) return;
          this.active++;
          this.addRequest.historyEvent.eventTitle = this.addRequest.historyBrief.eventName;
          this.showStepOneForm = false;
          this.showStepTwoForm = true;
        });
      },
      rollBackStep() {
        this.active--;
        this.showStepOneForm = true;
        this.showStepTwoForm = false;
      },
      resetHistoryAddForm() {
        this.$refs.historyAddBriefFormRef.resetFields();
      },
      resetHistoryEventAddForm() {
        this.$refs.historyEventFormRef.resetFields();
      },
      saveHistoryForm() {
        this.$refs.historyEventFormRef.validate(async (valid) => {
          if (!valid) return;
          this.active++;
          const {data: res} = await this.$http.post('historyBrief/add', this.addRequest);
          if (res.meta.status !== 200) {
            return this.$message.error('添加信息失败');
          }
          this.$message.success('添加信息成功!');
          this.active = 0;
          this.showStepOneForm = true;
          this.showStepTwoForm = false;
          this.resetHistoryAddForm();
          this.resetHistoryEventAddForm();
        });
      },


    }

  }
</script>

<style scoped>

</style>
