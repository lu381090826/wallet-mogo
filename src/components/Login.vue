<template>
  <div class="body" style="text-align: center;background-color: white;">
    <div class="login-center">
      <van-row type="flex" justify="center">
        <div>
          <img src="../assets/gongyilan.png" width="90">
        </div>
      </van-row>

      <div class="tg-field" style="margin-top: 15%" :style="{borderBottomColor:borderBottomColor.username}">
        <van-row type="flex" justify="start">
          <van-col span="7" class="tg-field-title">账号</van-col>
          <van-col span="17" class="tg-field-label">
            <div>
              <van-row type="flex" justify="start">
                <van-col span="20">
                  <input placeholder="请输入手机号" class="tg-field-input" v-model="username" @focus="onFocus('username')"/>
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

      <div class="tg-field" :style="{borderBottomColor:borderBottomColor.password}">
        <van-row type="flex" justify="start">
          <van-col span="7" class="tg-field-title">密码</van-col>
          <van-col span="17" class="tg-field-label">
            <div>
              <van-row type="flex" justify="start">
                <van-col span="16">
                  <input :type="passwordType" placeholder="请输入密码" class="tg-field-input"
                         v-model="password" @focus="onFocus('password')"/>
                </van-col>
                <van-col span="4">
                  <van-icon name="cross" color="gray" size="20px" v-show="password"
                            @click="clear('password')"></van-icon>
                </van-col>
                <van-col span="4">
                  <van-icon name="password-not-view" color="gray" size="20px"
                            v-show="!passwordView" @click="changePasswordView">
                  </van-icon>
                  <van-icon name="password-view" color="#76c3e8" size="20px"
                            v-show="passwordView" @click="changePasswordView">
                  </van-icon>
                </van-col>
              </van-row>
            </div>
          </van-col>
        </van-row>
      </div>

      <van-button size="large" class="button-blue" style="margin-top: 8%;" @click="login" :disabled="disabled">登录
      </van-button>

      <div class="login-bottom">
        <van-row type="flex" justify="space-between">
          <van-col>
            短信验证码登录
          </van-col>
          <van-col>
            忘记密码？
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="login-to-register" @click="gotoRegister">
      注册
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import "../utils/css/TgField.less"
  import {Button, Col, Icon, Row} from 'vant';
  import RegexRoules from "@/utils/constants/RegexRoules";
  import TGCApiUrl from "@/utils/constants/TGCApiUrl";
  import {request} from "@/utils/request";
  import {openWebview} from "@/utils/webview";
  import cons from "@/utils/constants/Cons";

  Vue.use(Row).use(Col);
  Vue.use(Icon);
  Vue.use(Button);

  export default {
    data() {
      return {
        username: "",
        password: "",
        passwordView: false,
        passwordType: "password",
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
        }
        if (type === 'password') {
          this.borderBottomColor.password = "#1287ca";
          this.borderBottomColor.username = "lightgray";
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
            buttons: [{text: '返回', fontSize: '16px', float: 'left', onclick: this.webview.closeWebview.bind({webviewId:"wallet.register"})}]
          }
        });
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

            _this.username = "";
            _this.password = "";

            let wait = plus.nativeUI.showWaiting();
            let webView = plus.webview.create(
              cons.homeViewUrl,
              cons.homeViewId,
              {
                titleNView: null,
                render: "always"
              },
            );
            webView.addEventListener('loaded', function () {
              webView.show("slide-in-right");
              wait.close();

              let ws = plus.webview.all();
              for (let i = 0; i < ws.length; i++) {
                if (!cons.inLastWebViewIds(ws[i].id)) {
                  ws[i].close();
                }
              }
            }, 100);
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
    margin-top: 10%;
    width: 100%;
  }

  .login-bottom {
    color: #1287ca;
    margin-top: 3%;
    font-size: 16px;
  }

  .login-to-register {
    margin-top: 40%;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    color: #1287ca;
  }

</style>
