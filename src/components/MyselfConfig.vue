<template>
  <div class="myselfbody">
    <van-nav-bar title="感恩链">
    </van-nav-bar>

    <van-cell-group>
      <van-cell title="邀请好友" is-link icon="point-gift" v-intervalclick="{func:yaoqing}">
      </van-cell>

      <van-cell title="检查更新" is-link icon="upgrade" v-intervalclick="{func:checkUpdate}">
      </van-cell>
    </van-cell-group>

    <div style="margin: 3%">
      <van-button type="danger" v-intervalclick="{func:logout}" size="large" style="margin-top: 100px">退出登录</van-button>
    </div>

  </div>
</template>
<script>
  import Vue from 'vue';
  import NativeFun from "../utils/plus/nativeFun";
  import {openWebview, preLoad, showWebviewById} from "../utils/webview";
  import {NavBar, Cell, CellGroup, Button} from 'vant';

  Vue.use(NavBar);
  Vue.use(Button);
  Vue.use(Cell).use(CellGroup);

  export default {
    data() {
      return {};
    },
    mounted() {
      preLoad([
        {
          url: "./wallet.yaoqing.html",
          id: "wallet.yaoqing",
          title: "邀请好友"
        },
        {
          url: "./wallet.login.html",
          id: "wallet.login",
          title: "登录",
          autoBackButton: false,
          extras: {webviewLast: true}
        }
      ]);
    },
    methods: {
      checkUpdate() {
        NativeFun.checkUpdate(true)
      },
      yaoqing() {
        showWebviewById('wallet.yaoqing');
      },
      logout() {
        let todayStep = plus.storage.getItem("todayStep");
        let totalStep = plus.storage.getItem("totalStep");
        let stepCountTime = plus.storage.getItem("stepCountTime");
        let hasChange = plus.storage.getItem("hasChange");

        plus.storage.clear();

        plus.storage.setItem("todayStep", parseInt(todayStep));
        plus.storage.setItem("totalStep", parseInt(totalStep));
        plus.storage.setItem("stepCountTime", stepCountTime);
        plus.storage.setItem("hasChange", hasChange);

        showWebviewById('wallet.login');
      }
    },
  }
</script>
<style scoped>

  .myselfbody {
    text-align: left;
    padding-top: 22px;
  }

  a:-webkit-any-link {
    color: gray;
    text-decoration: none;
  }
</style>
