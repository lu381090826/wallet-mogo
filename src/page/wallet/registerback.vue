<template>
  <div>
    <van-cell-group>
      <van-field label="手机号"
                 type="number"
                 v-model="input.phone"
                 :error-message="phoneError"
                 @keyup.enter="register">
      </van-field>

      <van-field label="验证码"
                 v-model="input.captcha"
                 type="number"
                 :error-message="captchaError"
                 @keyup.enter="register">
        <van-button slot="button"
                    size="small"
                    type="default"
                    v-intervalclick="{func:sendCode}">
          发送验证码
        </van-button>
      </van-field>

      <van-field label="密码"
                 type="password"
                 v-model="input.password"
                 :error-message="passwordError"
                 @keyup.enter="register">
      </van-field>
      <van-field label="确认密码"
                 type="password"
                 v-model="input.passwordAgain"
                 :error-message="passwordAgainError"
                 @keyup.enter="register">
      </van-field>
    </van-cell-group>


    <van-row class="submit" type="flex" justify="center">
      <van-col span="20">
        <van-button type="default" v-intervalclick="{func:register}" class="button" size="large">
          立即注册
        </van-button>
      </van-col>
    </van-row>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {Field, Button, Toast, Cell, CellGroup, Row, Col} from 'vant';
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {request} from "../../utils/request";
  import RegexRoules from "../../utils/constants/RegexRoules";
  import {showWebviewById} from "../../utils/webview";
  import cons from "../../utils/constants/Cons";

  Vue.use(Row)
    .use(Col)
    .use(Field)
    .use(Button)
    .use(Toast)
    .use(Cell)
    .use(CellGroup);

  export default {
    data() {
      return {
        input: {
          phone: "",
          password: "",
          captcha: "",
          passwordAgain: ""
        },
        phoneError: "",
        captchaError: "",
        passwordError: "",
        passwordAgainError: ""
      };
    },
    watch: {
      input: {
        handler(newValue, oldValue) {
          this.clearInput();
        },
        deep: true
      }
    },
    methods: {
      clearInput() {
        this.phoneError = "";
        this.captchaError = "";
        this.passwordError = "";
        this.passwordAgainError = "";
      },
      register() {
        let inputCorrect = true;
        let inputMap = this.input;
        if (!RegexRoules.phone.test(inputMap.phone)) {
          this.phoneError = RegexRoules.errorMessage.phone;
          inputCorrect = false;
        }
        if (!RegexRoules.password.test(inputMap.password)) {
          this.passwordError = RegexRoules.errorMessage.password;
          inputCorrect = false;
        }
        if (!RegexRoules.captcha.test(inputMap.captcha)) {
          this.captchaError = RegexRoules.errorMessage.captcha;
          inputCorrect = false;
        }
        if (inputMap.passwordAgain !== inputMap.password) {
          this.passwordAgainError = RegexRoules.errorMessage.passwordAgain;
          inputCorrect = false;
        }

        if (!inputCorrect) {
          return false;
        }

        request(TGCApiUrl.register, inputMap).then(function (res) {

          if (res.uid) {
            Toast("创建成功");
            plus.storage.clear();
            plus.storage.setItem('uid', res.uid);
            plus.storage.setItem('token', res.token);
            plus.storage.setItem("walletAddress", res.walletAddress);
            plus.storage.setItem("walletName", res.walletName);

            plus.webview.open(
              cons.homeViewUrl,
              cons.homeViewId,
              {
                titleNView: null,
                render: "always"
              },
              "fade-in",
              200,
              function () {
                let ws = plus.webview.all();
                for (let i = 0; i < ws.length; i++) {
                  if (!cons.inLastWebViewIds(ws[i].id)) {
                    ws[i].reload();
                  }
                }
              }
            )
          }
        });

      },
      sendCode() {
        Toast('您正在注册感恩链账号，验证码为123456');
      }
    }
  }

</script>
<style scoped>
  .submit {
    margin-top: 20%;
  }
</style>
