<template>
  <div style="padding: 2%">
    <div class="box">
      <van-cell-group>
        <van-cell>
          <van-field label="身份证"
                     type="text"
                     v-model="idcard"
                     placeholder="请输入身份证号码"
                     required clearable
          ></van-field>
        </van-cell>

        <van-cell>
          <van-field label="姓名"
                     type="text"
                     v-model="realname"
                     placeholder="请输入真实姓名"
                     required clearable
          ></van-field>
        </van-cell>

        <van-cell>
          <van-field label="验证码"
                     type="number"
                     v-model="verifyCode"
                     placeholder="验证码"
                     required clearable
          >
            <van-button slot="button" size="small" type="default" v-intervalclick="{func:sendVerifyCode}"
                        :disabled="disableVerify">
              <span v-if="times===0 || times===60">获取验证码</span>
              <span v-else>{{times}}s</span>
            </van-button>
          </van-field>

        </van-cell>
      </van-cell-group>
      <div style="margin-top: 6%;margin-bottom: 6%">
        <van-button class="button-blue" size="large" v-intervalclick="{func:checkVerifyCode}">
          立即验证
        </van-button>
      </div>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'
  import {Cell, CellGroup, Field, Button, Toast} from 'vant';
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";

  Vue.use(Cell).use(CellGroup).use(Field).use(Button).use(Toast);

  export default {
    data() {
      return {
        idcard: "",
        realname: "",
        verifyCode: "",
        times: 0,
        disableVerify: false,
      }
    },
    methods: {
      checkVerifyCode() {
        let params = {
          idcard: this.idcard,
          realname: this.realname,
          verifyCode: this.verifyCode,
        };
        let ws = plus.webview.currentWebview();
        request(TGCApiUrl.verifyIdcard, params).then(res => {
          if (res === 1) {
            Toast.success("认证成功");
            setTimeout(() => {
              ws.close();
            }, 300)
          }

        })
      },
      sendVerifyCode() {
        request(TGCApiUrl.verifySendCodeMsg).then(() => {
          Toast.success("验证码已发送")
        });
        this.disableVerify = true;
        this.times = 59;
        this.countdown();
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
      }
    }
  }
</script>
