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

    <div class="tg-field" :style="{borderBottomColor:borderBottomColor.passwordAgain}">
      <van-row type="flex" justify="start">
        <van-col span="6" class="tg-field-title">
          验证码
        </van-col>
        <van-col span="12" class="tg-field-label">
          <div>
            <van-row type="flex" justify="start">
              <van-col span="20">
                <input placeholder="请输入手机验证码" class="tg-field-input" type="text"
                       v-model="verifyCode"
                       @focus="onFocus('passwordAgain')"/>
              </van-col>
              <van-col span="4">
                <van-icon name="cross" color="gray" size="20px" v-show="verifyCode"
                          @click="clear('verifyCode')"></van-icon>
              </van-col>
            </van-row>
          </div>
        </van-col>
        <van-col span="8">
          <van-button size="small" type="default" v-intervalclick="{func:sendVerifyCode}"
                      :disabled="disableVerify">
            <span v-if="times===0 || times===60">获取</span>
            <span v-else>{{times}}s</span>
          </van-button>
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
        verifyCode: "",
        times: 0,
        disableVerify: false,
      };
    },
    methods: {
      checkAble() {
        return RegexRoules.password.test(this.password) && this.password === this.passwordAgain && isNotEmpty(this.phone);
      },
      sendVerifyCode() {
        request(TGCApiUrl.verifySendCodeMsg, {mobile: this.phone}).then(() => {
          Toast.success("验证码已发送")
        });
        this.disableVerify = true;
        this.times = 59;
        this.countdown();
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
      countdown() {
        let that = this;
        setTimeout(function () {
          if (that.times === 0) {
            that.times = 60;
            that.disableVerify = false;
            return false;
          } else {
            that.times--;
          }
          that.countdown();
        }, 1000);
      },
      clear(type) {
        if (type === 'password') {
          this.password = "";
        }
        if (type === 'passwordAgain') {
          this.passwordAgain = "";
        }
        if (type === 'verifyCode') {
          this.verifyCode = "";
        }
      },
      register() {
        let inputMap = {
          phone: this.phone,
          password: this.password,
          captcha: this.verifyCode,
          passwordAgain: ""
        };

        request(TGCApiUrl.register, inputMap).then(function (res) {

          if (res.uid) {
            plus.storage.clear();
            plus.storage.setItem('uid', res.uid);
            plus.storage.setItem('token', res.token);
            plus.storage.setItem('walletAddress', res.walletAddress);
            plus.storage.setItem('walletName', res.walletName);
            plus.storage.setItem('walletKeyStroe', res.keyStore);

            openWebview({
              url: cons.homeViewUrl,
              id: cons.homeViewId,
              noTitle: true,
            }, {
              backButtonAutoControl: 'none',
              scrollIndicator: "none",
            },);
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
            plus.webview.currentWebview().append(innerWebView);
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
