<template>
  <div class="ticket">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/carnival/bowl/history' }">聚宝盆</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/carnival/bowl/ticket' }">彩票开奖</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="ticket-operate">
      <span class="ticket-operate-item">
        <span class="ticket-operate-item-label">累积销量(张)：</span>
        {{payinfo.totalNumber ?payinfo.totalNumber.toLocaleString('en-US'):0}}
      </span>
      <span class="ticket-operate-item">
        <span class="ticket-operate-item-label">聚宝盆奖池(元)：</span>
        {{payinfo.totalAmount?payinfo.totalAmount.toLocaleString('en-US'):0}}
      </span>
      <el-button type="info" @click="add()" size="small">创建奖项</el-button>
    </div>

    <div>
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        style="width: 100%;min-height:380px;"
      >
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="name" label="奖项名称" width="180"></el-table-column>
        <el-table-column prop="count" label="数量" width="120"></el-table-column>
        <el-table-column prop label="中奖信息" width="520">
          <template slot-scope="scope">
            <div>
              <span
                class="span-interval"
                v-for="(item,index) in scope.row.payBonusLogDtoList"
                :key="index"
              >
                <span>{{item.ticketNumber}}</span>
                <span>{{item.userName}}</span>
                <span>{{item.deptName}}</span>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column property label="操作">
          <template slot-scope="scope">
            <div>
              <span class="blue" @click="edit(scope.row)">编辑</span>
              <span class="green" @click="manage(scope.row)">管理中奖信息</span>
              <span class="red" @click="del(scope.row)">删除</span>
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
      custom-class="add-ticket"
      :title="ticketParam.id?'修改奖项':'创建奖项'"
      :visible.sync="isAddticket"
      width="350px"
    >
      <el-form ref="ticketform" :rules="rules" :model="ticketParam" label-width="80px">
        <el-form-item label="奖品名称" prop="name">
          <el-input size="small" v-model="ticketParam.name"></el-input>
        </el-form-item>
        <el-form-item label="奖品数量" prop="count">
          <el-input size="small" v-model.number="ticketParam.count"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isAddticket = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addticket('ticketform')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog custom-class="link-winning" title="管理中奖信息" :visible.sync="isLink" width="40%">
      <el-form ref="linkform" :model="linkParam" label-width="140px">
        <el-form-item label="奖品名称" prop="name">{{linkParam.name}}</el-form-item>
        <el-form-item label="奖品数量" prop="count">{{linkParam.count}}</el-form-item>
        <el-form-item label>
          <el-input size="small" prop="operateNumber" v-model="operateNumber"></el-input>
          <el-button type="warning" size="small" :disabled="!operateNumber" @click="addItem()">添加</el-button>
          <div>中奖号码：已添加 {{addedNum?addedNum:0}}，可添加 {{linkParam.count - addedNum}}</div>
        </el-form-item>
      </el-form>
      <el-table
        ref="winningTable"
        :data="linkParam.winningList"
        highlight-current-row
        height="150"
        style="width: 100%;"
      >
        <el-table-column property="ticketNumber" label="中奖号码"></el-table-column>
        <el-table-column property="deptName" label="所在部门"></el-table-column>
        <el-table-column property="userName" label="姓名"></el-table-column>
        <el-table-column property label="操作">
          <template slot-scope="scope">
            <el-button type="warning" @click="delItem(scope.row,scope.index)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isLink = false">取 消</el-button>
        <el-button size="small" type="warning" @click="linkWinning('linkform')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/api";
