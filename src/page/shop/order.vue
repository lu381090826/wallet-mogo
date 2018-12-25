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
                      :thumb="item.img"
            >
              <div slot="footer">
                <van-button size="mini" @click="gotoPay(i.orderId)">去付款</van-button>
                <van-button size="mini">取消订单</van-button>
              </div>
            </van-card>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="待付款">
        <van-cell-group v-if="orderList!==null">
          <van-cell
            v-for="(i,j) in orderList"
            :key="j">
            <van-card v-if="i.status===100" v-for="(item,k) in i.orderDetailList"
                      :key="k"
                      :num="item.buyNum"
                      :price="item.totalAmount"
                      :title="item.skuName"
                      :thumb="item.img"
            >
              <div slot="footer">
                <van-button size="mini" @click="gotoPay(i.orderId)">去付款</van-button>
                <van-button size="mini">取消订单</van-button>
              </div>
            </van-card>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="待发货">
        <van-cell-group v-if="orderList!==null">
          <van-cell
            v-for="(i,j) in orderList"
            :key="j">
            <van-card v-if="i.status===150" v-for="(item,k) in i.orderDetailList"
                      :key="k"
                      :num="item.buyNum"
                      :price="item.totalAmount"
                      :title="item.skuName"
                      :thumb="item.img"
            >
              <div slot="footer">
                <van-button size="mini">申请退款</van-button>
              </div>
            </van-card>
          </van-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="待收货">
        <van-cell-group v-if="orderList!==null">
          <van-cell
            v-for="(i,j) in orderList"
            :key="j">
            <van-card v-if="i.status===160" v-for="(item,k) in i.orderDetailList"
                      :key="k"
                      :num="item.buyNum"
                      :price="item.totalAmount"
                      :title="item.skuName"
                      :thumb="item.img"
            >
              <div slot="footer">
                <van-button size="mini">申请退款</van-button>
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
  import {CellGroup, Cell} from 'vant';

  Vue.use(CellGroup).use(Cell);
  Vue.use(Button);
  Vue.use(Card);
  Vue.use(Tab).use(Tabs);
  import {isNotEmptyObject} from "../../utils/globalFunc";
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {openWebview} from "../../utils/webview";
  import OrderType from "../../utils/constants/OrderType";
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
        request(TGCApiUrl.shopOrderGetOrderList, {pageSize: 30}).then(res => {
          this.orderList = res;
        });
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
      }
    }
  }
</script>
