<template>
  <div class="body" style="background-color: white;">
    <div style="text-align: left;margin-top: -10%">
      <van-icon name="arrow-left" size="30px" color="#1287ca" @click="closeWebview()"></van-icon>
    </div>
    <div style="margin-top: 10%"></div>
    <h1>输入验证码</h1>
    <div style="color: #7f7f7f">我们已向{{phone.replace(/(\d{3})\d*(\d{4})/,'$1****$2')}}发送短信验证码，请查看短信并输入验证码</div>
    <div class="tg-field" style="margin-top: 6%" :style="{borderBottomColor:borderBottomColor.code}"
         @focus="onFocus('code')">
      <van-row type="flex" justify="start">
        <van-col span="18" class="tg-field-label">
          <div>
            <van-row type="flex" justify="start">
              <van-col span="20">
                <input placeholder="" class="tg-field-input" v-model="code"
                ref="codeInput"/>
              </van-col>
              <van-col span="4">
                <van-icon name="cross" color="gray" size="20px" v-show="code"
                          @click="clear('code')"></van-icon>
              </van-col>
            </van-row>
          </div>
        </van-col>
      </van-row>
    </div>

    <van-button size="large" class="button-blue" style="margin-top: 8%;" @click="loginByCode" :disabled="disabled">
      立即登录
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
  import cons from "../../utils/constants/Cons";

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
        code: "",
        borderBottomColor: {
          code: "lightgray",
        },
        disabled: true,
      };
    },
    created() {
      let ws = plus.webview.currentWebview();
      this.phone = ws.phone;
    },
    methods: {
      onFocus(type) {
        if (type === 'code') {
          this.borderBottomColor.code = "#1287ca";
          this.$refs.codeInput.focus();
        }
      },
      clear(type) {
        if (type === 'code') {
          this.code = "";
        }
      },
      loginByCode() {
        let _this = this;
        request(TGCApiUrl.loginVerifyLoginCodeMsg, {mobile: this.phone, code: this.code}).then(res => {
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
          }, 100);
        })
      },
    },
    watch: {
      code() {
        this.disabled = !RegexRoules.verifyCode.test(this.code);
      }
    }
  }

</script>
<style scoped>
  .submit {
    margin-top: 20%;
  }
</style>
