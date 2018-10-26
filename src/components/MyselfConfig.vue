<template>
  <div class="myselfbody">
    <van-nav-bar title="我的" class="navbar">
    </van-nav-bar>
    <div class="myself">
      <van-row gutter="20">
        <van-col span="8">
          <img src="../assets/chushitouxiang.jpg" class="header-img" width="70"/>
        </van-col>
        <van-col class="username">
          {{userNameShow}}
        </van-col>
      </van-row>
    </div>
    <van-cell-group>
      <van-cell title="邀请好友" is-link icon="point-gift" v-intervalclick="{func:yaoqing}">
      </van-cell>

      <van-cell title="我的捐赠" is-link icon="like-o">
      </van-cell>

      <van-cell title="检查更新" is-link icon="upgrade" v-intervalclick="{func:checkUpdate}">
      </van-cell>
    </van-cell-group>

    <div class="bottom">
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
  import {NavBar, Cell, CellGroup, Button, Row, Col} from 'vant';
  import {Icon} from 'vant';
  import cons from "../utils/constants/Cons";

  Vue.use(Icon);
  Vue.use(NavBar);
  Vue.use(Button);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(Cell).use(CellGroup);

  export default {
    data() {
      return {
        userNameShow: plus.storage.getItem('uid').substring(0, 10) + "...",
        uid: "",
      };
    },
    beforeCreate() {
      preLoad([
        {
          url: "./wallet.yaoqing.html",
          id: "wallet.yaoqing",
          title: "邀请好友"
        },
      ])
    },
    methods: {
      checkUpdate() {
        NativeFun.checkUpdate(true);
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

        showWebviewById(cons.loginViewId);
      }
    },
  }
</script>
<style scoped>
  .navbar {
    color: white;
    font-weight: bold;
    font-size: 20px;
    background-color: #ff8530;
    padding-top: 20px;
  }

  .van-hairline--bottom::after {
    border-bottom-width: 0;
  }

  a:-webkit-any-link {
    color: gray;
    text-decoration: none;
  }

  .myself {
    width: 100%;
    height: 150px;
    background-image: -webkit-linear-gradient(top, #ff8530, #ff5c0a);
  }

  .logout {
    background-color: orangered;
    color: white;
  }

  .header-img {
    flex-shrink: 0;
    margin-top: 20px;
    margin-left: 15%;
    border: calc(1px + 0.2vw) solid #32d25400;
    background-origin: border-box;
    background-clip: content-box, border-box;
    background-size: cover;
    box-shadow: 0 0 1px 1px rgb(255, 69, 0);
  }

  .username {
    color: white;
    margin-left: 10px;
  }

  .bottom {
    padding: 3%;
    margin-top: 17%
  }

  .myselfbody {
    overflow: hidden;
  }
</style>
