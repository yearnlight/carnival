<template>
  <div class="seat">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/carnival/about/meeting' }">关于年会</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/carnival/about/seat' }">座位信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="seat-operate">
      <el-form :inline="true">
        <div class="seat-operate-right">
          <el-button type="info" size="small" @click="goToAddSeat()">新增座位</el-button>
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
        <el-table-column property="name" label="桌位名称" width="120"></el-table-column>
        <el-table-column property="count" label="座位数" width="120"></el-table-column>
        <el-table-column property="level" label="排序" width="120">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model.number="scope.row.level"
              @blur="updateSeatLevel(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="桌位人员姓名" width="520">
          <template slot-scope="scope">
            <span
              class="seat-interval"
              v-for="item in scope.row.userInfoDtoList"
              :key="item.userId"
            >{{item.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column property label="操作">
          <template slot-scope="scope">
            <div>
              <span @click="edit(scope.row)" class="seat-list-edit">编辑</span>
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
      custom-class="add-seat"
      :title="seatParam.id ? '修改座位':'新增座位'"
      :visible.sync="isAddseat"
      width="40%"
    >
      <el-form ref="seatform" :rules="rules" :model="seatParam" label-width="140px">
        <!-- <el-form-item label="桌号" prop="name">
          <el-input size="small" v-model="seatParam.name"></el-input>
        </el-form-item>-->
        <el-form-item label="桌位名称" prop="name">
          <el-input size="small" v-model="seatParam.name"></el-input>
        </el-form-item>
        <el-form-item label="座位数" prop="count">
          <el-input size="small" v-model.number="seatParam.count"></el-input>
        </el-form-item>
        <el-form-item label="已添加座位人员" prop="members">
          <div>
            <span>{{seatParam.userList.length}}人</span>
            <span>(点击叉号可删除)</span>
          </div>
          <div>
            <el-tag
              v-for="(user,index) in seatParam.userList"
              @close="delLink(user,index)"
              :key="index"
              closable
              type
            >{{user.userName}}</el-tag>
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
          <el-col :span="8">
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
            <el-button
              type="success"
              :disabled="scope.row.disabled"
              @click="selectUser(scope.row)"
              size="small"
            >{{scope.row.disabled?"已入座":"选择"}}</el-button>
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
        <el-button size="small" @click="isAddseat = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addseat('seatform')">确 定</el-button>
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
      total: 0,
      pages: 0,
      userTotal: 0,
      userPages: 0,
      param: {
        current: 1,
        size: 5
      },
      userParam: {
        current: 1,
        size: 5,
        name: "",
        deptId: ""
      },
      isAddseat: false,
      seatParam: {
        name: "",
        count: "",
        userIdList: [],
        userList: [],
        id: ""
      },
      rules: {
        name: { type: "string", required: true, message: "名称必填" },
        count: {
          type: "number",
          min: 1,
          required: true,
          message: "座位数必填且大于0"
        }
      }
    };
  },
  created() {
    this.getDepts();
    this.getUserList();
    this.getseatList();
  },
  methods: {
    updateSeatLevel(item) {
      if (!/^([1-9][0-9]{0,1}|100)$/.test(item.level)) {
        this.$message.warning("座位排序号必须是1~100之间的数字");
        return;
      }
      api.updateSeatLevel({ id: item.id, level: item.level }).then(res => {
        if (res.code == 200) {
          this.$message.success("修改座位排序成功");
          this.param.current = 1;
          this.getseatList();
        } else {
          this.$message.error(res.message || "修改座位排序失败");
        }
      });
    },
    delLink(user, index) {
      this.seatParam.userList.splice(index, 1);
    },
    edit(item) {
      item = JSON.parse(JSON.stringify(item));
      this.isAddseat = true;
      this.seatParam.name = item.name;
      this.seatParam.count = item.count;
      this.seatParam.userList = item.userInfoDtoList? item.userInfoDtoList: [];
      this.seatParam.id = item.id;
      this.getRepeatUserList();
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
    getDepts() {
      api.depts().then(res => {
        if (res.code == "200") {
          this.depts = res.data;
          this.depts.unshift({ deptId: "", deptName: "全部部门" });
        }
      });
    },
    getseatList() {
      api.seatList(this.param).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.pages = parseInt(res.data.pages);
          this.total = parseInt(res.data.total);
          this.param.size = parseInt(res.data.size);
        } else {
          this.$message.error(res.message || "查询座位列表失败");
        }
      });
    },
    searchUser() {
      this.userParam.current = 1;
      this.getUserList();
    },
    getUserList() {
      api.userList(this.userParam).then(res => {
        if (res.code == 200) {
          this.userTableData = res.data.records;
          this.userPages = parseInt(res.data.pages);
          this.userTotal = parseInt(res.data.total);
          this.userParam.size = parseInt(res.data.size);
          this.filterNotSeatedUsers(); //过滤出未入座的用户
        } else {
          this.$message.error(res.message || "查询用户列表失败");
        }
      });
    },
    handleCurrentChange(current) {
      this.param.current = current;
      this.getseatList();
    },
    handCurrentUser(current) {
      this.userParam.current = current;
      this.getUserList();
    },
    search() {
      this.param.current = 1;
      this.getseatList();
    },
    goToAddSeat() {
      this.isAddseat = true;
      this.seatParam = {
        name: "",
        count: "",
        userIdList: [],
        userList: [],
        id: ""
      };
      //初始化用户列表
      this.getRepeatUserList();
    },
    selectUser(user) {
      let temp = this.seatParam.userList.filter(u => u.userId == user.userId);
      if (temp && temp.length) {
        this.$message.warning(`${user.userName} 已经被添加过了`);
      } else {
        if (this.seatParam.count > this.seatParam.userList.length) {
          this.seatParam.userList.push(user);
        } else {
          this.$message.warning("座位数已经达到上限，不能再增加了");
        }
      }
    },
    filterNotSeatedUsers() {
      this.userTableData.forEach(item => {
        if (item.seatName) {
          item.disabled = true;
        }
      });
    },
    addseat(formName) {
      let _self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          //塞入userId
          _self.seatParam.userIdList.length = 0;
          _self.seatParam.userList.forEach(u => {
            _self.seatParam.userIdList.push(`"${u.userId}"`);
          });
          if(_self.seatParam.userIdList.length == 0){
              this.$message.warning("座位必须添加至少1个人员");
              return;
          }
          api.addSeat(_self.seatParam).then(res => {
            if (res.code == "200") {
              this.$message.success("新增座位成功");
              this.getseatList();
              this.isAddseat = false;
            } else {
              this.$message.error(res.message || "新增座位失败");
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
.seat {
  &-interval {
    margin-right: 10px;
  }
  &-list {
    &-manage {
      color: #fb846b;
      font-size: 14px;
      cursor: pointer;
    }

    &-edit {
      color: #7796ff;
      font-size: 14px;
      cursor: pointer;
    }
  }
  &-operate {
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
      padding: 15px 0;
      margin-left: auto;
    }
  }
}

.add-seat {
  .el-form {
    .el-input {
      width: 215px;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
  }
  .el-table {
    .el-button {
    }
  }
  .el-col {
    .el-input {
      width: 100%;
    }
  }

  .line {
    height: 32px;
  }
}
</style>