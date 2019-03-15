<template>
  <div>
    <van-tabs v-model="active">
      <van-tab title="全部">
        <van-cell-group v-if="orderList!==null">
          <van-cell
            v-for="(i,j) in orderList"
            :key="j" :title="i.memo" :label="getDesc(i.status)">
            {{i.totalAmount}}
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="待付款">
        <van-cell-group v-if="orderList!==null">
          <van-cell
            v-for="(i,j) in orderList"
            :key="j" :title="i.memo" v-if="i.status===OrderState.ORDER_WATI_PAY" :label="getDesc(i.status)">
            {{i.totalAmount}}
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="待收货">
        <van-cell-group v-if="orderList!==null">
          <van-cell
            v-for="(i,j) in orderList"
            :key="j" :title="i.memo" v-if="i.status===OrderState.ORDER_WATI_RECEIVE" :label="getDesc(i.status)">
            {{i.totalAmount}}
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="已完成">
        <van-cell-group v-if="orderList!==null">
          <van-cell
            v-for="(i,j) in orderList"
            :key="j" :title="i.memo" v-if="i.status===OrderState.ORDER_FINISH" :label="getDesc(i.status)">
            {{i.totalAmount}}
          </van-cell>
        </van-cell-group>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {Tab, Tabs} from 'vant';
  import {Card} from 'vant';
  import {Button} from 'vant';
  import {Toast} from 'vant';
  import {Dialog} from 'vant';
  import {CellGroup, Cell} from 'vant';

  Vue.use(CellGroup).use(Cell);
  Vue.use(Button);
  Vue.use(Card);
  Vue.use(Dialog);
  Vue.use(Toast);
  Vue.use(Tab).use(Tabs);
  import {isNotEmptyObject} from "../../utils/globalFunc";
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {openWebview} from "../../utils/webview";
  import OrderType from "../../utils/constants/OrderType";
  import orderState from "../../utils/constants/OrderState";
  import TGCConfig from "../../utils/constants/tgcConfig";

  export default {
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
          this.orderList = res;
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
      getDesc(status) {
        let desc = "";
        console.log(Number(status))
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
        orderList: null,
        OrderState: orderState,
      }
    }
  }
</script>
