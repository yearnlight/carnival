<template>
  <div class="frame">
    <div class="frame-header">
      <div class="frame-header-title">年会管理系统</div>
      <div class="frame-header-info">
        <ul>
          <li>
            <div class="frame-header-info-img">{{accout.substr(0,1).toUpperCase()}}</div>
            {{accout}}
          </li>
          <li>
            <el-tooltip class="item" effect="dark" content="退出" placement="bottom-start">
              <span class="frame-header-info-signout icon-sign-out" @click="signout()"></span>
            </el-tooltip>
          </li>
        </ul>
      </div>
    </div>
    <div class="frame-content">
      <div class="frame-content-left">
        <MenuList></MenuList>
      </div>
      <div class="frame-content-right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import MenuList from "./menu";
export default {
  data() {
    return {
      accout: ""
    };
  },
  components: { MenuList },
  methods: {
    signout() {
      this.$confirm("你确认退出当前系统？", "退出").then(() => {
        this.$router.push("/login");
        sessionStorage.clear();
      });
    }
  },
  created() {
    let accout = sessionStorage.getItem("accout");
    if (accout) {
      this.accout = accout;
    } else {
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="less">
.frame {
  height: 100%;
  .el-tag {
    margin-right: 5px;
    border-radius: 0;
  }
  .del {
    color: #fb846b;
    font-size: 14px;
    cursor: pointer;
    padding-right: 5px;
  }

  .red {
    color: #fb846b;
    font-size: 14px;
    cursor: pointer;
    padding-right: 5px;
  }

  .blue {
    color: #7796ff;
    font-size: 14px;
    cursor: pointer;
    padding-right: 5px;
  }
  .green {
    color: #74cd88;
    font-size: 14px;
    cursor: pointer;
    padding-right: 5px;
  }
  .edit {
    color: #7796ff;
    font-size: 14px;
    cursor: pointer;
    padding-right: 5px;
  }
  .span-interval {
    margin-right: 10px;
  }
  .el-dialog {
    .el-dialog__headerbtn .el-dialog__close {
      color: #ffffff !important;
    }
  }
  &-header {
    height: 50px;
    background: #303243;
    display: flex;
    align-items: center;
    color: #ffffff;
    &-title {
      margin-left: 30px;
      font-weight: 500;
    }
    &-info {
      margin-left: auto;
      margin-right: 30px;
      &-signout {
        cursor: pointer;
        font-size: 18px;
      }
      &-img {
        height: 30px;
        width: 30px;
        border-radius: 15px;
        border: 1px solid #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0c1625;
        margin-right: 10px;
      }
      ul {
        list-style: none; /* 去掉ul前面的符号 */
        margin: 0px; /* 与外界元素的距离为0 */
        padding: 0px; /* 与内部元素的距离为0 */
        width: auto; /* 宽度根据元素内容调整 */
        display: flex;
        align-items: center;
        li {
          float: left;
          padding: 0 10px;
          display: flex;
          align-items: center;
          font-size: 14px;
        }
      }
    }
  }
  &-content {
    height: calc(100% - 50px);
    &-left {
      float: left;
      width: 200px;
      height: 100%;
    }
    &-right {
      float: left;
      width: calc(100% - 240px);
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      background: #eceef1;
      padding: 0 20px;
      .el-input {
        input {
          border-radius: 0;
        }
      }
      .el-breadcrumb {
        height: 60px;
        display: flex;
        align-items: center;
        background-color: #ffffff;
        padding: 0 15px;
        .el-breadcrumb__inner {
          font-size: 14px;
          font-weight: 600;
        }
      }
      .el-pagination {
        text-align: right;
      }

      .el-dialog__header {
        padding: 15px 20px;
        text-align: center;
        background: #7796ff;
        .el-dialog__title {
          color: #ffffff;
        }
      }

      .el-table {
        thead {
          color: #686876;
          th {
            background: #dde3f2;
          }
        }
      }
    }
  }
}
</style>
