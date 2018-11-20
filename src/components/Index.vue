<template>
  <div>
    <div v-show="active===0">
      <Home></Home>
    </div>
    <div v-show="active===1">
      <Asset></Asset>
    </div>
    <div v-show="active===2">
      <MyselfConfig></MyselfConfig>
    </div>
    <van-tabbar v-model="active" fixed class="index-tabbar">
      <van-tabbar-item icon="home">首页</van-tabbar-item>
      <van-tabbar-item icon="gold-coin">财富</van-tabbar-item>
      <van-tabbar-item icon="contact">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
  import Home from '@/components/Home'
  import MyselfConfig from '@/components/MyselfConfig'
  import Profit from '@/components/Profit'
  import Asset from '@/components/Asset'
  import {
    Tabbar,
    TabbarItem
  } from "vant";
  import nativeFun from "@/utils/plus/nativeFun";
  import {request} from "@/utils/request";
  import {openWebview, openWebviewFast, preLoad} from "@/utils/webview";

  export default {
    components: {
      [Tabbar.name]: Tabbar,
      [TabbarItem.name]: TabbarItem,
      Home,
      MyselfConfig,
      Profit,
      Asset,
    },
    data() {
      return {
        active: 0,
      };
    },
    mounted() {
      setTimeout(() => {
        nativeFun.checkUpdate(false);

        //监听步数
        nativeFun.initSensorEventListener();
      }, 1000);
    },
  };
</script>

<style lang="less">
  :global {
    body {
      background-color: #f8f8f8;
      -webkit-font-smoothing: antialiased;
      font-family: PingFang SC, Helvetica Neue, Arial, sans-serif;
      overflow-x: hidden;
    }
  }

  .index-tabbar {
    bottom: 0;
  }
</style>
