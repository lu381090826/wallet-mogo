<template>
  <div>
    <div class="car-list">
      <van-card
        v-for="(item,k) in itemList"
        :key="k"
        :price="item.receiveAmount"
        :desc="item.donationOne2OneTypeDesc"
        :title="item.name"
        :thumb="item.smallImg"
        currency="已筹（TG）"
        v-intervalclick="{func:toDonation}"
      >
        <div slot="footer">
          <van-button size="mini" class="juan-button">捐一笔</van-button>
        </div>
      </van-card>
    </div>
  </div>
</template>
<script>
  import Vue from "vue";
  import {Card, Button} from 'vant';
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {openWebview, openWebviewFast} from "../../utils/webview";

  Vue.use(Card).use(Button);

  export default {
    data() {
      return {
        itemList: []
      }
    },
    created: function () {
      let _this = this;
      request(TGCApiUrl.donationOne2oneList).then(function (res) {
        _this.itemList = res.list;
      })
    },
    methods: {
      toDonation(donationId) {
        openWebview({
          url: './charitable.one2oneDonation.html',
          id: 'charitable.one2oneDonation',
          title: '一帮一捐助',
          titleStyle: {
            titleText: "一帮一捐助",
            titleColor: "#ffffff",
            backgroundColor: "#ffa500",
            splitLine: {color: "#ffa500"},
            autoBackButton: true,
            progress: {color: '#ff5c0a', height: "1%"},
          }
        }, {}, {
          donationId: donationId
        });
      }
    }
  }
</script>
<style scoped>
  .car-list {
    margin-top: 3%;
  }

  .juan-button {
    background-color: orangered;
    color: white;
  }
</style>
