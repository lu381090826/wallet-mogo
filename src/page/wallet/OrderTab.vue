<template>
  <van-tab :title="orderStateDesc">
    <van-cell-group v-if="orderList!==null">
      <van-cell
        v-for="(i,j) in orderList"
        :key="j" :title="i.memo" v-if="i.status===orderState||orderState===0" :label="getDesc()">
        {{i.totalAmount}}
      </van-cell>
    </van-cell-group>
  </van-tab>
</template>
<script>
  import orderStateConf from "../../utils/constants/OrderState";

  export default {
    name: 'order-tab',
    props: [
      'orderState', 'orderList'
    ],
    data() {
      return {
        orderStateDesc: orderStateConf.OrderStateDesc[this.orderState],
      }
    },
    created() {
      console.log(this.orderList[0])
    },
    methods: {
      getDesc() {
        let status = this.orderState;
        let desc = "";
        switch (Number(status)) {
          case orderStateConf.ORDER_WATI_PAY:
            desc = "待付款";
            break;
          case orderStateConf.ORDER_WATI_DELIVER:
            desc = "待发货";
            break;
          case orderStateConf.ORDER_WATI_RECEIVE:
            desc = "待收货";
            break;
          default :
            break;
        }
        return desc;
      },
    }
  }
</script>
