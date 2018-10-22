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

    <van-button type="danger" @click="logout()" size="large">退出登录</van-button>

  </div>
</template>
<script>
  import Vue from 'vue';
  import {NavBar, Cell, CellGroup,Button} from 'vant';
  import NativeFun from "../utils/plus/nativeFun";
  import {openWebview} from "../utils/webview";

  Vue.use(NavBar);
  Vue.use(Button);
  Vue.use(Cell).use(CellGroup);

  export default {
    data() {
      return {};
    },
    created() {
      function plusReady() {

      }

      if (window.plus) {
        plusReady();
      } else {
        document.addEventListener("plusready", plusReady, false);
      }

    },
    methods: {
      checkUpdate() {
        NativeFun.checkUpdate(true)
      },
      yaoqing() {
        openWebview({url: "./wallet.yaoqing.html", id: "wallet.yaoqing", title: "邀请好友"});
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

        openWebview({url: "./wallet.login.html", id: "wallet.login", title: "登录"});
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
