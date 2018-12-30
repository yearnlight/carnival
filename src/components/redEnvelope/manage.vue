<template>
  <div class="red">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/carnival/redEnvelope' }">红包管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/carnival/redEnvelope' }">红包记录</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="red-operate">
      <el-form :inline="true" ref="saveform" :model="redConfig" :rules="saveRules">
        <el-form-item label="红包金额上限(元):" prop="moneyLimit">
          <el-input v-model.number="redConfig.moneyLimit" size="small"></el-input>
        </el-form-item>
        <el-form-item label="未领取红包退回时长(小时):" prop="packetTime">
          <el-input v-model.number="redConfig.packetTime" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" size="small" @click="saveConfig('saveForm')">保存</el-button>
        </el-form-item>
        <el-form-item label>
          <el-select size="small" v-model="param.deptId">
            <el-option
              v-if="item.deptName"
              v-for="(item,index) in depts"
              :key="index"
              :value="item.deptId"
              :label="item.deptName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-input placeholder="输入姓名搜索" v-model="param.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label>
          <el-button type="warning" size="small" @click="search()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div style="margin-top: 20px;">
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        style="width: 100%;min-height:380px;"
      >
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column property="userName" label="姓名" width="220"></el-table-column>
        <el-table-column property="deptName" label="所属部门" width="220"></el-table-column>
        <el-table-column property="sendPacketAmount" label="发出红包金额" width="220"></el-table-column>
        <el-table-column property="receivePacketAmount" label="收到红包金额" width="220"></el-table-column>
        <el-table-column property label="操作">
          <template slot-scope="scope">
            <div>
              <span class="blue" @click="getDetail(scope.row)">查看详情记录</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="param.current"
        :page-size="param.size"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog
      custom-class="red-detail"
      title="红包详情"
      :visible.sync="isDetail"
      width="40%"
    >
      <div class="red-detail-info">
        <div class="red-detail-info-items">
          <span class="red-detail-info-item">
            <span class="red-detail-info-item-label">姓名:</span>
            {{detail.name}}
          </span>
          <span class="red-detail-info-item">
            <span class="red-detail-info-item-label">所在部门:</span>
            {{detail.deptName}}
          </span>
        </div>
        <div class="red-detail-info-items">
          <span class="red-detail-info-item">
            <span class="red-detail-info-item-label">发出红包金额:</span>
            {{detail.sendPacketAmount}}
          </span>
          <span class="red-detail-info-item">
            <span class="red-detail-info-item-label">收到红包金额:</span>
            {{detail.allPacketAmount}}
          </span>
        </div>
      </div>
      <el-tabs v-model="activeItem" type="card">
        <el-tab-pane label="发出红包" name="send">
          <el-table :data="detail.sendList" stripe height="200" style="width: 100%">
            <el-table-column prop="type" label="红包类型" width="80">
              <template slot-scope="scope">{{scope.row.type == "1"?"普通红包":"随机红包"}}</template>
            </el-table-column>
            <el-table-column prop="packetMoney" label="红包金额" width="80"></el-table-column>
            <el-table-column prop="amount" label="红包数量" width="80"></el-table-column>
            <el-table-column prop="sendDate" label="时间">
              <template slot-scope="scope">{{formatDate(scope.row.sendDate)}}</template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="收到红包" name="receive">
          <el-table :data="detail.receiveList" height="200" stripe style="width: 100%">
            <el-table-column prop="userName" label="红包来源" width="100"></el-table-column>
            <el-table-column prop="packetMoney" label="红包金额" width="100"></el-table-column>
            <el-table-column prop="receiveDate" label="时间">
              <template slot-scope="scope">{{formatDate(scope.row.receiveDate)}}</template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import unit from "@/config/unit";
import api from "@/api/api";
export default {
  data() {
    return {
      tableData: [],
      activeItem: "send",
      depts: [],
      total: 0,
      pages: 0,
      redConfig: {
          packetTime:0,
          moneyLimit:0,
          packetTimeout:0
      }, //红包配置
      detail: {},
      param: {
        deptId: "",
        name: "",
        current: 1,
        size: 5
      },
      isDetail: false,
      rules: {},
      saveRules:{
          moneyLimit: { type: "number",min:0,max:10000, required: true, message: "红包金额上限在0~10000之间" },
          packetTime: { type: "number",min:0,max:24, required: true, message: "退回时长在0~24小时之间" }
      }
    };
  },
  created() {
    this.getDepts();
    this.getRedConfig();
    this.getredList();
  },
  methods: {
    formatDate(date) {
      return unit.formatDate(date);
    },
    getDetail(item) {
      this.isDetail = true;
      api
        .getRedDetail({ userId: item.userId, deptName: item.deptName })
        .then(res => {
          if (res.code == 200) {
            this.detail = res.data;
          } else {
            this.$message.error(res.message || "查询详情失败");
          }
        });
    },
    saveConfig() {
      this.redConfig.packetTimeout = this.redConfig.packetTime;
      api.saveconfig(this.redConfig).then(res => {
        if (res.code == 200) {
          this.$message.success("保存成功");
        } else {
          this.$message.error(res.message || "保存失败");
        }
      });
    },
    getRedConfig() {
      api.redconfig().then(res => {
        if (res.code == 200) {
          this.redConfig = res.data;
          this.redConfig.packetTime = res.data.packetTimeout;
        } else {
          this.$message.error(res.message || "查询失败");
        }
      });
    },
    getDepts() {
      api.depts().then(res => {
        if (res.code == "200") {
          this.depts = res.data;
          this.depts.unshift({ deptId: "", deptName: "全部部门" });
        }
      });
    },
    getredList() {
      api.userList(this.param).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.param.size = res.data.size;
          this.total = parseInt(res.data.total);
          this.pages = parseInt(res.data.pages);
        } else {
          this.$message.error(res.message || "查询用户列表失败");
        }
      });
    },
    handleCurrentChange(current) {
      this.param.current = current;
      this.getredList();
    },
    search() {
      this.getredList();
    },
    addred(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.addred(this.redParam).then(res => {
            if (code == "200") {
              this.$message.success("新增用户成功");
              this.isAddred = false;
            } else {
              this.$message.error(res.message || "新增用户失败");
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
.red {
  &-operate {
    .el-form {
      display: flex;
      align-items: center;
      &-item {
        margin-bottom: 10px;
        margin-top: 10px;
        .el-form-item__content {
          width: 120px;
        }
      }
    }
    &-right {
      margin-left: 30px;
    }
  }
}

.red-detail {
    .el-tabs{
        .el-tabs__item{
            padding: 0 10px;
            border-radius: 0;
        }
        .el-tabs__item:last-child{
            padding-left:10px;
            padding-right:10px;
        }
        .el-tabs__item.is-active{
            background: #e6a23c;
            color:#ffffff;
        }
    }
  &-info {
    margin-bottom: 20px;
    &-items {
      padding: 10px;
    }
    &-item {
      margin: 0px 20px;
      display: inline-block;
      width: 180px;
      color: #333333;
      &-label {
        margin-right: 5px;
        color: #666666;
      }
    }
  }
}
</style>