<template>
  <div class="body" style="background-color: white;">
    <div style="text-align: left;margin-top: -10%">
      <van-icon name="arrow-left" size="30px" color="#1287ca" @click="closeWebview()"></van-icon>
    </div>
    <div style="margin-top: 10%"></div>
    <h1>修改密码</h1>
    <div style="color: #7f7f7f">我们已向{{phone.replace(/(\d{3})\d*(\d{4})/,'$1****$2')}}发送短信验证码，请查看短信并输入验证码</div>

    <tg-field :placeholder="placeholder.code" type="number" ref="code"/>

    <tg-field :placeholder="placeholder.password" type="password" ref="password"/>

    <tg-field :placeholder="placeholder.passwordAgain" type="password" ref="passwordAgain"/>

    <van-button size="large" class="button-blue" style="margin-top: 8%;" @click="submit">
      立即修改
    </van-button>

  </div>
</template>
<script>
  import Vue from 'vue';
  import {Button, Col, Icon, Row, Toast} from 'vant';
  import "@/utils/css/TgField.less"
  import RegexRoules from "@/utils/constants/RegexRoules";
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import TgField from "./TgField";
  import cons from "../../utils/constants/Cons";

  Vue.use(Row)
    .use(Col)
    .use(Icon)
    .use(Toast)
    .use(Button);

  export default {
    components: {TgField},
    data() {
      return {
        guishudi: "中国大陆",
        phone: "",
        codeInput: "",
        password: "",
        passwordAgain: "",
        placeholder: {
          code: "请输入验证码",
          password: "请输入密码",
          passwordAgain: "请再次输入密码",
        },
      };
    },
    created() {
      let ws = plus.webview.currentWebview();
      this.phone = ws.phone;
    },
    methods: {
      submit() {
        let code = this.$refs.code.currentValue;
        let password = this.$refs.password.currentValue;
        let passwordAgain = this.$refs.passwordAgain.currentValue;

        if (!RegexRoules.verifyCode.test(code)) {
          Toast.fail("请检查验证码是否正确");
          return false;
        }
        if (!RegexRoules.password.test(password)) {
          Toast.fail("请检查密码格式是否正确");
          return false;
        }
        if (!RegexRoules.password.test(passwordAgain) && this.passwordAgain !== password) {
          Toast.fail("请检查第二次输入的密码是否正确");
          return false;
        }

        request(TGCApiUrl.changePassword, {mobile: this.phone, code: code, password: password}).then(res => {
          if (res === 1) {
            Toast.success("修改成功")
            setTimeout(() => {
              let loginWx = plus.webview.getWebviewById(cons.loginViewId);
              loginWx.show();
            }, 100)

          }
        })
      },
    },
  }

</script>
