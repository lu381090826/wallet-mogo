<template>
  <div>
    <Palaces></Palaces>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home">首页</van-tabbar-item>
      <van-tabbar-item icon="contact">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
  import Palaces from './components/Palaces'
  import {
    Tabbar,
    TabbarItem
  } from "vant";
  import {
    openWebview,
    openWebviewFast,
    preLoad,
    showWebviewById
  } from "@/utils/webview";
  import nativeFun from "./utils/plus/nativeFun";

  export default {
    components: {
      [Tabbar.name]: Tabbar,
      [TabbarItem.name]: TabbarItem,
      Palaces,
    },
    data() {
      return {
        active: 0,
        activeName: 1,
      };
    },
    created() {
      function plusReady() {

        //检查版本
        nativeFun.checkUpdate(false);

      }

      if (window.plus) {
        plusReady();
      } else {
        document.addEventListener("plusready", plusReady, false);
      }
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
