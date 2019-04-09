<template>
  <!--收银台-->
  <div class="body text-left">
    <div>
      <div class="box" style="color: #575757">
        <div>
          订单详情：认购{{buyNum}}TG
        </div>
        <div>
          预计金额<span style="font-size: 12px">（已包括燃料费，下单会实时计算汇率，可能跟预测的有偏差）</span>：
          <div v-if="radio=='20'">≈{{Number(amount+gasValueAmount).toFixed(2)}}￥</div>
          <div v-if="radio=='10'">≈{{Number(ethAmount+gasValue)}}Eth</div>
        </div>
      </div>
      <div class="box" style="color: #575757">
        请选择支付方式

        <div style="margin-top: 5%">
          <van-radio-group v-model="radio">
            <van-cell-group>

              <van-cell title="  " @click="radio = '10'">
                <van-radio name="10"></van-radio>
                <img
                  slot="icon"
                  src="../../../static/eth.jpg"
                >
              </van-cell>

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


  </div>
</template>
<script>
  import Vue from "vue";
  import {Toast, Cell, CellGroup, Radio, RadioGroup, Popup, Button} from "vant";
  import {request} from "../../utils/request";
  import MathUtil from "../../utils/MathUtil";
  import PayType from "../../utils/constants/PayType";
  import {openWebview} from "../../utils/webview";
  import OrderType from "../../utils/constants/OrderType";

  Vue.use(Cell).use(CellGroup).use(Toast).use(Radio).use(RadioGroup).use(Button).use(Popup);

  export default {
    data() {
      return {
        radio: '20',
        buyNum: null,
        walletAddress: null,
        amount: "0.00",
        channels: null,
        channel: null,
        iap: null,
        showConfirm: false,
        sendAmount: false,
        walletName: false,
        walletPassword: false,
        gasPrice: null,
        gasLimit: null,
        orderId: null,
        receiveAddress: null,
        dollarAmount: null,
        ethAmount: null,
        gasValue: null,
        gasValueAmount: null,
      }
    },
    mounted() {
      let ws = plus.webview.currentWebview();
      this.buyNum = Number(ws.buyNum);
      this.walletAddress = ws.walletAddress;
      if (ws.dollarAmount != null) {
        this.amount = Number(ws.dollarAmount);
      }
      if (ws.ethAmount != null) {
        this.ethAmount = Number(ws.ethAmount);
      }
      if (ws.gasValue != null) {
        this.gasValue = Number(ws.gasValue);
      }
      if (ws.gasValueAmount != null) {
        this.gasValueAmount = Number(ws.gasValueAmount);
      }

      let _t = this;
      // 扩展API加载完毕，现在可以正常调用扩展API
      // 获取支付通道
      plus.payment.getChannels(function (channels) {
        for (let i in channels) {
          let channel = channels[i];
          if (channel.id === 'wxpay') {
            _t.iap = channel;
          }
        }
      }, function (e) {
        console.log("获取支付通道失败：" + e.message);
      });

    },
    methods:
      {
        // 请求支付操作
        requestPay() {
          let params = {
            buyNum: this.buyNum,
            gasValue: this.gasValue,
            walletAddress: this.walletAddress,
            payType: this.radio,
          };
          let _t = this;

          if (this.radio === PayType.wxpay) {
            request("/buyTg/api/createOrder", params).then(res => {

              plus.payment.request(_t.iap, res, function (result) {
                plus.nativeUI.confirm("请问是否支付成功，请勿重复支付", function (e) {
                }, '提示', ['已支付成功', '未成功']);
              }, function (e) {
                plus.nativeUI.confirm("错误信息：" + JSON.stringify(e), function (e) {
                }, '重新请求支付', ['确定', '取消']);
              });

            });
          }

          if (this.radio === PayType.eth_tg) {
            request("/buyTg/api/createOrder", params).then(res => {
              let result = JSON.parse(res)
              console.log(result.totalAmount)

              openWebview({
                  title: "认购TG",
                  url: "./wallet.send.html",
                  id: "wallet.send",
                }, {}, {
                  receiveAddress: _t.walletAddress,
                  orderId: result.orderId,
                  sendAmount: result.totalAmount,
                  orderType: OrderType.virtualShopTg,
                }
              );
            });
          }
        }
      }
  }
</script>
