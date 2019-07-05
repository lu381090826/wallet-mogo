<template>
  <div style="padding: 3%;width: 90%" class="box">
    <div v-if="orderDetailList.length>0">商品名称：{{orderDetailList[0].skuName}}￥</div>
    <div>支付金额：{{totalAmount}}￥</div>
    <div style="color: #575757;margin-top: 10%">
      请选择支付方式
      <div style="margin-top: 5%">
        <van-radio-group v-model="radio">
          <van-cell-group>
            <van-cell title=" " @click="radio = '20'">
              <van-radio name="20"></van-radio>
              <img
                slot="icon"
                src="../../../static/wxpay.png"
              >
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>

      <div style="margin-top: 30%;margin-bottom: 5%;">
        <van-button class="sendButton button-blue" type="primary" size="large"
                    v-intervalclick="{func:requestPay}">
          立即支付
        </van-button>
      </div>

    </div>
  </div>
</template>
<script>
  import Vue from 'vue'

  import {request} from "../../utils/request";
  import TgcApiUrl from "../../utils/constants/TGCApiUrl";
  import {isNotEmpty} from "../../utils/globalFunc";
  import OrderType from "../../utils/constants/OrderType";
  import {Button, RadioGroup, Radio, CellGroup, Cell} from 'vant';
  import PayType from "../../utils/constants/PayType";

  Vue.use(Button)
    .use(RadioGroup)
    .use(CellGroup)
    .use(Cell)
    .use(Radio);

  export default {
    data() {
      return {
        orderId: null,
        orderType: null,
        totalAmount: null,
        radio: PayType.wxpay,
        orderDetailList: [],
        iap: null,
      }
    },
    created() {
      let t = this;
      let ws = plus.webview.currentWebview();

      if (isNotEmpty(ws.orderId)) {
        this.orderId = ws.orderId;
      }
      if (isNotEmpty(ws.orderType)) {
        this.orderType = ws.orderType
      }

      if (this.orderType === OrderType.shop || this.orderType === OrderType.virtualShopTg) {
        request(TgcApiUrl.shopOrderGet, {orderId: this.orderId}).then(res => {
          this.totalAmount = res.totalAmount;
          this.orderDetailList = res.orderDetailList;
        })
      }
    },
    methods: {
      requestPay() {
        // 请求支付操作
        let params = {
          totalAmount: this.totalAmount,
          memo: this.orderDetailList[0].skuName,
          orderId: this.orderId,
        };

        let _t = this;

        if (this.radio === PayType.wxpay) {
          request("/shop/order/createWxpay", params).then(res => {

            plus.payment.request(_t.iap, res, function (result) {
              plus.nativeUI.confirm("请问是否支付成功，请勿重复支付", function (e) {
              }, '提示', ['已支付成功', '未成功']);
            }, function (e) {
              plus.nativeUI.confirm("错误信息：" + JSON.stringify(e), function (e) {
              }, '重新请求支付', ['确定', '取消']);
            });

          });
        }
      }
    },
    computed: {},
  }
</script>
<style scoped>

  .doNext {
    margin-top: 40%;
  }

  .sendButton {
    margin-top: 10%;
  }

  .confirm {
    width: 80%;
    padding: 3%;
    height: 220px;
    margin-bottom: 0;
  }
</style>
