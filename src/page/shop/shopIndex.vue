<template>
  <div>
    <div v-show="active===0">
      <goodsShows></goodsShows>
    </div>
    <div v-show="active===1">

    </div>
    <van-tabbar v-model="active" fixed class="index-tabbar">
      <van-tabbar-item icon="home">首页</van-tabbar-item>
      <van-tabbar-item icon="gold-coin">购物车</van-tabbar-item>
      <van-tabbar-item icon="contact">订单</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  import Vue from "vue";
  import {Tabbar, TabbarItem} from 'vant';
  import goodsShows from "@/components/GoodsShows";
  import Cart from "../../components/Cart";
  import {openWebviewFast} from "../../utils/webview";
  import {isNotEmpty} from "../../utils/globalFunc";

  Vue.use(Tabbar).use(TabbarItem);
  export default {
    data() {
      return {
        active: 0,
      }
    },
    created() {
    },
    components: {
      Cart,
      goodsShows
    },
    watch: {
      active() {
        switch (Number(this.active)) {
          case 0:
            plus.webview.getWebviewById('shop.cart').close();
            break;
          case 1:
            let ws = plus.webview.getWebviewById('shop.cart');
            if (isNotEmpty(ws)) {
              ws.close();
            }
            let embed = plus.webview.create('./shop.cart.html', 'shop.cart', {
              top: '1px',
              bottom: '7%',
              titleNView: {
                progress: {color: '#ff5c0a', height: "1px"}
              },
              backButtonAutoControl: 'none'
            });
            plus.webview.currentWebview().append(embed);
            break;
          default:
            break;
        }
      }
    }
  }
</script>

<style scoped>

</style>
