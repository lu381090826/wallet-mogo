<template>


  <div class="login">
    <van-row type="flex" justify="center" class="gotoreg">
      <img src="../../assets/logo.png">
    </van-row>

    <van-cell-group style="margin-top: 8%">
      <van-field
        v-model="username"
        clearable
        type="number"
        label="手机号"
        placeholder="请输入手机号"
        @keyup.enter="login"
        :error-message="usernameError"
      />

      <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        @keyup.enter="login"
        :error-message="passwordError"
      />
    </van-cell-group>
    <div style="margin: 3%;">
      <van-button type="default" size="large" class="button" v-intervalclick="{func:login}">登录</van-button>

      <van-row type="flex" justify="center" class="gotoreg">
        <van-col><span v-intervalclick="{func:gotoRegister}">去注册</span></van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {Field, Button, Row, Col, Cell, CellGroup} from 'vant';
  import RegexRoules from "../../utils/constants/RegexRoules";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {request} from "../../utils/request";
  import {showWebviewById, preLoad, openWebviewFast, openWebview} from "../../utils/webview";
  import cons from "../../utils/constants/Cons";

  Vue.use(Row).use(Col);
  Vue.use(Field);
  Vue.use(Button);
  Vue.use(Cell).use(CellGroup);

  export default {
    data() {
      return {
        username: "11111111111",
        password: "111111",
        usernameError: "",
        passwordError: "",
      };
    },
    methods: {
      gotoRegister() {
        openWebview({url: './wallet.register.html', id: 'wallet.register', title: "注册"});
      },
      login() {
        if (!RegexRoules.phone.test(this.username)) {
          this.usernameError = RegexRoules.errorMessage.phone;
          return false;
        }
        if (!RegexRoules.password.test(this.password)) {
          this.passwordError = RegexRoules.errorMessage.password;
          return false;
        }

        request(TGCApiUrl.login, {userName: this.username, password: this.password})
          .then(function (res) {
            plus.storage.setItem('uid', res.uid);
            plus.storage.setItem('token', res.token);
            plus.storage.setItem('walletAddress', res.walletAddress);
            plus.storage.setItem('walletName', res.walletName);
            plus.storage.setItem('walletKeyStroe', res.keyStore);

            showWebviewById(cons.baseWebViewId);

          });
      }
    },
    watch: {
      username() {
        this.usernameError = "";
        this.passwordError = "";
      },
      password() {
        this.usernameError = "";
        this.passwordError = "";
      }
    }
  }
</script>

<style scoped>
  .login {
    padding-top: 10%;
  }

  .button {
    margin-top: 30%;
    color: white;
    background-color: #007aff;
  }

  .gotoreg {
    color: #007aff;
    margin-top: 8%;
  }
</style>
