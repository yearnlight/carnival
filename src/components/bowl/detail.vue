<template>
  <div class="paydetail">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/carnival/bowl/history' }">聚宝盆</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/carnival/bowl/history' }">购买记录</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/carnival/bowl/detail' }">详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <div class="paydetail-info">
        <span class="paydetail-info-item">
          <span class="paydetail-info-item-label">姓名:</span>
          {{info.userName}}
        </span>
        <span class="paydetail-info-item">
          <span class="paydetail-info-item-label">所在部门:</span>
          {{info.deptName}}
        </span>
        <span class="paydetail-info-item">
          <span class="paydetail-info-item-label">购买数量(张):</span>
          {{info.totalCount}}
        </span>
        <span class="paydetail-info-item">
          <span class="paydetail-info-item-label">购买总金额(元):</span>
          {{info.totalAmount}}
        </span>
      </div>
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        style="width: 100%;max-height:400px;"
      >
        <el-table-column prop="count" label="购买数量" width="220"></el-table-column>

        <el-table-column prop="amount" label="购买金额" width="220"></el-table-column>

        <el-table-column prop="ticketNumber" label="彩票号码"></el-table-column>

        <el-table-column prop="deptName" label="所在部门" width="220"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
export default {
  data() {
    return {
      tableData: [],
      info: ""
    };
  },
  created() {
    this.info = JSON.parse(this.$route.query.info);
    this.getList();
  },
  methods: {
    getList() {
      api.payDetail({ userId: this.info.userId }).then(res => {
        if (res.code == 200) {
          res.data = res.data || [];
          res.data.forEach(item=>{
              item.deptName = this.info.deptName;
          })
          this.tableData = res.data;
        } else {
          this.$message.error(res.message || "查询失败");
        }
      });
    }
  }
};
</script>

<style lang="less">
.paydetail {
  &-info {
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
  }
}
</style>


        