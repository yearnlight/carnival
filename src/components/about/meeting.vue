<template>
  <div class="meeting">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/carnival/about/meeting' }">关于年会</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/carnival/about/meeting' }">座位信息</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="meeting-content">
      <div class="meeting-content-item">
        <div class="meeting-content-item-header">
          <span class="meeting-content-item-header-main">年会实时动态</span> (注：更新动态后，点击更新动态)
        </div>
        <div class="meeting-content-item-top">
          <el-input size="small" v-model="dynamic"></el-input>
          <el-button
            type="warning"
            size="small"
            :disabled="!dynamic"
            @click="setRealtimeDynamic()"
          >更新动态</el-button>
        </div>
      </div>
      <div class="meeting-content-item">
        <div class="meeting-content-item-header">
          <span class="meeting-content-item-header-main">年会介绍</span> (注：更新介绍后，点击更新动态)
        </div>
        <div class="meeting-content-item-form">
          <el-form ref="form" :model="form" :rules="yearrules" label-width="180px">
            <el-form-item label="年会标题(一级标题):" prop="slogan1">
              <el-input size="small" v-model="form.slogan1"></el-input>
            </el-form-item>
            <el-form-item label="年会副标题(二级标题):" prop="slogan2">
              <el-input size="small" v-model="form.slogan2"></el-input>
            </el-form-item>
            <el-form-item label="年会时间:" prop="date">
              <el-date-picker
                v-model="form.date"
                type="datetime"
                placeholder="选择日期时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="主持人:" prop="compere">
              <el-input size="small" v-model="form.compere"></el-input>
            </el-form-item>
            <el-form-item label="年会地址:" prop="address">
              <el-input size="small" v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item prop="remark">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="warning" @click="addOrEdit('form')" size="small">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="meeting-content-item">
        <div class="meeting-content-item-header">
          <span class="meeting-content-item-header-main">节目流程</span> （注：按照流程的时间排序）
        </div>
        <div class="meeting-content-item-table">
          <div class="meeting-content-item-table-add">
            <el-button size="small" @click="add()" type="info">添加流程</el-button>
          </div>
          <el-table
            ref="flowTable"
            :data="tableData"
            highlight-current-row
            height="250"
            style="width: 100%;"
          >
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column property="time" label="时间" width="120"></el-table-column>
            <el-table-column property="name" label="流程" width="120"></el-table-column>
            <el-table-column property label="操作">
              <template slot-scope="scope">
                <div>
                  <span @click="edit(scope.row)" class="blue">编辑</span>
                  <span @click="del(scope.row)" class="red">删除</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <el-dialog
      custom-class="operate-flow"
      :title="isEditOrAdd=='add'?'新增流程':'编辑流程'"
      :visible.sync="isFlow"
      width="350px"
    >
      <el-form ref="flowform" :rules="rules" :model="flowParam" label-width="80px">
        <el-form-item label="流程名称" prop="name">
          <el-input size="small" v-model="flowParam.name"></el-input>
        </el-form-item>
        <el-form-item label="流程时间" prop="time">
          <el-time-select
            v-model="flowParam.time"
            :picker-options="{
                start: '00:01',
                step:'00:01',
                end: '24:00'
            }"
            placeholder="选择时间"
          ></el-time-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isFlow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addOrUpdateFlow('flowform')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/api";
import unit from "@/config/unit.js";
export default {
  data() {
    return {
      dynamic: "",
      form: {},
      tableData: [],
      flowParam: {
        name: "",
        time: "",
        id: ""
      },
      isEditOrAdd: "add",
      isFlow: false,
      rules: {
        name: {
          type: "string",
          required: true,
          message: "名称必填"
        },
        time: {
          type: "string",
          required: true,
          message: "时间必填"
        }
      },
      yearrules: {
        slogan1: { type: "string", required: true, message: "一级标题必填" },
        slogan2: { type: "string", required: true, message: "二级标题必填" },
        date: { required: true, message: "年会时间必填" },
        compere: { type: "string", required: true, message: "主持人必填" },
        address: { type: "string", required: true, message: "年会地址必填" },
        remark: { type: "string", required: true, message: "备注必填" }
      }
    };
  },
  created() {
    this.getIntroduce();
    this.flowList();
    this.getRealtimeDynamic();
  },
  methods: {
    getRealtimeDynamic() {
      api.getRealtimeDynamic().then(res => {
        if (res.code == 200) {
          this.dynamic = res.data.content1;
        } else {
          this.$message.error(res.message || "查询实时动态失败");
        }
      });
    },
    setRealtimeDynamic() {
      let params = {
        dictionaryCode: "DYNAMIC",
        level: "0",
        content: this.dynamic
      };
      api.setRealtimeDynamic(params).then(res => {
        if (res.code == 200) {
          this.$message.success("更新成功");
        } else {
          this.$message.error(res.message || "更新失败");
        }
      });
    },
    getIntroduce() {
      api.getIntroduce().then(res => {
        if (res.code == 200) {
          this.form = res.data;
          if (res.data.date) {
            this.form.date = unit.formatDate(res.data.date);
          }
        } else {
          this.$message.error(res.message || "查询失败");
        }
      });
    },
    addOrEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.date = unit.formatDate(this.form.date);
          api.addOrUpdateIntroduce(this.form).then(res => {
            if (res.code == 200) {
              this.$message.success("操作成功");
            } else {
              this.$message.error(res.message || "操作失败");
            }
          });
        } else {
          return false;
        }
      });
    },
    flowList() {
      api.flowList().then(res => {
        if (res.code == 200) {
          this.tableData = res.data;
        } else {
          this.$message.error(res.message || "查询失败");
        }
      });
    },
    addOrUpdateFlow(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.addOrUpdateFlow(this.flowParam).then(res => {
            if (res.code == 200) {
              this.$message.success("操作成功");
              this.isFlow = false;
              this.flowList();
            } else {
              this.$message.error(res.message || "操作失败");
            }
          });
        } else {
          return false;
        }
      });
    },
    edit(item) {
      item = JSON.parse(JSON.stringify(item));
      this.isEditOrAdd = "edit";
      this.isFlow = true;
      this.flowParam = item;
    },
    del(item) {
      this.$confirm("你确定删除选中项?", "删除").then(() => {
        api.delflow({ id: item.id }).then(res => {
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.flowList();
          } else {
            this.$message.error(res.message || "删除失败");
          }
        });
      });
    },
    add() {
      this.flowParam = {
        name: "",
        time: "",
        id: ""
      };
      this.isEditOrAdd = "add";
      this.isFlow = true;
    }
  }
};
</script>

<style lang="less">
.meeting {
  &-content {
    background: #ffffff;
    margin: 20px 0;
    padding: 20px 40px;
    &-item {
      margin-bottom: 10px;
      &-top {
        .el-input {
          width: 400px;
        }
      }
      &-header {
        padding: 10px 0;
        color: #999999;
        &-main {
          color: #666;
          font-weight: 600;
        }
      }

      &-form {
        .el-textarea {
          height: 200px;
          .el-textarea__inner {
            height: 100%;
            border-radius: 0;
          }
        }
        .el-date-editor.el-input,
        .el-date-editor.el-input__inner {
          width: 100%;
        }
      }

      &-table {
        margin-left: 180px;
        &-operate {
          margin-top: 20px;
        }
        &-add {
          text-align: right;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>

