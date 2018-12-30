<template>
  <div class="projection">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/carnival/program/selection' }">节目管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/carnival/program/selection' }">节目评选</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/carnival/program/projection' }">开启投影</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="projection-content">
        <Progress :item="item" v-for="(item,index) in list" :key="index"></Progress>
    </div>
  </div>
</template>

<script>
import Progress from "./progress";
export default {
  components: { Progress },
  data() {
    return {
        list:[
            {label:"uuu",percent:1,value:145},
            {label:"uuu",percent:0.5,value:72}
        ]
    };
  }
};
</script>

<style lang="less">
.projection {
  height: 100%;
  &-content {
    margin: 20px 0;
    background: #ffffff;
    height: calc(100% - 100px);
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
}
</style>



