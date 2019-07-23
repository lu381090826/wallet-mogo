<template>
  <div>
    <van-cell-group>
      <van-cell v-for="(item,k) in order.orderDetailList"
                :key="k"
                :title="item.skuName"
      >
        <img :src="item.img" width="100px">
      </van-cell>
      <van-cell title="金额" :value="order.totalAmount+order.units"></van-cell>
      <van-cell title="支付状态" :value="getDesc(order.status)"></van-cell>
      <van-cell title="收件人" :value="order.shopDeliver.receiveName"></van-cell>
      <van-cell title="联系方式"
                :value="order.shopDeliver.receivePhone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')"></van-cell>
      <van-cell title="收件地址" :value="order.shopDeliver.receiveAddress"></van-cell>
    </van-cell-group>

    <van-goods-action>
      <van-goods-action-big-btn v-if="order.status===150||order.status===160"
                                primary
                                text="申请退款"
                                @click="refund(orderId)"
      />
      <van-goods-action-big-btn v-if="order.status===100"
                                primary
                                text="去支付"
                                @click="gotoPay(orderId)"
      />
      <van-goods-action-big-btn v-if="order.status===100"
                                primary
                                text="取消订单"
                                @click="gotoPay(orderId)"
      />
    </van-goods-action>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {
    Cell,
    CellGroup,
    Dialog,
  } from "vant";
  import {
    GoodsAction,
    GoodsActionBigBtn,
  } from 'vant';

  Vue
    .use(Dialog)
    .use(GoodsAction)
    .use(GoodsActionBigBtn);
  import {request} from "@/utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {openWebview} from "../../utils/webview";
  import OrderType from "../../utils/constants/OrderType";
  import TGCConfig from "../../utils/constants/tgcConfig";

  export default {
    components: {
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
    },
    data() {
      return {
        order: {},
        orderId: "",
      };
    },
    created() {
      let wb = plus.webview.currentWebview();
      this.orderId = wb.orderId;

      request(TGCApiUrl.shopOrderInfo, {orderId: this.orderId}).then(res => {
        this.order = res;
      });

    },
    methods: {
      getDesc(status) {
        let desc = "";
        switch (Number(status)) {
          case 100:
            desc = "待付款";
            break;
          case 150:
            desc = "待发货";
            break;
          case 160:
            desc = "待收货";
            break;
          default :
            break;
        }
        return desc;
      },
      getAction(status) {
        let desc = "";
        switch (Number(status)) {
          case 100:
            desc = "取消订单";
            break;
          case 150:
          case 160:
            desc = "申请退款";
            break;
          default :
            break;
        }
        return desc;
      },
      refund(orderId) {
        Dialog.confirm({
          title: '申请退款',
          message: '确定要退款吗？'
        }).then(() => {
          Dialog.alert({
            title: '提示',
            message: '暂不支持线上退款，请邮箱至381090826@qq.com进行人工退款。'
          });
        });
      },
      gotoCancel(orderId) {
        Dialog.confirm({
          title: '取消订单',
          message: '确定要取消吗？'
        }).then(() => {
          request(TGCApiUrl.shopOrderCancel, {orderId: orderId});
        })
      },
      gotoPay(orderId) {
        openWebview({
          url: './wallet.send.html',
          id: 'wallet.send',
          title: '收银台',
          needLoaded: true,
        }, {}, {
          orderId: orderId,
          orderType: OrderType.shop,
          tokenAddress: TGCConfig.tokenAddress,
        })
      },
    }
  };
</script>

<style lang="less"></style>
