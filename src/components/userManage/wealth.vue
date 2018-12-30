<template>
  <div class="wealth">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/carnival/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/carnival/wealthDetail' }">收支明细</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="wealth-info">
      <div class="wealth-info-item">
        <div class="label">姓名</div>
        <div class="val">11</div>
      </div>
      <div class="wealth-info-item">
        <div class="label">所在部门</div>
        <div class="val">11</div>
      </div>
      <div class="wealth-info-item">
        <div class="label">账户余额</div>
        <div class="val">11</div>
      </div>
      <div class="wealth-info-item">
        <div class="label">充值余额</div>
        <div class="val">11</div>
      </div>
      <div class="wealth-info-item">
        <div class="label">因借款项</div>
        <div class="val">11</div>
      </div>
    </div>
    <div class="wealth-detail">
      <el-table
        ref="detailTable"
        :data="tableData"
        highlight-current-row
        style="width: 100%;height:280px;"
      >
        <el-table-column type="index" label="序号" width="120"></el-table-column>

        <el-table-column property="name" label="事件名称" width="240"></el-table-column>

        <el-table-column property="name" label="金额" width="240"></el-table-column>

        <el-table-column property="name" label="时间">
            <template slot-scope="scope">
                {{getDateString(scope.row.date)}}
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
import unit from '@/config/unit.js'
import api from '@/api/api.js'
export default {
  data() {
    return {
      tableData: [],
      total:0,
      param:{
          current:1,
          size:5
      }
    };
  },
  created(){
      //获取收支详情列表信息
      this.getDetailList();
  },
  methods:{
      getDateString(input){
          return unit.formatDate(input);
      },
      handleCurrentChange(current){
          this.param.current = current;
          this.getDetailList();
      },
      getDetailList(){

      }
  }
};
</script>

<style lang="less">
.wealth {
  &-info {
    color: #686876;
    background: #ffffff;
    margin: 20px 0;
    height: 131px;
    display: flex;
    justify-content: center;
    &-item {
      display: flex;
      align-content: center;
      justify-content: center;
      flex-direction: column;
      width: 150px;
      font-size: 14px;
      .label {
        font-weight: 600;
      }
      .val {
        padding: 20px 0;
      }
    }
  }
}
</style>


