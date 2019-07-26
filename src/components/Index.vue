<template>
  <div>
    <van-tabbar v-model="active" fixed class="index-tabbar">
      <van-tabbar-item icon="wap-home">首页</van-tabbar-item>
      <van-tabbar-item icon="points">积分</van-tabbar-item>
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
  import {isEmpty} from "@/utils/globalFunc";
  import {isAndroid} from "../utils/tools";

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
        home: {
          id: 'common.home',
          url: './common.home.html',
          title: '感恩链',
          color: '#3a90e0',
        },
        asset: {
          id: 'wallet.asset',
          url: './wallet.asset.html',
          title: '积分',
          color: '#3a90e0',
        },
        wallet: {
          id: 'wallet.myselfConfig',
          url: './wallet.myselfConfig.html',
          title: '我的',
          color: '#53cbd9',
        },
      }
    },
    created() {
      // 动态改变webview的侧滑返回功能
      let wv = plus.webview.currentWebview();
      // 关闭侧滑返回功能
      wv.setStyle({scrollIndicator: 'none'});
      this.append(this.home);
    },
    mounted() {
      setTimeout(() => {
        nativeFun.checkUpdate(false);

        //监听步数
        if (isAndroid) {
          nativeFun.initSensorEventListener();
        }
      }, 1000);
    },
    methods: {
      append(obj) {
        let ws = plus.webview.getWebviewById(obj.id);
        if (isEmpty(ws)) {
          let titleNView;
          if (obj.id === 'common.home') {
            titleNView = null;
          } else {
            titleNView = {
              titleText: obj.title,
              backgroundColor: obj.color,
              statusBarBackground: obj.color,
              titleColor: '#ffffff',
              progress: {color: '#1a6eff', height: "1%"},
            }
          }

          let embed = plus.webview.create(obj.url, obj.id, {
            titleNView: titleNView,
            height: '93%',
            backButtonAutoControl: 'none',
            scrollIndicator: "none",
            // statusbar: {background: obj.color}
          });

          plus.webview.currentWebview().append(embed);
        } else {
          ws.show();
        }
      }
    },
    watch: {
      active() {
        switch (Number(this.active)) {
          case 0:
            this.append(this.home);
            break;
          case 1:
            this.append(this.asset);
            break;
          case 2:
            this.append(this.wallet);
            break;
          default:
            break;
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
