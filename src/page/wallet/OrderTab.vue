<template>
  <van-tab :title="titleDesc">
    <van-cell-group v-if="orderList!==null">
      <van-cell
        v-for="(i,j) in orderList"
        v-if="i.status===orderState&&orderState===0"
        :key="j" :title="i.memo" :label="getDesc(i.status)">
        {{i.totalAmount}}
      </van-cell>

      <van-cell
        v-for="(i,j) in orderList"
        v-if="i.status===orderState&&orderState===100"
        :key="j" :title="i.memo" @click="gotoPay(i)">
        {{i.totalAmount}}
      </van-cell>

      <van-cell
        v-for="(i,j) in orderList"
        v-if="i.status===orderState&&(orderState===160||orderState===150||orderState===200)"
        :key="j" :title="i.memo" @click="check(i)">
        {{i.totalAmount}}
      </van-cell>

    </van-cell-group>
  </van-tab>
</template>
<script>
  import Vue from 'vue';
  import orderStateConf from "../../utils/constants/OrderState";
  import {openWebview} from "../../utils/webview";
  import {Dialog} from 'vant';

  Vue.use(Dialog);
  export default {
    name: 'order-tab',
    props: [
      'orderState', 'orderList'
    ],
    data() {
      return {
        titleDesc: orderStateConf.OrderStateDesc[this.orderState],
      }
    },
    created() {

    },
    methods: {
      gotoPay(obj) {
        Dialog.confirm({
          title: '',
          message: '该订单已失效，重新去购买？',
          confirmButtonText: '现在去'
        }).then(() => {
          openWebview({
            url: './wallet.buyTg.html',
            id: 'wallet.buyTg',
            title: '认购TG'
          })
        });
      },
      check(obj) {
        console.log(JSON.stringify(obj))
        openWebview({
          url: './wallet.transInfo.html',
          id: 'wallet.transInfo',
          title: '交易详情',
        }, {}, {
          tx: obj.transAddress
        })
      },
      getDesc(status) {
        if (this.orderState !== orderStateConf.ALL) {
          return "";
        }
        return orderStateConf.OrderStateDesc[status];
      },
    }
  }
</script>
