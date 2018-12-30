<template>
  <div class="history">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/carnival/bowl/history' }">聚宝盆</el-breadcrumb-item>

      <el-breadcrumb-item :to="{ path: '/carnival/bowl/history' }">购买记录</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="history-info">
      <span class="history-info-item">
        <span class="history-info-item-label">聚宝盆奖池(元):</span>
        {{payinfo.totalAmount?payinfo.totalAmount.toLocaleString('en-US'):0}}
      </span>
      <span class="history-info-item">
        <span class="history-info-item-label">彩票销售(张):</span>
        {{payinfo.saleNumber?payinfo.saleNumber.toLocaleString('en-US'):0}}
      </span>
      <span class="history-info-item">
        <span class="history-info-item-label">累计销量(张):</span>
        {{payinfo.totalNumber?payinfo.totalNumber.toLocaleString('en-US'):0}}
      </span>
    </div>

    <div>
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        style="width: 100%;min-height:380px;"
      >
        <el-table-column type="index" label="序号" width="80"></el-table-column>

        <el-table-column property="userName" label="姓名" width="120"></el-table-column>

        <el-table-column property="deptName" label="所属部门" width="120"></el-table-column>

        <el-table-column property="totalCount" label="购买数量" width="120"></el-table-column>

        <el-table-column property="totalAmount" label="购买金额" width="120"></el-table-column>

        <el-table-column property="ticketNumber" label="彩票号码"></el-table-column>

        <el-table-column property label="操作" width="100">
          <template slot-scope="scope">
            <div>
              <span class="blue" @click="goToDetail(scope.row)">查看详情</span>
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
      total: 0,
      pages: 0,
      param: {
        current: 1,
        size: 5
      },
      payinfo: {},
      rules: {}
    };
  },
  created() {
    this.getPayList();
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
    //跳转去详情界面
    goToDetail(item) {
      let info = JSON.stringify(item);
      this.$router.push({
        path: "/carnival/bowl/detail",
        query: { info: info }
      });
    },
    getPayList() {
      api.payList(this.param).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.param.size = parseInt(res.data.size);
          this.total = parseInt(res.data.total);
          this.pages = parseInt(res.data.total);
        } else {
          this.$message.error(res.message || "查询购买记录失败");
        }
      });
    },
    handleCurrentChange(current) {
      this.param.current = current;
      this.getPayList();
    },
    search() {
      this.param.current = 1;
      this.getPayList();
    }
  }
};
</script>

<style lang="less">
.history {
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