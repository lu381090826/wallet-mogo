<template>
  <div class="body" style="background-color: white;">
    <div style="text-align: left;margin-top: -10%">
      <van-icon name="arrow-left" size="30px" color="#1287ca" @click="closeWebview()"></van-icon>
    </div>
    <div style="margin-top: 10%"></div>
    <h1>设置密码</h1>

    <div class="tg-field" :style="{borderBottomColor:borderBottomColor.password}">
      <van-row type="flex" justify="start">
        <van-col span="6" class="tg-field-title">
          密码
        </van-col>
        <van-col span="18" class="tg-field-label">
          <div>
            <van-row type="flex" justify="start">
              <van-col span="20">
                <input placeholder="请输入密码" class="tg-field-input" v-model="password"
                       @focus="onFocus('password')"
                       type="password"
                />
              </van-col>
              <van-col span="4">
                <van-icon name="cross" color="gray" size="20px" v-show="password"
                          @click="clear('password')"></van-icon>
              </van-col>
            </van-row>
          </div>
        </van-col>
      </van-row>
    </div>

    <div class="tg-field" :style="{borderBottomColor:borderBottomColor.passwordAgain}">
      <van-row type="flex" justify="start">
        <van-col span="6" class="tg-field-title">
          确认密码
        </van-col>
        <van-col span="18" class="tg-field-label">
          <div>
            <van-row type="flex" justify="start">
              <van-col span="20">
                <input placeholder="请再次确认密码" class="tg-field-input" type="password"
                       v-model="passwordAgain"
                       @focus="onFocus('passwordAgain')"/>
              </van-col>
              <van-col span="4">
                <van-icon name="cross" color="gray" size="20px" v-show="passwordAgain"
                          @click="clear('passwordAgain')"></van-icon>
              </van-col>
            </van-row>
          </div>
        </van-col>
      </van-row>
    </div>

    <van-button size="large" class="button-blue" style="margin-top: 8%;" @click="register" :disabled="disabled">立即注册
    </van-button>

  </div>
</template>
<script>
  import Vue from 'vue';
  import {Button, Row, Col, Icon, Toast} from 'vant';
  import "@/utils/css/TgField.less"
  import RegexRoules from "@/utils/constants/RegexRoules";
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {isNotEmpty} from "../../utils/globalFunc";
  import cons from "../../utils/constants/Cons";
  import {openWebview} from "../../utils/webview";

  Vue.use(Row)
    .use(Col)
    .use(Icon)
    .use(Button);

  export default {
    data() {
      return {
        password: "",
        passwordAgain: "",
        borderBottomColor: {
          password: "lightgray",
          passwordAgain: "lightgray",
        },
        disabled: true,
        phone: null,
        captcha: "123456",
      };
    },
    methods: {
      checkAble() {
        return RegexRoules.password.test(this.password) && this.password === this.passwordAgain && isNotEmpty(this.phone);
      },
      onFocus(type) {
        if (type === 'password') {
          this.borderBottomColor.password = "#1287ca";
          this.borderBottomColor.passwordAgain = "lightgray";
        } else {
          this.borderBottomColor.passwordAgain = "#1287ca";
          this.borderBottomColor.password = "lightgray";
        }
      },
      clear(type) {
        if (type === 'password') {
          this.password = "";
        }
        if (type === 'passwordAgain') {
          this.passwordAgain = "";
        }
      },
      register() {
        let inputMap = {
          phone: this.phone,
          password: this.password,
          captcha: this.captcha,
          passwordAgain: ""
        };

        request(TGCApiUrl.register, inputMap).then(function (res) {

          if (res.uid) {
            plus.storage.clear();
            plus.storage.setItem('uid', res.uid);
            plus.storage.setItem('token', res.token);
            plus.storage.setItem("walletAddress", res.walletAddress);
            plus.storage.setItem("walletName", res.walletName);

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

          }
        })
      },
    },
    created() {
      let cw = plus.webview.currentWebview();
      this.phone = cw.phone;
    },
    watch: {
      password() {
        this.disabled = !this.checkAble();
      },
      passwordAgain() {
        this.disabled = !this.checkAble();
      }
    }
  }

</script>
<style scoped>
  .submit {
    margin-top: 20%;
  }
</style>
