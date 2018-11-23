<template>
  <div class="myselfbody">
    <van-nav-bar title="我的" class="navbar">
    </van-nav-bar>

    <div class="blank-space"></div>
    <div class="blank-space"></div>

    <van-cell-group>
      <van-cell title="邀请好友" is-link icon="point-gift" v-intervalclick="{func:yaoqing}">
      </van-cell>

      <van-cell title="我的捐助" is-link icon="like-o" v-intervalclick="{func:wodejuanzeng}">
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
  import {openWebview, openWebviewFast, preLoad, showWebviewById} from "../utils/webview";
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
        uid: "",
      };
    },
    methods: {
      checkUpdate() {
        NativeFun.checkUpdate(true);
      },
      wodejuanzeng() {
        openWebview({
          url: './charitable.myCharitable.html',
          id: 'charitable.myCharitable',
          titleStyle: {
            titleText: "我的捐助",
            titleColor: "#ffffff",
            backgroundColor: "#ffa500",
            splitLine: {color: "#ffa500"},
            autoBackButton: true,
            progress: {color: '#ff5c0a', height: "1%"}
          }
        })
      },
      yaoqing() {
        openWebview({
          url: './wallet.yaoqing.html',
          id: 'wallet.yaoqing',
          title: '邀请好友',
        });
      },
      logout() {
        plus.storage.clear();
        openWebview({
          url: cons.loginViewUrl,
          id: cons.loginViewId,
          title: "",
          noTitle: true,
        });
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

  a:-webkit-any-link {
    color: gray;
    text-decoration: none;
  }

  .logout {
    background-color: orangered;
    color: white;
  }

  .bottom {
    padding: 3%;
    margin-top: 40%
  }

  .myselfbody {
    overflow: hidden;
  }

</style>
