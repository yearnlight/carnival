<template>
  <div class="selection">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/carnival/program/selection' }">节目管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/carnival/program/selection' }">节目评选</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="selection-operate">
      <el-form :inline="true">
        <el-form-item label="投票开始时间:">
          <el-date-picker size="small" v-model="startDate" align="right" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item label="投票结束时间:">
          <el-date-picker size="small" v-model="endDate" align="right" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item label>
          <el-button size="small" type="warning" @click="setScoreDate()">保存</el-button>
        </el-form-item>
        <div class="selection-operate-right">
          <!-- <el-button type="warning" size="small" @click="projection()">开启投影</el-button> -->
          <el-button type="info" size="small" @click="add()">新增节目</el-button>
        </div>
      </el-form>
    </div>

    <div>
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        heigth="300px"
        style="width: 100%;"
        :default-sort="{prop: 'orderIndex'}"
      >
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column property="name" label="节目名称" width="120"></el-table-column>
        <el-table-column property="actPerson" label="表演者" width="120"></el-table-column>
        <el-table-column property="orderIndex" label="排序" width="120" sortable></el-table-column>
        <!-- <el-table-column property="selectionName" label="票数排名" width="120">
        </el-table-column>-->
        <el-table-column property="score" label="票数总数" width="120" sortable></el-table-column>
        <el-table-column property="appScore" label="app投票" width="120" sortable></el-table-column>
        <el-table-column property="webScore" label="后台投票" width="120" sortable></el-table-column>
        <el-table-column property label="操作">
          <template slot-scope="scope">
            <div>
              <span @click="edit(scope.row)" class="edit">编辑</span>
              <span @click="vote(scope.row)" class="del">投票</span>
              <span @click="del(scope.row)" class="red">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      custom-class="add-selection"
      :title="selectionParam.id?'修改节目':'新增节目'"
      :visible.sync="isAddselection"
      width="350px"
    >
      <el-form ref="selectionform" :rules="rules" :model="selectionParam" label-width="80px">
        <el-form-item label="节目名称" prop="name">
          <el-input size="small" v-model="selectionParam.name"></el-input>
        </el-form-item>
        <el-form-item label="表演者" prop="actUsers">
          <el-input size="small" v-model="selectionParam.actUsers"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderIndex">
          <el-input size="small" v-model.number="selectionParam.orderIndex"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isAddselection = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addselection('selectionform')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog custom-class="vote-selection" title="节目投票" :visible.sync="isVote" width="350px">
      <el-form ref="voteform" :rules="voterules" :model="voteParam" label-width="80px">
        <el-form-item label="节目名称" prop="name">
          <el-input disabled size="small" v-model="voteParam.name"></el-input>
        </el-form-item>
        <el-form-item label="投票数" prop="score">
          <el-input size="small" v-model.number="voteParam.score"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isVote = false">取 消</el-button>
        <el-button size="small" type="primary" @click="saveVote('voteform')">确定投票</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/api";
import unit from "@/config/unit";
export default {
  data() {
    return {
      startDate: "",
      endDate: "",
      tableData: [],
      userTableData: [],
      depts: [],
      total: 11,
      param: {
        deptId: "",
        name: "",
        current: 1,
        size: 8
      },
      isAddselection: false,
      isVote: false,
      selectionParam: {
        name: "",
        actUsers: "",
        orderIndex: "",
        id: ""
      },
      voteParam: {
        id: "",
        name: "",
        score: ""
      },
      rules: {
        name: { type: "string", required: true, message: "名称必填" },
        actUsers: { type: "string", required: true, message: "表演者必填" },
        orderIndex: {
          type: "number",
          min: 1,
          max: 100,
          required: true,
          message: "排序必填且在0~100之间"
        }
      },
      voterules: {
        score: {
          type: "number",
          min: 1,
          required: true,
          message: "投票数必填且大于0"
        }
      }
    };
  },
  created() {
    this.getselectionList();
    this.getScoreDate();
  },
  methods: {
    del(item) {
      this.$confirm("你确定删除此项？", "删除").then(() => {
        api.delProgram({ id: item.id }).then(res => {
          if (res.code == "200") {
            this.$message.success("删除成功");
            this.getselectionList();
          } else {
            this.$message.error("删除失败");
          }
        });
      });
    },
    projection() {
      this.$router.push("projection");
    },
    saveVote(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.voteselection(this.voteParam).then(res => {
            if (res.code == 200) {
              this.$message.success("投票成功");
              this.getselectionList();
              this.isVote = false;
            } else {
              this.$message.error(res.message || "投票失败");
            }
          });
        } else {
          return false;
        }
      });
    },
    vote(item) {
      item = JSON.parse(JSON.stringify(item));
      this.voteParam.name = item.name;
      this.voteParam.id = item.id;
      this.voteParam.score = "";
      this.isVote = true;
    },
    add() {
      this.selectionParam = {
        name: "",
        actUsers: "",
        orderIndex: "",
        id: ""
      };
      this.isAddselection = true;
    },
    edit(item) {
      item = JSON.parse(JSON.stringify(item));
      this.isAddselection = true;
      this.selectionParam.name = item.name;
      this.selectionParam.actUsers = item.actPerson;
      this.selectionParam.orderIndex = item.orderIndex;
      this.selectionParam.id = item.id;
    },
    getScoreDate() {
      api.selectionHome().then(res => {
        if (res.code == "200") {
          if (res.data) {
            this.startDate = unit.formatDate(res.data.scoreStartDate);
            this.endDate = unit.formatDate(res.data.scoreEndDate);
          } else {
            this.startDate = "";
            this.endDate = "";
          }
        } else {
          this.$message.error(res.message || "查询失败");
        }
      });
    },
    setScoreDate() {
      if (!this.startDate || !this.endDate) {
        this.$message.warning("开始时间、结束时间必填");
        return;
      }
      if (new Date(this.startDate) >= new Date(this.endDate)) {
        this.$message.warning("结束时间必须大于开始时间");
        return;
      }
      api
        .setScoreDate({
          startDate: unit.formatDate(this.startDate),
          endDate: unit.formatDate(this.endDate)
        })
        .then(res => {
          if (res.code == 200) {
            this.$message.success("设置成功");
          } else {
            this.$message.error(res.message || "设置失败");
          }
        });
    },
    getselectionList() {
      api.programList().then(res => {
        if (res.code == 200) {
          this.tableData = res.data;
        } else {
          this.$message.error(res.message || "查询失败");
        }
      });
    },
    addselection(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.addselection(this.selectionParam).then(res => {
            if (res.code == "200") {
              this.$message.success("操作成功");
              this.getselectionList();
              this.isAddselection = false;
            } else {
              this.$message.error(res.message || "操作失败");
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
.selection {
  &-operate {
    .el-form {
      display: flex;
      align-items: center;
      &-item {
        margin-bottom: 10px;
        margin-top: 10px;
        .el-input {
          width: 180px;
        }
      }
    }
    &-right {
      padding: 15px 0;
      margin-left: auto;
    }
  }
}

.add-selection {
  .el-col {
    .el-input {
      width: 100%;
    }
  }
  .el-input {
    width: 215px;
  }
  .line {
    height: 32px;
  }
}
</style>