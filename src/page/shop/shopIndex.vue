<template>
  <div>
    <van-tabbar v-model="active" fixed class="index-tabbar">
      <van-tabbar-item icon="shop-o">特惠商城</van-tabbar-item>
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
  import {isNotEmptyObject} from "../../utils/globalFunc";

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
        order: {
          id: 'shop.order',
          url: './shop.order.html',
        },
      }
    },
    mounted() {
      let _t = this;
      // 扩展API加载完毕，现在可以正常调用扩展API
      // 获取支付通道
      plus.payment.getChannels(function (channels) {
        for (let i in channels) {
          let channel = channels[i];
          if (channel.id === 'wxpay') {
            _t.iap = channel;
          }
        }
      }, function (e) {
        console.log("获取支付通道失败：" + e.message);
      });
    },
    created() {
      this.append(this.goodsShows)
    },
    methods: {
      append(obj) {
        let ws = plus.webview.getWebviewById(obj.id);
        if (isEmptyObject(ws)) {
          let embed = plus.webview.create(obj.url, obj.id, {
            height: '93%',
            backButtonAutoControl: 'none',
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
            this.append(this.order);
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
