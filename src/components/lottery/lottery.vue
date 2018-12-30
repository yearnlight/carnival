<template>
  <div class="lottery">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/carnival/lotterys' }">年会抽奖</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="lottery-operate">
      <el-form :inline="true">
        <div class="lottery-operate-right">
          <el-button type="info" size="small" @click="add()">新增奖项</el-button>
        </div>
      </el-form>
    </div>

    <div>
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        style="width: 100%;min-height:380px;"
      >
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column property="name" label="奖品名称" width="150"></el-table-column>
        <el-table-column property="amount" label="奖品数量" width="150"></el-table-column>
        <el-table-column property="orderIndex" label="排序" width="100"></el-table-column>
        <el-table-column label="中奖人信息" width="320">
          <template slot-scope="scope">
            <span
              class="span-interval"
              v-for="item in (scope.row.luckUsers?JSON.parse(scope.row.luckUsers):[])"
              :key="item.userId"
            >{{item.name}}</span>
          </template>
        </el-table-column>
        <el-table-column property label="操作">
          <template slot-scope="scope">
            <div>
              <span @click="edit(scope.row)" class="edit">编辑</span>
              <span @click="associate(scope.row)" style="cursor:pointer;">关联中奖人</span>
              <span @click="del(scope.row)" class="del">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      custom-class="add-lottery"
      :title="lotteryParam.id?'修改奖项':'新增奖项'"
      :visible.sync="isAddlottery"
      width="350px"
    >
      <el-form ref="lotteryform" :rules="rules" :model="lotteryParam" label-width="80px">
        <el-form-item label="奖品名称" prop="name">
          <el-input size="small" v-model="lotteryParam.name"></el-input>
        </el-form-item>
        <el-form-item label="奖品数量" prop="amount">
          <el-input size="small" v-model.number="lotteryParam.amount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isAddlottery = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addlottery('lotteryform')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog custom-class="link-user" title="关联中奖人" :visible.sync="isLink" width="40%">
      <el-form ref="linkform" :model="linkParam" label-width="140px">
        <el-form-item label="奖品名称" prop="name">{{linkParam.name}}</el-form-item>
        <el-form-item label="数量" prop="amount">{{linkParam.amount}}</el-form-item>
        <el-form-item label="已关联中奖人" prop="members">
          <div>
            <span>{{linkParam.userList.length}}人</span>
            <span>(点击叉号可删除)</span>
          </div>
          <div>
            <el-tag
              v-for="(user,index) in linkParam.userList"
              @close="delLink(user,index)"
              :key="index"
              closable
              type
            >{{user.name}}</el-tag>
          </div>
        </el-form-item>
        <el-form-item label="所在部门">
          <el-col :span="8">
            <el-select size="small" v-model="userParam.deptId">
              <el-option
                v-if="item.deptName"
                v-for="(item,index) in depts"
                :key="index"
                :value="item.deptId"
                :label="item.deptName"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="line" :span="2"></el-col>
          <el-col :span="8" style="margin:0 10px;">
            <el-input placeholder="输入姓名搜索" v-model="userParam.name" size="small"></el-input>
          </el-col>
          <el-col class="line" :span="1"></el-col>
          <el-col :span="4">
            <el-button size="small" type="warning" @click="searchUser()">搜索</el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <el-table
        ref="userTable"
        :data="userTableData"
        highlight-current-row
        height="200"
        style="width: 100%;"
      >
        <el-table-column property="deptName" label="所在部门"></el-table-column>
        <el-table-column property="userName" label="姓名"></el-table-column>
        <el-table-column property label="操作">
          <template slot-scope="scope">
            <el-button type="success" @click="selectUser(scope.row)" size="small">添加为中奖人</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handCurrentUser"
        :current-page="userParam.current"
        :page-size="userParam.size"
        layout="total, prev, pager, next, jumper"
        :total="userTotal"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isLink = false;">取 消</el-button>
        <el-button size="small" type="primary" @click="saveAssociate('linkform')">确 定</el-button>
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
      userTableData: [],
      depts: [],
      userTotal: 0,
      userPages: 0,
      isAddlottery: false,
      isLink: false,
      lotteryParam: {
        name: "",
        amount: "",
        id: ""
      },
      linkParam: {
        name: "",
        amount: "",
        id: "",
        users: "",
        userList: []
      },
      userParam: {
        current: 1,
        size: 5,
        name: "",
        deptId: ""
      },
      rules: {
        name: { type: "string", required: true, message: "奖品名称必填" },
        amount: {
          type: "number",
          min: 1,
          required: true,
          message: "奖品数量必填且大于0"
        }
      }
    };
  },
  created() {
    this.getDepts();
    this.getlotteryList();
    this.getUserList();
  },
  methods: {
    delLink(user, index) {
      this.linkParam.userList.splice(index, 1);
    },
    add() {
      this.isAddlottery = true;
      this.lotteryParam = {
        name: "",
        amount: "",
        id: ""
      };
    },
    edit(item) {
      item = JSON.parse(JSON.stringify(item));
      this.isAddlottery = true;
      this.lotteryParam.name = item.name;
      this.lotteryParam.amount = item.amount;
      this.lotteryParam.id = item.id;
      this.lotteryParam.luckUsers = item.luckUsers
        ? JSON.parse(item.luckUsers)
        : [];
    },
    del(item) {
      this.$confirm("你确定删除此项?", "删除").then(res => {
        api.delWinning({ id: item.id }).then(res => {
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.getlotteryList();
          } else {
            this.$message.error(res.message || "删除失败");
          }
        });
      });
    },
    searchUser() {
      this.userParam.current = 1;
      this.getUserList();
    },
    getRepeatUserList() {
      this.userParam = {
        current: 1,
        size: 5,
        name: "",
        deptId: ""
      };
      this.getUserList();
    },
    getUserList() {
      api.userList(this.userParam).then(res => {
        if (res.code == 200) {
          this.userTableData = res.data.records;
          this.userPages = parseInt(res.data.pages);
          this.userTotal = parseInt(res.data.total);
          this.userParam.size = parseInt(res.data.size);
        } else {
          this.$message.error(res.message || "查询用户列表失败");
        }
      });
    },
    selectUser(user) {
      let temp = this.linkParam.userList.filter(u => user.userId == u.userId);
      if (temp && temp.length) {
        this.$message.warning(`${user.userName} 已经被添加过了`);
      } else {
        if (this.linkParam.amount > this.linkParam.userList.length) {
          this.linkParam.userList.push({
            name: user.userName,
            userId: user.userId,
            deptId: user.deptId
          });
        } else {
          this.$message.warning("关联中奖人不能超过奖品数量");
        }
      }
    },
    handCurrentUser(current) {
      this.userParam.current = current;
      this.getUserList();
    },
    associate(item) {
      this.isLink = true;
      this.linkParam.name = item.name;
      this.linkParam.id = item.id;
      this.linkParam.amount = item.amount;
      this.linkParam.userList = []; //清空选中列表
      let users = item.luckUsers ? JSON.parse(item.luckUsers) : [];
      this.linkParam.userList = users; //关联时设置默认值
      this.getRepeatUserList();
    },
    saveAssociate(item) {
      let temp = [];
      this.linkParam.userList.forEach(u => {
        temp.push(JSON.stringify(u));
      });
      let params = {
        id: this.linkParam.id,
        users: `[${temp.join(",")}]`
      };
      api.linkedUser(params).then(res => {
        if (res.code == "200") {
          this.$message.success("关联成功");
          this.getlotteryList();
          this.isLink = false;
        } else {
          this.$message.error(res.message || "关联失败");
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
    getlotteryList() {
      api.lotteryList().then(res => {
        if (res.code == 200) {
          this.tableData = res.data;
        } else {
          this.$message.error(res.message || "查询奖项列表失败");
        }
      });
    },
    search() {
      getlotteryList();
    },
    addlottery(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.lotteryParam.id) {
            if (
              parseInt(this.lotteryParam.amount) <
              this.lotteryParam.luckUsers.length
            ) {
              this.$message.warning(
                "奖品数量不能小于中奖人数量，若要修改请取消中奖人"
              );
              return;
            }
          }
          api.addOrUpdateLottery(this.lotteryParam).then(res => {
            if (res.code == "200") {
              this.$message.success("操作成功");
              this.getlotteryList();
              this.isAddlottery = false;
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
.lottery {
  &-operate {
    padding: 15px 0;
    .el-form {
      display: flex;
      align-items: center;
      &-item {
        width: 120px;
        margin-bottom: 10px;
        margin-top: 10px;
      }
    }
    &-right {
      margin-left: auto;
    }
  }
}

.add-lottery {
  .el-input {
    width: 215px;
  }
}

.link-user {
  .el-form {
    .el-input {
      width: 100%;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>