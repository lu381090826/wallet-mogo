<template>
  <div class="body" style="background-color: white;">
    <div style="text-align: left;margin-top: -10%">
      <van-icon name="arrow-left" size="30px" color="#1287ca" @click="closeWebview()"></van-icon>
    </div>
    <div style="margin-top: 10%"></div>
    <h1>手机验证码登录</h1>
    <div class="tg-field" style="margin-top: 6%">
      <van-row type="flex" justify="start">
        <van-col span="16" class="tg-field-title">
          手机号归属地
        </van-col>
        <van-col span="8" class="tg-field-label">
          <div>
            <van-row type="flex" justify="start">
              <van-col span="20">
                <label>
                  <input class="tg-field-input" v-model="guishudi" readonly/>
                </label>
              </van-col>
            </van-row>
          </div>
        </van-col>
      </van-row>
    </div>

    <div class="tg-field" style="margin-top: 6%" :style="{borderBottomColor:borderBottomColor.phone}">
      <van-row type="flex" justify="start">
        <van-col span="6" class="tg-field-title">
          +86
        </van-col>
        <van-col span="18" class="tg-field-label">
          <div>
            <van-row type="flex" justify="start">
              <van-col span="20">
                <input placeholder="请输入手机号" class="tg-field-input" v-model="phone" @focus="onFocus('phone')"/>
              </van-col>
              <van-col span="4">
                <van-icon name="cross" color="gray" size="20px" v-show="phone"
                          @click="clear('phone')"></van-icon>
              </van-col>
            </van-row>
          </div>
        </van-col>
      </van-row>
    </div>

    <van-button size="large" class="button-blue" style="margin-top: 8%;" @click="sendVerifyCode" :disabled="disabled">
      下一步
    </van-button>

  </div>
</template>
<script>
  import Vue from 'vue';
  import {Button, Row, Col, Toast, Icon} from 'vant';
  import "@/utils/css/TgField.less"
  import RegexRoules from "@/utils/constants/RegexRoules";
  import {openWebview} from "../../utils/webview";
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";

  Vue.use(Row)
    .use(Col)
    .use(Icon)
    .use(Toast)
    .use(Button);

  export default {
    data() {
      return {
        guishudi: "中国大陆",
        phone: "",
        borderBottomColor: {
          phone: "lightgray",
        },
        disabled: true,
      };
    },
    methods: {
      onFocus(type) {
        if (type === 'phone') {
          this.borderBottomColor.phone = "#1287ca";
        }
      },
      clear(type) {
        if (type === 'phone') {
          this.phone = "";
        }
      },
      sendVerifyCode() {
        request(TGCApiUrl.loginSendCodeLoginMsg, {mobile: this.phone}).then(res => {
          if (res !== 1) {
            return false;
          }
          openWebview({
            url: './login.verifyCodeCheckLogin.html',
            id: 'login.verifyCodeCheckLogin',
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
                onclick: this.webview.closeWebview.bind({webviewId: "login.verifyCodeCheckLogin"}),
              }]
            }
          }, {}, {phone: this.phone})
        });
      },
      register() {
        openWebview({
          url: './wallet.registerSetPassword.html',
          id: 'wallet.registerSetPassword',
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
              onclick: this.webview.closeWebview.bind({webviewId: 'wallet.registerSetPassword'})
            }]
          }
        }, {}, {phone: this.phone})
      },
    },
    watch: {
      phone() {
        this.disabled = !RegexRoules.phone.test(this.phone);
      }
    }
  }

</script>
<style scoped>
  .submit {
    margin-top: 20%;
  }
</style>
