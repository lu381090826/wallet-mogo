<template>
  <div style="padding: 3%">
    <div class="box">
      <div>
        <van-cell-group>
          <van-cell title="地址">
            {{walletAddress}}
          </van-cell>
          <van-cell title="地址名称" @click="alterWalletName">
            {{walletName}}
          </van-cell>
        </van-cell-group>
      </div>


      <div style="margin-top: 5%">
        <van-cell-group>
          <van-cell title="导出私钥"
                    is-link
                    @click="exportPrivateKey(10)"
          >
          </van-cell>
          <van-cell title="导出KeyStore"
                    is-link
                    @click="exportPrivateKey(20)"
          >
          </van-cell>
        </van-cell-group>
      </div>

      <div style="text-align: center;margin-top: 30%;margin-bottom: 5%">
        <van-button size="large" v-intervalclick="{func:deleteWallet}">
          删除地址
        </van-button>
      </div>
    </div>

    <van-popup v-model="confirmExport" class="box" style="width: 300px;height: 300px">
      <div style="text-align: center;">
        <div style="padding: 10%">
          尊敬的客户，导出私钥需要手机验证，认证短信将发送到{{mobile}}
        </div>
        <van-cell-group>
          <van-field label="验证码"
                     type="number"
                     v-model="verifyCode"
                     placeholder="验证码"
                     clearable
          >
            <van-button slot="button" size="small" type="default" v-intervalclick="{func:sendVerifyCode}"
                        :disabled="disableVerify">
              <span v-if="times===0 || times===60">发送短信</span>
              <span v-else>{{times}}s</span>
            </van-button>
          </van-field>

          <van-field label="地址密码"
                     type="password"
                     v-model="password"
                     placeholder="密码"
                     clearable
                     v-if="exportType===10"
          >
          </van-field>
        </van-cell-group>
        <div style="width: 80%;text-align: center;margin-left: 10%;margin-top: 10%">
          <van-button size="large" @click="exportKey">立即导出</van-button>
        </div>
      </div>
    </van-popup>
    <van-popup class="box" style="width: 80%" v-model="keyShow">
      <div style="padding: 10%;word-break:break-all; ">
        {{key}}
      </div>
      <div style="margin-top: 5%;">
        <van-button size="large" @click="doCopy" type="info">复制</van-button>
      </div>
    </van-popup>

    <van-popup class="box" style="width: 80%;height: 150px" v-model="alterWalletNameShow">
      <van-field label="地址名称"
                 type="text"
                 v-model="newWalletName"
                 placeholder="输入新的地址名称"
                 clearable
      >
      </van-field>
      <div style="margin-top: 18%;">
        <van-button size="large" @click="doAlterWalletName" type="info">修改</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {isEmpty, isNotEmpty} from "@/utils/globalFunc";
  import {Toast, Cell, CellGroup, Button, Field} from "vant";
  import {Popup} from 'vant';
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import VueClipboard from 'vue-clipboard2'
  import Web3Util from "../../utils/web3Util/Web3Util";
  import {Dialog} from 'vant';
  import {fire} from "../../utils/envent";

  Vue.use(Dialog);
  Vue.use(Popup);
  Vue.use(Field);
  Vue.use(VueClipboard);
  Vue.use(Cell).use(CellGroup).use(Toast).use(Button);
  export default {
    data() {
      return {
        walletAddress: null,
        walletName: null,
        value: null,
        mobile: null,
        password: null,
        confirmExport: false,
        times: 0,
        disableVerify: false,
        exportType: null,
        verifyCode: null,
        keyShow: false,
        alterWalletNameShow: false,
        newWalletName: null,
        key: "获取失败。",
      }
    },
    methods: {
      alterWalletName() {
        this.alterWalletNameShow = !this.alterWalletNameShow
      },
      exportPrivateKey(type) {
        this.confirmExport = true;
        this.exportType = type;
      },
      exportKey() {
        Toast.loading("正在风险审核，请稍等...");
        setTimeout(() => {
          Web3Util.getBalance(this.walletAddress).then(res => {
            if (Number(res) > 30000) {
              Dialog.alert({
                message: '您地址价值过大，不允许系统直接导出，请联系客服咨询。'
              });
              return;
            }
            Toast.loading("正在获取私钥...");
            setTimeout(() => {
              request(TGCApiUrl.exprotKey, {
                exportPrivateType: this.exportType,
                verifyCode: this.verifyCode,
                walletAddress: this.walletAddress,
                password: this.password,
              }).then(res => {
                this.confirmExport = !this.confirmExport;
                this.keyShow = !this.keyShow;
                this.key = res;
                Toast.clear();
              });
            }, 50);
          })
        }, 50);
      },
      doAlterWalletName() {
        let s = this;
        request(TGCApiUrl.alterWalletName, {
          walletAddress: this.walletAddress,
          walletName: this.newWalletName
        }).then(res => {
          Toast.success("修改成功");
          s.walletName = s.newWalletName;
          fire(plus.webview.getWebviewById("wallet.walletConfig"), 'init');
          fire(plus.webview.getWebviewById("common.home"), 'walletList');
          fire(plus.webview.getWebviewById("wallet.asset"), 'walletList');
          s.alterWalletNameShow = false;
        })
      },
      sendVerifyCode() {
        request(TGCApiUrl.verifySendCodeMsg).then(res => {
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
      },
      deleteWallet() {
        let _this = this;
        let ws = plus.webview.currentWebview();
        Dialog.confirm({
          title: '删除地址',
          message: '确定要删除吗？'
        }).then(() => {
          request(TGCApiUrl.walletDelete, {
            walletAddress: this.walletAddress
          }).then(res => {
            Toast.success("删除成功");
            fire(plus.webview.getWebviewById("wallet.walletConfig"), 'init');
            fire(plus.webview.getWebviewById("common.home"), 'walletList');
            fire(plus.webview.getWebviewById("wallet.asset"), 'walletList');
            setTimeout(() => {
              ws.close();
            })
          });
        })

      },
      doCopy() {
        let _this = this;
        _this.$copyText(_this.key).then(function (e) {
          Toast.success({
            message: '复制成功',
            position: 'bottom',
          })
        }, function (e) {
        })
      }
    },
    created() {
      let _this = this;
      let ws = plus.webview.currentWebview();
      this.walletAddress = ws.walletAddress;
      this.walletName = ws.walletName;
      request(TGCApiUrl.userGetMobile).then(res => {
        _this.mobile = res;
      })
    },
  }

</script>
<style scoped>

</style>
