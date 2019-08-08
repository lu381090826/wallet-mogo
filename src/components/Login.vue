<template>
  <div class="body" style="text-align: center;background-color: white;">
    <div class="login-center">
      <van-row type="flex" justify="center">
        <div>
          <img src="../assets/gongyilan.png" width="70">
        </div>
      </van-row>

      <div class="tg-field" style="margin-top: 15%"
           :style="{borderBottomColor:borderBottomColor.username}"
           @click="onFocus('username')"
      >
        <van-row type="flex" justify="start">
          <van-col span="7" class="tg-field-title">账号</van-col>
          <van-col span="17" class="tg-field-label">
            <div>
              <van-row type="flex" justify="start">
                <van-col span="20">
                  <input placeholder="" class="tg-field-input" v-model="username"
                         ref="usernameInput"
                  />
                </van-col>
                <van-col span="4">
                  <van-icon name="cross" color="gray" size="20px" v-show="username"
                            @click="clear('username')"></van-icon>
                </van-col>
              </van-row>
            </div>
          </van-col>
        </van-row>
      </div>

      <div class="tg-field"
           :style="{borderBottomColor:borderBottomColor.password}"
           @click="onFocus('password')"
      >
        <van-row type="flex" justify="start">
          <van-col span="7" class="tg-field-title">密码</van-col>
          <van-col span="17" class="tg-field-label">
            <div>
              <van-row type="flex" justify="start">
                <van-col span="16">
                  <input :type="passwordType"
                         placeholder=""
                         class="tg-field-input"
                         v-model="password"
                         ref="passwordInput"
                  />
                </van-col>
                <van-col span="4">
                  <van-icon name="cross" color="gray" size="20px" v-show="password"
                            @click="clear('password')"></van-icon>
                </van-col>
                <van-col span="4">
                  <van-icon name="closed-eye" color="gray" size="20px"
                            v-show="!passwordView" @click="changePasswordView">
                  </van-icon>
                  <van-icon name="eye-o" color="#76c3e8" size="20px"
                            v-show="passwordView" @click="changePasswordView">
                  </van-icon>
                </van-col>
              </van-row>
            </div>
          </van-col>
        </van-row>
      </div>

      <van-button size="large" class="button-blue" style="margin-top: 8%;" @click="login" :disabled="disabled">
        {{loginText}}
      </van-button>

      <div class="login-bottom">
        <van-row type="flex" justify="space-between">
          <van-col>
            <div>
              <span @click="verifyCodeLogin">短信验证码登录</span>
              <span style="color: lightgrey">|</span>
              <span @click="gotoRegister">注册</span>
            </div>
          </van-col>
          <van-col>
          </van-col>
          <van-col>
            <div @click="forgetPassword">忘记密码？</div>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import "../utils/css/TgField.less"
  import {Button, Col, Icon, Row, Toast} from 'vant';
  import RegexRoules from "@/utils/constants/RegexRoules";
  import TGCApiUrl from "@/utils/constants/TGCApiUrl";
  import {request} from "@/utils/request";
  import {openWebview} from "@/utils/webview";
  import cons from "@/utils/constants/Cons";
  import {fire} from "../utils/envent";
  import {isEmpty} from "@/utils/globalFunc";

  Vue.use(Row).use(Col);
  Vue.use(Icon);
  Vue.use(Toast);
  Vue.use(Button);

  export default {
    data() {
      return {
        username: "",
        password: "",
        passwordView: false,
        passwordType: "password",
        loginText: "立即登录",
        borderBottomColor: {
          username: "lightgray",
          password: "lightgray",
        },
        disabled: true,

      };
    },
    methods: {
      onFocus(type) {
        if (type === 'username') {
          this.borderBottomColor.username = "#1287ca";
          this.borderBottomColor.password = "lightgray";
          this.$refs.usernameInput.focus();

        }
        if (type === 'password') {
          this.borderBottomColor.password = "#1287ca";
          this.borderBottomColor.username = "lightgray";
          this.$refs.passwordInput.focus();
        }
      },
      clear(type) {
        if (type === 'username') {
          this.username = "";
        }
        if (type === 'password') {
          this.password = "";
        }
      },
      forgetPassword() {
        openWebview({
          url: './login.forgetPassword.html',
          id: 'login.forgetPassword',
          needLoaded: true,
          titleStyle: {
            style: 'transparent',
            backgroundColor: 'white',
            titleText: '   ',
            titleColor: '#1287ca',
            autoBackButton: false,
            buttons: [{
              text: '返回',
              fontSize: '16px',
              float: 'left',
              onclick: this.webview.closeWebview.bind({webviewId: "login.forgetPassword"})
            }]
          }
        })
      },
      gotoRegister() {
        openWebview({
          url: './wallet.register.html',
          id: 'wallet.register',
          needLoaded: true,
          titleStyle: {
            style: 'transparent',
            backgroundColor: 'white',
            titleText: '   ',
            titleColor: '#1287ca',
            autoBackButton: false,
            buttons: [{
              text: '返回',
              fontSize: '16px',
              float: 'left',
              onclick: this.webview.closeWebview.bind({webviewId: "wallet.register"})
            }]
          }
        });
      },
      verifyCodeLogin() {
        openWebview({
          url: './login.verifyCodeLogin.html',
          id: 'login.verifyCodeLogin',
          needLoaded: true,
          titleStyle: {
            style: 'transparent',
            backgroundColor: 'white',
            titleText: '   ',
            titleColor: '#1287ca',
            autoBackButton: false,
            buttons: [{
              text: '返回',
              fontSize: '16px',
              float: 'left',
              onclick: this.webview.closeWebview.bind({webviewId: "login.verifyCodeLogin"})
            }]
          }
        })
      },
      changePasswordView() {
        this.passwordView = !this.passwordView;
        if (this.passwordType === "password") {
          this.passwordType = "text";
        } else {
          this.passwordType = "password";
        }
      },
      login() {
        let _this = this;
        _this.loginText = '正在登录...';
        _this.disabled = true;

        setTimeout(() => {
          _this.loginText = '立即登录';
          _this.disabled = false;
        }, 300)


        request(TGCApiUrl.login, {userName: this.username, password: this.password})
          .then(function (res) {
            plus.storage.setItem('uid', res.uid);
            plus.storage.setItem('token', res.token);
            plus.storage.setItem('walletAddress', res.walletAddress);
            plus.storage.setItem('walletName', res.walletName);
            plus.storage.setItem('walletKeyStroe', res.keyStore);

            let innerWebView = plus.webview.create(
              'common.home',
              './common.home.html',
              {
                titleNView: null,
                height: '93%',
                backButtonAutoControl: 'none',
                scrollIndicator: "none",
              },
            );
            _this.username = "";
            _this.password = "";

            openWebview({
              url: cons.homeViewUrl,
              id: cons.homeViewId,
              noTitle: true,
            }, {
              backButtonAutoControl: 'none',
              scrollIndicator: "none",
            }, {}, function () {
              plus.webview.getWebviewById(cons.homeViewId).append(innerWebView);
            });
          });
      }
    },
    watch: {
      username() {
        this.disabled = !RegexRoules.phone.test(this.username);
      }
    }
  }
</script>

<style scoped>
  .login-center {
    margin-top: 25%;
    width: 100%;
  }

  .login-bottom {
    color: #1287ca;
    margin-top: 3%;
    font-size: 16px;
  }

  .login-to-register {
    margin-top: 60%;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    color: #1287ca;
  }

</style>
