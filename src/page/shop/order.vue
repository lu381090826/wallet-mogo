<template>
  <div>
    <van-tabs v-model="active">
      <van-tab title="全部">
        <van-cell-group v-if="orderList!==null">
          <van-cell
            v-for="(i,j) in orderList"
            :key="j">
            <van-card v-for="(item,k) in i.orderDetailList"
                      :key="k"
                      :num="item.buyNum"
                      :price="item.totalAmount"
                      :title="item.skuName"
                      :desc="getDesc(i.status)"
            >
              <div slot="thumb" @click="gotoOrderDetail(i.orderId)">
                <img :src="item.img">
              </div>
              <div slot="footer">
                <div v-if="i.status === 100">
                  <van-button size="mini" @click="gotoPay(i.orderId,i.payType)">去转出</van-button>
                  <van-button size="mini" @click="gotoCancel(i.orderId)">取消订单</van-button>
                </div>
                <div v-else>
                  <van-button size="mini" @click="refund(i.orderId)">申请售后</van-button>
                </div>
              </div>
            </van-card>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="待转出">
        <van-cell-group v-if="orderList!==null">
          <van-cell
            v-for="(i,j) in orderList"
            :key="j" v-if="i.status===100">
            <van-card v-for="(item,k) in i.orderDetailList"
                      :key="k"
                      :desc="getDesc(i.status)"
                      :num="item.buyNum"
                      :price="item.totalAmount"
                      :title="item.skuName"
            >
              <div slot="thumb" @click="gotoOrderDetail(i.orderId)">
                <img :src="item.img">
              </div>
              <div slot="footer">
                <van-button size="mini" @click="gotoPay(i.orderId,i.payType)">去转出</van-button>
                <van-button size="mini" @click="gotoCancel(i.orderId)">取消订单</van-button>
              </div>
            </van-card>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="待发货">
        <van-cell-group v-if="orderList!==null">
          <van-cell
            v-for="(i,j) in orderList"
            :key="j" v-if="i.status===150">
            <van-card v-for="(item,k) in i.orderDetailList"
                      :key="k"
                      :num="item.buyNum"
                      :price="item.totalAmount"
                      :title="item.skuName"
                      :desc="getDesc(i.status)"
            >
              <div slot="thumb" @click="gotoOrderDetail(i.orderId)">
                <img :src="item.img">
              </div>
              <div slot="footer">
                <van-button size="mini" @click="refund(i.orderId)">申请售后</van-button>
              </div>
            </van-card>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="待收货">
        <van-cell-group v-if="orderList!==null">
          <van-cell
            v-for="(i,j) in orderList"
            :key="j" v-if="i.status===160">
            <van-card v-for="(item,k) in i.orderDetailList"
                      :key="k"
                      :desc="getDesc(i.status)"
                      :num="item.buyNum"
                      :price="item.totalAmount"
                      :title="item.skuName"
            >
              <div slot="thumb" @click="gotoOrderDetail(i.orderId)">
                <img :src="item.img">
              </div>
              <div slot="footer">
                <van-button size="mini" @click="refund(i.orderId)">申请售后</van-button>
              </div>
            </van-card>
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
  import TGCConfig from "../../utils/constants/tgcConfig";
  import PayType from "../../utils/constants/PayType";

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
        request(TGCApiUrl.shopOrderGetOrderList, {pageSize: 30, orderType: OrderType.shop}).then(res => {
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
        switch (Number(status)) {
          case 100:
            desc = "待转出";
            break;
          case 150:
            desc = "待转入";
            break;
          case 160:
            desc = "待转入";
            break;
          default :
            break;
        }
        return desc;
      },
      refund(orderId) {
        Dialog.alert({
          title: '提示',
          message: '暂不支持，请邮箱至  lujiaguan@thanksgiving.cn  进行人工咨询。'
        });
      },
      gotoCancel(orderId) {
        let _this = this;
        Dialog.confirm({
          title: '取消订单',
          message: '确定要取消吗？'
        }).then(() => {
          Toast.loading("正在取消订单，请稍等...");
          setTimeout(() => {
            request(TGCApiUrl.shopOrderCancel, {orderId: orderId}).then(res => {
              Toast.success("取消成功");
              _this.init();
            });
          }, 100);
        })
      },
      gotoPay(orderId, payType) {

        if (payType.toString() === PayType.eth_tg) {
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
        } else if (payType.toString() === PayType.wxpay) {
          openWebview({
            url: './wallet.sendLegalCurrency.html',
            id: 'wallet.sendLegalCurrency',
            title: '收银台',
            needLoaded: true,
          }, {}, {
            orderId: orderId,
            orderType: OrderType.shop,
          })
        }
      },
    },
    data() {
      return {
        active: 0,
        orderList: null,
      }
    }
  }
</script>
