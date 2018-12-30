<template>
  <div class="group">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/carnival/redEnvelope' }">红包管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/carnival/group' }">自定义群组</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="group-operate">
      <el-form :inline="true">
        <div class="group-operate-right">
          <el-button type="info" size="small" @click="addGroupOperate()">新增群组</el-button>
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
        <el-table-column property="groupName" label="群组名称" width="220"></el-table-column>
        <el-table-column property="deptName" label="群组成员" width="520">
          <template slot-scope="scope">
            <div>
              <span
                class="span-interval"
                :key="index"
                v-for="(item,index) in scope.row.userList"
              >{{item.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column property label="操作">
          <template slot-scope="scope">
            <div>
              <span @click="edit(scope.row)" class="blue">编辑</span>
              <span @click="del(scope.row)" class="del">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      custom-class="add-group"
      title="新增群组"
      :show-close="false"
      :visible.sync="isAddgroup"
      width="40%"
    >
      <el-form ref="groupform" :rules="rules" :model="groupParam" label-width="80px">
        <el-form-item label="群组名称" prop="groupName">
          <el-input size="small" v-model="groupParam.groupName"></el-input>
        </el-form-item>
        <el-form-item label="群组成员" prop="members">
          <div>
            <span>{{memNum || 0}}人</span>
            <span>(点击叉号可删除)</span>
          </div>
          <div>
            <el-tag
              v-for="(user,index) in groupParam.userList"
              @close="delMember(user,index)"
              :key="index"
              closable
              type
            >{{user.name}}</el-tag>
          </div>
        </el-form-item>
        <el-form-item label="所在部门" prop="deptName">
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
            <el-button type="success" @click="selectUser(scope.row)" size="small">添加</el-button>
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
        <el-button size="small" @click="isAddgroup = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addgroup('groupform')">确 定</el-button>
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
      userParam: {
        deptId: "",
        name: "",
        current: 1,
        size: 5
      },
      groupParam: {
        userList: [],
        groupName: "",
        id: ""
      },
      memNum: 0,
      isAddgroup: false,
      rules: {
        groupName: { type: "string", required: true, message: "名称必填" }
      }
    };
  },
  created() {
    this.getDepts();
    this.getUserList();
    this.getgroupList();
  },
  methods: {
    addGroupOperate() {
      this.isAddgroup = true;
      this.groupParam = {
        userList: [],
        groupName: "",
        id: ""
      };
      this.getRepeatUserList();
    },
    edit(item) {
      item = JSON.parse(JSON.stringify(item));
      this.isAddgroup = true;
      this.groupParam.groupName = item.groupName;
      this.groupParam.id = item.groupId;
      this.groupParam.userList = item.userList ? item.userList : [];
      this.memNum = this.groupParam.userList.length;
      this.getRepeatUserList();
    },
    del(item) {
      this.$confirm("你确定删除此项?", "删除").then(() => {
        api.delgroup({ groupId: item.groupId }).then(res => {
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.getgroupList();
          } else {
            this.$message.error(res.message || "删除失败");
          }
        });
      });
    },
    delMember(user, index) {
      this.groupParam.userList.splice(index, 1);
      this.memNum = this.groupParam.userList.length;
    },
    getDepts() {
      api.depts().then(res => {
        if (res.code == "200") {
          this.depts = res.data;
          this.depts.unshift({ deptId: "", deptName: "全部部门" });
        }
      });
    },
    getgroupList() {
      api.groupList().then(res => {
        if (res.code == 200) {
          this.tableData = res.data;
        } else {
          this.$message.error(res.message || "查询失败");
        }
      });
    },
    addgroup(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let temp = [];
          this.groupParam.userList.forEach(item => {
            temp.push(JSON.stringify({ userId: item.userId }));
          });
          let param = {
            groupName: this.groupParam.groupName,
            id: this.groupParam.id,
            users: `[${temp.join(",")}]`
          };
          api.addgroup(param).then(res => {
            if (res.code == "200") {
              this.$message.success("操作成功");
              this.isAddgroup = false;
              this.getgroupList();
            } else {
              this.$message.error(res.message || "操作失败");
            }
          });
        } else {
          return false;
        }
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
      let temp = this.groupParam.userList.filter(u => user.userId == u.userId);
      if (temp && temp.length) {
        this.$message.warning(`${user.userName} 已经被添加过了`);
      } else {
        this.groupParam.userList.push({
          name: user.userName,
          userId: user.userId,
          deptId: user.deptId
        });
        this.memNum = this.groupParam.userList.length;
      }
    },
    handCurrentUser(current) {
      this.userParam.current = current;
      this.getUserList();
    }
  }
};
</script>

<style lang="less">
.group {
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

.add-group {
  .el-dialog__header {
    display: none;
  }
  .el-form {
  }
  .el-input {
    width: 100%;
  }
  .line {
    height: 32px;
  }
}
</style>