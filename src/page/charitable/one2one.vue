<template xmlns:width="http://www.w3.org/1999/xhtml">
  <div>
    <div class="car-list">
      <van-cell
        v-for="(item,k) in itemList"
        :key="k"
        v-intervalclick="{func:toDonation,donationId:item.donationId}"
      >
        <div slot>
          已筹{{item.receiveAmount}} TG
        </div>
        <div slot="icon">
          <img :src="item.smallImg" width="100px">
        </div>
        <div slot="title" style="margin-left: 15%">
          {{item.name}}
        </div>
        <div slot="label" style="margin-left: 15%">
          {{item.donationOne2OneTypeDesc}}
        </div>

        <!--<div slot="footer">-->
        <!--<van-button size="mini" class="button-orange">捐一笔</van-button>-->
        <!--</div>-->
      </van-cell>
    </div>
  </div>
</template>
<script>
  import Vue from "vue";
  import {Cell, Button} from 'vant';
  import {request} from "@/utils/request";
  import TGCApiUrl from "@/utils/constants/TGCApiUrl";
  import {openWebview} from "@/utils/webview";

  Vue.use(Cell).use(Button);

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
          needLoaded: true,
          titleStyle: {
            type: "transparent",
            titleText: "一帮一捐助",
            titleColor: "#ffffff",
            backgroundColor: "#ffa500",
            splitLine: {color: "#ffa500"},
            autoBackButton: true,
          }
        }, {statusbar: {background: '#ffa500'}}, {
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
</style>
