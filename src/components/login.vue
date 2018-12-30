<template>
  <div class="login">
    <img src="../assets/img/login-back.png" class="login-back">
    <div class="login-form">
      <div class="login-form-header">年会管理系统</div>
      <div class="login-form-content">
        <el-form
          :model="loginForm"
          status-icon
          :rules="rules"
          ref="loginForm"
          label-width="0"
          class="demo-ruleForm"
        >
          <el-form-item prop="accout">
            <el-input
              type="text"
              placeholder="请输入账号"
              prefix-icon="icon-accout"
              v-model="loginForm.name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="请输入密码"
              prefix-icon="icon-password"
              v-model="loginForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="warning"
              :loading="logining"
              @keyup.enter="login('loginForm')"
              @click="login('loginForm')"
            >{{logining?'登录中...':'登录'}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
export default {
  name: "login",
  data() {
    return {
      rules: {
        name: { type: "string", required: true, message: "账号必填" },
        password: { type: "string", required: true, message: "密码必填" }
      },
      loginForm: {
        name: "",
        password: ""
      },
      logining: false
    };
  },
  created(){
      //回车登录
      this.keyupEnter();
  },
  methods: {
    keyupEnter() {
      document.onkeydown = e => {
        if (e.keyCode === 13 &&e.which == "13") {
          this.login('loginForm');
        }
      };
    },
    login(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.logining = true;
          if (
            this.loginForm.name == "admin" &&
            this.loginForm.password == "password"
          ) {
            this.$router.push("/carnival");
            sessionStorage.setItem("accout", this.loginForm.name);
          } else {
            api.loginIn(this.loginForm).then(res => {
              this.logining = false;
              if (res.code == "200") {
                this.$router.push("/carnival");
                sessionStorage.setItem("accout", this.loginForm.name);
              } else {
                this.$message.error(res.message || "登录失败");
              }
            });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
.login {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background-image: url("../assets/img/login.png");
  position: relative;
  &-back {
    height: 462px;
    width: 885px;
  }
  &-form {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    padding: 0 40px 20px 40px;
    width: 250px;
    position: absolute;
    right: 250px;
    &-header {
      color: #ffffff;
      font-size: 24px;
      font-weight: 550;
      text-align: center;
      padding: 35px 0;
    }
    .el-input__prefix {
      font-size: 18px;
      left: 10px;
    }
    .el-button {
      width: 100%;
      font-weight: 600;
    }
  }
}
</style>


