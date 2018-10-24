<template>
  <div>
    <div v-show="active===0">
      <Palaces></Palaces>
    </div>
    <div v-show="active===1">
      <MyselfConfig></MyselfConfig>
    </div>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home">首页</van-tabbar-item>
      <van-tabbar-item icon="contact">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
  import Palaces from './components/Palaces'
  import MyselfConfig from './components/MyselfConfig'
  import {
    Tabbar,
    TabbarItem
  } from "vant";
  import {
    openWebview,
    openWebviewFast,
    preLoad,
    showWebviewById
  } from "./utils/webview";
  import nativeFun from "./utils/plus/nativeFun";
  import {request} from "./utils/request";
  import TGCApiUrl from "./utils/constants/TGCApiUrl";

  export default {
    components: {
      [Tabbar.name]: Tabbar,
      [TabbarItem.name]: TabbarItem,
      Palaces,
      MyselfConfig,
    },
    data() {
      return {
        active: 0,
      };
    },
    mounted() {
      request(TGCApiUrl.checkLogin);
      // nativeFun.checkUpdate(false);
    }
  };
</script>

<style lang="less">
  :global {
    body {
      background-color: #f8f8f8;
      -webkit-font-smoothing: antialiased;
      font-family: PingFang SC, Helvetica Neue, Arial, sans-serif;
    }
  }
</style>
