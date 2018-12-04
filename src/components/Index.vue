<template>
  <div>
    <div v-show="active===0">
      <Home></Home>
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
  import {isNotEmpty} from "../utils/globalFunc";

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
    created() {
      // 动态改变webview的侧滑返回功能：
      let wv = plus.webview.currentWebview();
      // 关闭侧滑返回功能
      wv.setStyle({'scrollIndicator': 'none'});
    },
    mounted() {
      setTimeout(() => {
        nativeFun.checkUpdate(false);

        //监听步数
        nativeFun.initSensorEventListener();
      }, 1000);
    },
    watch: {
      active() {
        if (this.active !== 0) {
          let id;
          let url;
          if (this.active === 1) {
            id = 'wallet.asset';
            url = './wallet.asset.html';
          }

          let ws = plus.webview.getWebviewById(id);
          let embed;
          if (isNotEmpty(ws)) {
            embed = ws;
            embed.show();
          } else {
            embed = plus.webview.create(url, id, {
              top: '-48px',
              bottom: '7%',
              titleNView: {
                progress: {color: '#ff5c0a', height: "1px"}
              },
              backButtonAutoControl: 'none'
            });
            plus.webview.currentWebview().append(embed);
          }
        } else {
          let ws = plus.webview.getWebviewById('wallet.asset');
          if (isNotEmpty(ws)) {
            ws.hide();
          }
        }
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
      overflow-x: hidden;
    }
  }

  .index-tabbar {
    bottom: 0;
  }
</style>
