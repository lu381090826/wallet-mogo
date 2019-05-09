<template>
  <div>
    <van-tabs v-model="active">
      <order-tab :order-state="OrderState.ALL" :order-list="orderList.ALL"/>
      <order-tab :order-state="OrderState.ORDER_WATI_PAY" :order-list="orderList.ORDER_WATI_PAY"/>
      <order-tab :order-state="OrderState.ORDER_WATI_RECEIVE" :order-list="orderList.ORDER_WATI_RECEIVE"/>
      <order-tab :order-state="OrderState.ORDER_FINISH" :order-list="orderList.ORDER_FINISH"/>
    </van-tabs>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {Button, Card, Cell, CellGroup, Dialog, Tab, Tabs, Toast} from 'vant';
  import {isNotEmptyObject} from "../../utils/globalFunc";
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {openWebview} from "../../utils/webview";
  import OrderType from "../../utils/constants/OrderType";
  import orderState from "../../utils/constants/OrderState";
  import TGCConfig from "../../utils/constants/tgcConfig";
  import OrderTab from "./OrderTab";

  Vue.use(CellGroup).use(Cell);
  Vue.use(Button);
  Vue.use(Card);
  Vue.use(Dialog);
  Vue.use(Toast);
  Vue.use(Tab).use(Tabs);

  export default {
    components: {OrderTab},
    created() {
      plus.key.addEventListener('backbutton', function () {
        let parent = plus.webview.currentWebview().parent();
        if (isNotEmptyObject(parent)) {
          parent.close();
        }
      });
      let t = this;
      plus.key.addEventListener('init', function () {
        t.init()
      });

      t.init();
    },
    methods: {
      init() {
        request(TGCApiUrl.shopOrderGetOrderList, {pageSize: 30, orderType: OrderType.virtualShopTg}).then(res => {
          this.orderList.ALL = res;
          for (let i = 0; i < res.length; i++) {
            let status = res[i].status;
            switch (Number(status)) {
              case orderState.ORDER_WATI_PAY:
                this.orderList.ORDER_WATI_PAY.push(res[i]);
                break;
              case orderState.ORDER_WATI_DELIVER:
                this.orderList.ORDER_WATI_DELIVER.push(res[i]);
                break;
              case orderState.ORDER_WATI_RECEIVE:
                this.orderList.ORDER_WATI_RECEIVE.push(res[i]);
                break;
              case orderState.ORDER_FINISH:
                this.orderList.ORDER_FINISH.push(res[i]);
                break;
              default :
                break;
            }
          }
          console.log(this.orderList.ALL)
        });
      },
      gotoOrderDetail(orderId) {
        openWebview({
          url: './shop.orderDetail.html',
          id: 'shop.orderDetail',
          title: '订单详情',
          needLoaded: true,
        }, {}, {orderId: orderId})
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
    },
    data() {
      return {
        active: 0,
        orderList: {
          ALL: [],
          ORDER_WATI_PAY: [],
          ORDER_CANCEL: [],
          ORDER_WATI_DELIVER: [],
          ORDER_WATI_RECEIVE: [],
          ORDER_FINISH: [],
        },
        OrderState: orderState,
      }
    }
  }
</script>
