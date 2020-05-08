<template>
  <div class="container">
    <a-form class="user-layout-login" id="formLogin" :form="form">
      <a-form-item>
        <a-input size="large" type="text" placeholder="请输入用户名..." v-decorator="['username',{rules: [{ required: true, message: '请输入帐户名或邮箱' }], validateTrigger: 'change'}]">
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>

      <a-form-item style="margin-top: 10%;">
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="请输入密码..."
           v-decorator="['password',{rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}]"
          @pressEnter="handleSubmit"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>
    </a-form>
    <div class="loginBtn" @click="handleSubmit">登录</div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { timeFix } from "@/utils/util";
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";
export default {
  data() {
    return {
      customActiveKey: "tab1",
      loginBtn: false,
      form: this.$form.createForm(this),
      stepCaptchaVisible: false,
      state: {
        time: 60,
        smsSendBtn: false
      },
      formLogin: {
        username: "",
        password: "",
        captcha: "",
        mobile: "",
        rememberMe: true
      }
    };
  },
  created() {
    Vue.ls.remove(ACCESS_TOKEN);
  },
  methods: {
    ...mapActions(["Login", "Logout"]),
    handleSubmit() {
      let flag = false;

      let loginParams = {
        remember_me: this.formLogin.rememberMe
      };

      // 使用账户密码登陆
      this.form.validateFields((err, values) => {
        if(!err) {  
          flag = true;
          loginParams.userName = values.username;
          loginParams.password = values.password;
        }
      })
      if (!flag) return;

      // this.loginBtn = true;

      this.Login(loginParams)
        .then(() => {
          history.go(0);
          this.loginSuccess();
        })
        .catch(err => {
          this.requestFailed(err);
        });
    },
    loginSuccess() {
      // this.loginBtn = false;

      this.$router.push({ name: "dashboard" });
      this.$notification.success({
        message: "欢迎",
        description: `${timeFix()}，欢迎回来`
      });
    },
    requestFailed(err) {
      this.$notification["error"]({
        message: "登录失败",
        description:
          ((err.response || {}).data || {}).message ||
          err.message ||
          "请求出现错误，请稍后再试",
        duration: 4
      });
      // this.loginBtn = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.ant-form-inline .ant-form-item-with-help {
  margin: 0;
}
.ant-row .ant-form-item .ant-form-item-with-help {
  margin-top: 0;
}
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}

.container {
  width: 24%;
  height: 36%;
  padding: 3% 0;
  position: relative;
  top: 30%;
  left: 38%;
  .loginBtn {
    background-image: url(~@assets/login/btnBack.png);
    background-size: 100% 100%;
    font-size: 20px;
    color: white;
    font-weight: bold;
    height: 14%;
    width: 34%;
    position: absolute;
    bottom: -22%;
    right: 91%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
</style>