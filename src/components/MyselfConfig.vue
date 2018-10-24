<template>
  <div class="myselfbody">
    <van-nav-bar title="我的" class="navbar">
    </van-nav-bar>
    <div class="myself">
      <img src="../assets/chushitouxiang.jpg" class="header-img" width="70"/>
    </div>

    <van-cell-group>
      <van-cell title="邀请好友" is-link icon="point-gift" v-intervalclick="{func:yaoqing}">
      </van-cell>

      <van-cell title="检查更新" is-link icon="upgrade" v-intervalclick="{func:checkUpdate}">
      </van-cell>
    </van-cell-group>

    <div style="margin: 3%;margin-top: 40%">
      <van-button v-intervalclick="{func:logout}" size="large" class="logout" style="margin-top: 100px">
        退出登录
      </van-button>
    </div>

  </div>
</template>
<script>
  import Vue from 'vue';
  import NativeFun from "../utils/plus/nativeFun";
  import {openWebview, preLoad, showWebviewById} from "../utils/webview";
  import {NavBar, Cell, CellGroup, Button} from 'vant';
  import {Icon} from 'vant';

  Vue.use(Icon);
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

        openWebview(
          {url: "./wallet.login.html", id: "wallet.login", noTitle: true},
          {},
          {webviewLast: true}
        );
      }
    },
  }
</script>
<style scoped>
  .navbar {
    color: white;
    font-weight: bold;
    font-size: 20px;
    background-color: orange;
  }

  .van-hairline--bottom::after {
    border-bottom-width: 0;
  }

  .myselfbody {
    text-align: left;
    padding-top: 22px;
  }

  a:-webkit-any-link {
    color: gray;
    text-decoration: none;
  }

  .myself {
    width: 100%;
    height: 150px;
    background-image: -webkit-linear-gradient(top, orange, orangered);
  }

  .logout {
    background-color: orangered;
    color: white;
  }

  .header-img {
    flex-shrink: 0;
    margin: 20px;
    border: calc(1px + 0.2vw) solid #32d25400;
    background-origin: border-box;
    background-clip: content-box, border-box;
    background-size: cover;
    box-shadow: 0 0 1px 1px rgb(255, 69, 0);
  }
</style>