export default {
  data() {
    return {
      tableData: [],
      depts: [],
      payinfo: {},
      total: 0,
      pages: 0,
      param: {
        current: 1,
        size: 5
      },
      isAddticket: false,
      isLink: false,
      userList: [],
      linkParam: {},
      operateNumber: "",
      ticketNumberLimit: 0, //彩票号码格式限制
      addedNum: 0,
      ticketParam: {
        name: "",
        count: "",
        id: ""
      },
      rules: {
        name: { type: "string", required: true, message: "名称必填" },
        count: {
          type: "number",
          min: 1,
          required: true,
          message: "数量必填且大于0"
        }
      }
    };
  },
  created() {
    this.getDepts();
    this.getticketList();
    this.getPoolInfo();
  },
  methods: {
    getPoolInfo() {
      api.payInfo().then(res => {
        if (res.code == 200) {
          this.payinfo = res.data;
        } else {
          this.$message.error(res.message || "查询失败");
        }
      });
    },
    del(item) {
      this.$confirm("此奖项所有信息将被清空，确定删除吗 ?", "删除").then(() => {
        api.delticket({ id: item.id }).then(res => {
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.getticketList();
          } else {
            this.$message.error(res.message || "删除失败");
          }
        });
      });
    },
    add() {
      this.ticketParam = {
        name: "",
        count: "",
        id: ""
      };
      this.isAddticket = true;
    },
    edit(item) {
      item = JSON.parse(JSON.stringify(item));
      this.ticketParam.id = item.id;
      this.ticketParam.name = item.name;
      this.ticketParam.count = item.count;
      //中奖信息
      this.ticketParam.payBonusLogDtoList = item.payBonusLogDtoList || [];
      this.isAddticket = true;
    },
    manage(item) {
      this.operateNumber = "";
      item = JSON.parse(JSON.stringify(item));
      this.isLink = true;
      this.linkParam.name = item.name;
      this.linkParam.id = item.id;
      this.linkParam.count = item.count;
      this.linkParam.winningList = item.payBonusLogDtoList
        ? item.payBonusLogDtoList
        : [];
      this.addedNum = this.linkParam.winningList.length;
      this.ticketNumberLimit = item.firstTicketNumber
        ? (item.firstTicketNumber + "").length
        : 5;
    },
    delItem(item, index) {
      this.linkParam.winningList.splice(index, 1);
      this.addedNum = this.linkParam.winningList.length;
    },
    addItem() {
      if (
        !new RegExp(`^\\d{${this.ticketNumberLimit}}$`).test(
          this.operateNumber + ""
        )
      ) {
        this.$message.warning(`中奖号码必须是${this.ticketNumberLimit}位数字`);
        return;
      }
      api.getUsersByNumber({ ticketNumber: this.operateNumber }).then(res => {
        if (res.code == 200) {
          let data = res.data;
          if (data) {
            if (this.linkParam.winningList.length < this.linkParam.count) {
              this.linkParam.winningList.push(data);
              this.addedNum = this.linkParam.winningList.length;
            } else {
              this.$message.warning(
                `此奖项最多添加${this.linkParam.count}个中奖号码`
              );
            }
          } else {
            this.$message.error("没有找到此中奖号码");
          }
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
    getticketList() {
      api.tLotteryList(this.param).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.pages = parseInt(res.data.pages);
          this.param.size = parseInt(res.data.size);
          this.total = parseInt(res.data.total);
        } else {
          this.$message.error(res.message || "查询失败");
        }
      });
    },
    handleCurrentChange(current) {
      this.param.current = current;
      this.getticketList();
    },
    search() {
      this.getticketList();
    },
    addticket(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //修改过程
          if (this.ticketParam.id) {
            if (
              parseInt(this.ticketParam.count) <
              this.ticketParam.payBonusLogDtoList.length
            ) {
              this.$message.warning(
                "奖项数量不能小于中奖号码数量，若要修改请删除中奖号码"
              );
              return;
            }
          }
          let fuc = this.ticketParam.id ? api.updateticket : api.addticket;
          fuc(this.ticketParam).then(res => {
            if (res.code == "200") {
              this.$message.success("操作成功");
              this.isAddticket = false;
              this.getticketList();
            } else {
              this.$message.error(res.message || "操作失败");
            }
          });
        } else {
          return false;
        }
      });
    },
    linkWinning() {
      let param = [];
      this.linkParam.winningList.forEach(d => {
        let temp = {};
        Object.assign(temp, d, { bonusId: this.linkParam.id });
        param.push(JSON.stringify(temp));
      });

      api.linkWinning({
          param: JSON.stringify({userIdList: `[${param.join(",")}]`,id: this.linkParam.id})
        })
        .then(res => {
          if (res.code == 200) {
            this.isLink = false;
            this.$message.success("关联成功");
            this.getticketList();
          } else {
            this.$message.error(res.message || "关联失败");
          }
        });
    }
  }
};
</script>

<style lang="less">
.ticket {
  &-operate {
    display: flex;
    padding: 20px;
    font-size: 14px;
    &-item {
      color: #666666;
      margin-right: 20px;
      &-label {
        color: #333333;
        margin-right: 5px;
      }
    }
    .el-button {
      margin-left: auto;
    }
  }
}

.add-ticket {
  .el-input {
    width: 215px;
  }
}

.link-winning {
  .el-dialog__body {
    padding: 20px 20px;
    .el-table__body-wrapper {
      overflow-y: auto;
    }
  }
  .el-input {
    width: 215px;
  }
  .el-form {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>