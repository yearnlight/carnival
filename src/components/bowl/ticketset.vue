<template>
  <div class="ticketset">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/carnival/bowl/history' }">聚宝盆</el-breadcrumb-item>

      <el-breadcrumb-item :to="{ path: '/carnival/bowl/history' }">彩票设置</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="ticketset-operate">
      <el-form
        :inline="true"
        ref="setForm"
        :rules="setrules"
        name="addOrEditForm"
        label-width="100px"
      >
        <el-form-item label="单张金额(元):" prop="singAmount">
          <el-input v-model="historyParam.singAmount" size="small"></el-input>
        </el-form-item>

        <el-form-item label="彩票总数(张):" prop="totalNumber">
          <el-input v-model="historyParam.totalNumber " size="small"></el-input>
        </el-form-item>

        <el-form-item label="购买开始时间:" prop="startTime">
          <el-date-picker size="small" v-model="historyParam.startTime" type="datetime" placeholder></el-date-picker>
        </el-form-item>

        <el-form-item label="购买结束时间:" prop="endTime">
          <el-date-picker size="small" v-model="historyParam.endTime" type="datetime" placeholder></el-date-picker>
        </el-form-item>

        <el-form-item label>
          <el-button type="warning" size="small" @click="saveRecord('addOrEditForm')">保存</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :rules="rules" name="addOrEditForm1" label-width="100px">
        <el-form-item label="首张彩票号码:" prop="firstTicketNumber">
          <el-input v-model="historyParam.firstTicketNumber" size="small"></el-input>
        </el-form-item>

        <el-form-item label="奖池初始(元):" prop="initAmount">
          <el-input v-model="historyParam.initAmount" size="small"></el-input>
        </el-form-item>
      </el-form>
      <div></div>
    </div>

    <div class="ticketset-explain">
      <div class="ticketset-explain-header">奖项说明</div>
      <el-form
        ref="explainform"
        label-position="right"
        :model="param"
        :rules="explainrules"
        label-width="180px"
      >
        <el-form-item label="预售方式:" prop="model">
          <el-input v-model="param.model" size="small"></el-input>
        </el-form-item>
        <el-form-item label="购买方式:" prop="payModel">
          <el-input v-model="param.payModel" size="small"></el-input>
        </el-form-item>
        <el-form-item label="开奖流程:" prop="flow1">
          <el-input v-model="param.flow1" size="small"></el-input>
        </el-form-item>
        <el-form-item label prop="flow2">
          <el-input v-model="param.flow2" size="small"></el-input>
        </el-form-item>
        <el-form-item label prop="flow3">
          <el-input v-model="param.flow3" size="small"></el-input>
        </el-form-item>
        <el-form-item label>
          <el-button type="warning" size="small" @click="saveSet('explainform')">保存设置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
import unit from "@/config/unit";

export default {
  data() {
    return {
      tableData: [],
      depts: [],
      historyParam: {
        id: "",
        singAmount: "",
        totalNumber: "",
        firstTicketNumber: "",
        startTime: "",
        endTime: "",
        initAmount: ""
      },
      param: {},
      rules: {},
      setrules: {},
      explainrules: {
        model: { type: "string", required: true, message: "预售方式必填" },
        payModel: { type: "string", required: true, message: "购买方式必填" },
        flow1: { type: "string", required: true, message: "开奖流程必填" },
        flow2: { type: "string", required: true, message: "开奖流程必填" },
        flow3: { type: "string", required: true, message: "开奖流程必填" }
      }
    };
  },
  created() {
    this.getCurrentSet();
    this.getLotteryinfo();
  },
  methods: {
    getLotteryinfo() {
      api.getLotteryinfo().then(res => {
        if (res.code == "200") {
          this.param = res.data;
        } else {
          this.$message.error(res.message || "查询彩券信息失败");
        }
      });
    },
    saveSet(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.saveLotteryinfo(this.param).then(res => {
            if (res.code == "200") {
              this.$message.success("设置成功");
            } else {
              this.$message.error(res.message || "设置失败");
            }
          });
        } else {
          return false;
        }
      });
    },
    saveRecord(formName) {
      //   this.$refs[formName].validate(valid => {
      //     if (valid) {
      this.historyParam.startTime = unit.formatDate(this.historyParam.startTime);
      this.historyParam.endTime = unit.formatDate(this.historyParam.endTime);
      api.payAddOrEdit(this.historyParam).then(res => {
        if (res.code == "200") {
          this.$message.success("操作成功");
          this.getPayList();
        } else {
          this.$message.error(res.message || "操作失败");
        }
      });
      //     } else {
      //       return false;
      //     }
      //   });
    },
    getCurrentSet() {
      api.paySet().then(res => {
        if (res.code == "200") {
          this.historyParam = res.data;
          this.historyParam.startTime = unit.formatDate(
            this.historyParam.startTime
          );
          this.historyParam.endTime = unit.formatDate(
            this.historyParam.endTime
          );
        } else {
          this.$message.error(res.message || "获取设置失败");
        }
      });
    }
  }
};
</script>

<style lang="less">
.ticketset {
  &-explain {
    background: #fff;
    padding: 36px 60px;
    &-header {
      font-weight: 600;
    }
    .el-form {
      padding: 20px 62px;
    }
  }
  &-operate {
    .el-form {
      display: flex;
      align-items: center;
      &-item {
        .el-input {
          width: 80px;
        }
        .el-input.el-date-editor {
          width: 140px;
        }
        margin-bottom: 10px;
        margin-top: 10px;
      }
    }
  }
}
</style>