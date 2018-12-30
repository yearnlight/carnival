<template>
  <div class="progress">
    <div class="progress-label">{{item.label}}</div>
    <div class="progress-bar" :style="`width:${width}px`"></div>
    <div class="progress-val">{{item.value}}</div>
  </div>
</template>

<script>
export default {
  props: ["item"],
  data() {
    return {
      width: 0
    };
  },
  created() {
    this.width = this.item.percent * 535;
  }
};
</script>

<style lang="less">
.progress {
  display: flex;
  align-content: center;
  padding: 10px 0;
  &-label {
    font-size: 14px;
    padding: 0 5px;
    color: #333333;
    display: inline-block;
  }
  &-bar {
    display: inline-block;
    height: 24px;
    width: 535px;
    background: rgba(255, 140, 84, 1);
    opacity: 0.4;
  }
  &-val {
    margin-left: 5px;
    font-size: 14px;
    color: #fc6060;
    display: inline-block;
  }
}
</style>


