<template>
  <div>
    <div class="car-list">
      <van-card
        v-for="(item,k) in itemList"
        :key="k"
        :price="item.amount"
        :title="item.goodsName"
        :thumb="item.img"
        :desc="item.desc"
        :origin-price="100"
        tag="热销中"
        currency="TG"
      >
        <div slot="tags">
            <div>{{item.author}}</div>
        </div>
        <div slot="footer">
          <van-button size="mini" class="button-orange">去购买</van-button>
        </div>
      </van-card>
    </div>
  </div>
</template>
<script>
  import Vue from "vue";
  import {Card, Button} from 'vant';
  import {request} from "@/utils/request";
  import TGCApiUrl from "@/utils/constants/TGCApiUrl";
  import {openWebview} from "@/utils/webview";

  Vue.use(Card).use(Button);

  export default {
    data() {
      return {
        itemList: [
          {
            goodsId: "1",
            goodsName: "区块链：技术驱动金融",
            img: "http://120.79.191.116/static/goods/p3.png",
            amount: "80",
            desc: "解密区块链，用技术重构金融世界。",
            author: "[美] 阿尔文德·纳拉亚南（Arvind Narayanan），约什·贝努 等 著，林华，王勇，帅初 等 译",
          },
          {
            goodsId: "1",
            goodsName: "区块链：技术驱动金融",
            img: "http://120.79.191.116/static/goods/p3.png",
            amount: "80",
            desc: "解密区块链，用技术重构金融世界。",
            author: "[美] 阿尔文德·纳拉亚南（Arvind Narayanan），约什·贝努 等 著，林华，王勇，帅初 等 译",
          },
          {
            goodsId: "1",
            goodsName: "区块链：技术驱动金融",
            img: "http://120.79.191.116/static/goods/p3.png",
            amount: "80",
            desc: "解密区块链，用技术重构金融世界。",
            author: "[美] 阿尔文德·纳拉亚南（Arvind Narayanan），约什·贝努 等 著，林华，王勇，帅初 等 译",
          },
        ]
      }
    },
    created: function () {

    },
  }
</script>
<style scoped>
  .car-list {
    margin-top: 3%;
  }
</style>
