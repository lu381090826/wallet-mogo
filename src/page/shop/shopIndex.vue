<template>
  <div>
    <van-tabbar v-model="active" fixed class="index-tabbar">
      <van-tabbar-item icon="home">首页</van-tabbar-item>
      <!--<van-tabbar-item icon="gold-coin">购物车</van-tabbar-item>-->
      <van-tabbar-item icon="contact">订单</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
  import Vue from "vue";
  import {Tabbar, TabbarItem} from 'vant';
  import {isEmpty} from "@/utils/globalFunc";
  import {isEmptyObject} from "@/utils/globalFunc";

  Vue.use(Tabbar).use(TabbarItem);
  export default {
    data() {
      return {
        active: 0,
        goodsShows: {
          id: 'shop.goodsShows',
          url: './shop.goodsShows.html',
        },
        cart: {
          id: 'shop.cart',
          url: './shop.cart.html',
        },
      }
    },
    created() {
      this.append(this.goodsShows)
    },
    methods: {
      append(obj) {
        let ws = plus.webview.getWebviewById(obj.id);
        console.log(ws);
        if (isEmptyObject(ws)) {
          let embed = plus.webview.create(obj.url, obj.id, {
            height: '93%',
            backButtonAutoControl: 'none',
            // top: '1px',
            // bottom: '7%',
            titleNView: {
              progress: {color: '#ff5c0a', height: "1px"}
            },
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
            this.append(this.goodsShows);
            break;
          case 1:
            // this.append(this.cart);
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
