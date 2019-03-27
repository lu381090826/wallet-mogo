<template>
  <!--收银台-->
  <div class="body text-left">
    <div>
      <div class="box" style="color: #575757">
        <div>
          订单详情：认购{{buyNum}}TG
        </div>
        <div>
          预计金额<span style="font-size: 12px">（下单会实时计算汇率，可能会有误差）</span>：
          <div>≈{{amount}}￥</div>
          <div>≈{{ethAmount}}Eth</div>
        </div>
        <div>
          <!--当前汇率：1TG=1$-->
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
        radio: '1',
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
      }
    },
    mounted() {
      let ws = plus.webview.currentWebview();
      this.buyNum = ws.buyNum;
      this.walletAddress = ws.walletAddress;
      this.amount = MathUtil.accMul(this.buyNum, "6.7260");
      this.ethAmount = MathUtil.accMul(this.buyNum, "0.00732");

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
