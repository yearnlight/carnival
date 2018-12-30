<template>
  <div class="user">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/carnival/users' }">用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="user-operate">
      <el-form :inline="true">
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

        <div class="user-operate-right">
          <el-button type="info" size="small" @click="isImport = true;fileList=[]">批量导入</el-button>

          <el-button type="info" size="small" @click="add()">新增用户</el-button>
        </div>
      </el-form>
    </div>

    <div class="user-list">
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        style="width: 100%;min-height:380px;"
      >
        <el-table-column type="index" label="序号" width="80"></el-table-column>

        <el-table-column property="userName" label="姓名" width="220"></el-table-column>

        <el-table-column property="deptName" label="所属部门" width="120"></el-table-column>

        <el-table-column property="aliveAmount" label="账户余额" width="120"></el-table-column>

        <el-table-column property="rechargeAmount" label="充值余额" width="120"></el-table-column>

        <el-table-column property="balance" label="应结款项" width="120"></el-table-column>

        <el-table-column property label="操作">
          <template slot-scope="scope">
            <div>
              <span @click="setValue(scope.row)" class="user-list-value">充值</span>
              
              <span @click="edit(scope.row)" class="user-list-edit">编辑</span>
              
              <span @click="resetPass(scope.row)" class="user-list-reset">重置密码</span>
              
              <!-- <span @click="incomeAndPay(scope.row)" class="red">收支明细</span> -->
              
              <span @click="del(scope.row)" class="user-list-del">删除</span>
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
      custom-class="add-user"
      :title="isEditOrAdd=='add'?'新增用户':'编辑用户'"
      :visible.sync="isAddUser"
      width="350px"
    >
      <el-form ref="userform" :rules="rules" :model="userParam" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input size="small" v-model="userParam.name"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <el-select size="small" v-model="userParam.deptId">
            <el-option 
              v-if="item.deptName"
              v-for="(item,index) in depts.slice(1)"
              :key="index"
              :value="item.deptId"
              :label="item.deptName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isAddUser = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addUser('userform')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog custom-class="set-value" title="充值" :visible.sync="isSetValue" width="350px">
      <el-form ref="valueform" :rules="valuerules" :model="valueParam" label-width="80px">
        <el-form-item label="充值金额" prop="amount">
          <el-input size="small" v-model.number="valueParam.amount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isSetValue = false">取 消</el-button>
        <el-button size="small" type="primary" @click="saveValue('valueform')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog custom-class="importUser" title="批量导入" :visible.sync="isImport" width="350px">
      <el-form ref="importform" :model="valueParam" label-width="80px">
        <el-form-item label prop>
          <el-upload
            class="upload-demo"
            drag
            action="/user/import"
            :before-upload="beforeUpload"
            ref="userupload"
            :limit="1"
            enctype="multipart/form-data"
            :on-error="uploadError"
            :on-success="handleAvatarSuccess"
            :auto-upload="false"
            :file-list="fileList"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过100Mb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isImport = false">取 消</el-button>
        <el-button size="small" type="primary" @click="importUser('importform')">确 定</el-button>
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
      total: 0,
      pages: 0,
      param: {
        deptId: "",
        name: "",
        current: 1,
        size: 5
      },
      isAddUser: false,
      isEditOrAdd: "add",
      isSetValue: false,
      isImport: false,
      fileList: [],
      file: "",
      userParam: {
        name: "",
        deptId: ""
      },
      valueParam: {
        amount: ""
      },
      curUserId: "",
      rules: {
        name: {
          type: "string",
          required: true,
          message: "姓名必填"
        },
        deptId: {
          type: "string",
          required: true,
          message: "部门必选"
        }
      },
      valuerules: {
        amount: {
          type: "number",
          required: true,
          min: 1,
          message: "充值金额必填且大于0"
        }
      }
    };
  },
  created() {
    this.getDepts();

    this.getUserList();
  },
  methods: {
    incomeAndPay() {
        this.$router.push("/carnival/wealthDetail");
    },
    importUser() {
      this.$refs.userupload.submit();
    },
    uploadError() {
      this.$message.error("上传失败");
    },
    handleAvatarSuccess(res, file) {
      this.isImport = false;
      if (res.code == "200") {
        this.getUserList();
        this.$message.success("上传成功");
      } else {
        this.$message.error(res.message || "上传失败");
      }
    },
    beforeUpload(file) {
      this.file = file;
      const extension = file.name.split(".")[1] === "xlsx";
      const isLt2M = file.size / 1024 / 1024 < 100;
      if (!extension) {
        this.$message.warning("上传模板只支持xlsx格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.warning("上传模板大小不能超过 100MB!");
        return false;
      }
    },
    getDepts() {
      api.depts().then(res => {
        if (res.code == "200") {
          this.depts = res.data;

          this.depts.unshift({
            deptId: "",

            deptName: "全部部门"
          });
        }
      });
    },
    getUserList() {
      api.userList(this.param).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;

          this.param.size = res.data.size;

          this.total = parseInt(res.data.total);

          this.page = parseInt(res.data.pages);
        } else {
          this.$message.error(res.message || "查询用户列表失败");
        }
      });
    },
    handleCurrentChange(current) {
      this.param.current = current;
      this.getUserList();
    },
    search() {
      this.param.current = 1;
      this.getUserList();
    },
    add() {
      this.isAddUser = true;
      this.isEditOrAdd = "add";
      this.userParam = {
        name: "",
        id: "",
        deptId: ""
      };
    },
    addUser(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.addUser(this.userParam).then(res => {
            if (res.code == "200") {
              this.$message.success("操作成功");

              this.isAddUser = false;

              //刷新表格
              this.param.current = 1;
              this.getUserList();
            } else {
              this.$message.error(res.message || "操作失败");
            }
          });
        } else {
          return false;
        }
      });
    },
    del(item) {
      item = JSON.parse(JSON.stringify(item));
      this.$confirm("你确定删除当前用户？", "删除").then(() => {
        api
          .delUser({
            userId: item.userId
          })
          .then(res => {
            if (res.code == 200) {
              this.$message.success("删除用户成功");

              //刷新表格
              this.param.current = 1;
              this.getUserList();
            } else {
              this.$message.error(res.message || "删除用户失败");
            }
          });
      });
    },
    resetPass(item) {
      item = JSON.parse(JSON.stringify(item));
      this.$confirm("重置后密码将会改为 888888，确定重置吗？", "重置密码", {
        type: "warning"
      }).then(() => {
        api
          .resetPass({
            userId: item.userId
          })
          .then(res => {
            if (res.code == 200) {
              this.$message.success("重置密码成功");

              //刷新表格

              this.getUserList();
            } else {
              this.$message.error(res.message || "重置密码失败");
            }
          });
      });
    },
    setValue(item) {
      item = JSON.parse(JSON.stringify(item));
      this.isSetValue = true;
      this.valueParam.amount = "";
      this.curUserId = item.userId;
    },
    saveValue(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            amount: this.valueParam.amount,

            userId: this.curUserId
          };

          api.recharge(params).then(res => {
            if (res.code == 200) {
              this.$message.success("充值成功");

              this.isSetValue = false;

              //刷新表格

              this.getUserList();
            } else {
              this.$message.error(res.message || "充值失败");
            }
          });
        } else {
          return false;
        }
      });
    },
    edit(item) {
      item = JSON.parse(JSON.stringify(item));
      this.userParam = {
        name: item.userName,

        id: item.userId,

        deptId: item.deptId
      };

      this.isAddUser = true;

      //标记修改

      this.isEditOrAdd = "edit";
    }
  }
};
</script>

<style lang="less">
.user {
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
      margin-left: auto;
    }
  }

  &-list {
    &-value {
      color: #74cd88;
      font-size: 14px;
      cursor: pointer;
      padding-right:5px;
    }
    &-del {
      color: #fb846b;
      font-size: 14px;
      cursor: pointer;
      padding-right:5px;
      padding-left:5px;
    }
    &-edit {
      color: #7796ff;
      font-size: 14px;
      cursor: pointer;
      padding-right:5px;
    }
    &-reset {
      color: #70707d;
      font-size: 14px;
      cursor: pointer;
      padding-right:5px;
    }
  }
}

.add-user {
  .el-input {
    width: 215px;
  }
}

.importUser {
  width: 600px !important;
}
</style>