<template>
  <div>
    <div class="box" style="margin-top: 10%;width: 90%">

      <van-cell-group>
        <van-field v-model="drawAddress" label="转入地址" readonly @click="changeWallet"/>
        <van-field v-model="balanceProfit" label="提取数量" type="number"/>
      </van-cell-group>

      <!--<div class="checkout-tip">&nbsp;每个月有一次免费提取机会</div>-->
      <van-button class="checkout-tip" type="default" size="large" color="orange"
                  v-intervalclick="{func:drawHanlde}"
      >立即提取
      </van-button>
      <!--<van-button type="default" size="large" style="margin-top: 8%;border-color: orange">提取记录</van-button>-->
    </div>

    <van-popup v-model="showWalletList" position="bottom" style="height: 350px;" :round="true">
      <div style="padding: 3%;font-size: 15px;background-color: lightgrey;color: gray">请选择需要转入的地址</div>
      <van-cell-group>
        <van-cell v-for="(item,k) in walletList"
                  :key="k" isLink>
          <img :src="getTokenImg(item.walletAddress)" width="45px" height="45px" slot="icon">
          <div slot="title" class="wallet-list">{{item.walletName}}</div>
          <div slot="label" class="wallet-list-label">{{formatAddr(item.walletAddress)}}</div>
        </van-cell>
      </van-cell-group>
    </van-popup>

  </div>
</template>

<script>
  import Vue from 'vue';
  import {Button} from 'vant';
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {Popup} from 'vant';
  import {Field} from 'vant';
  import {Cell, CellGroup} from 'vant';
  import {getAddressImg} from "../../utils/web3Util/AddressImg";
  import {openWebview} from "../../utils/webview";

  Vue.use(Cell).use(CellGroup);
  Vue.use(Field);
  Vue.use(Popup);
  Vue.use(Button);

  export default {
    data() {
      return {
        drawAddress: plus.storage.getItem("walletAddress"),
        balanceProfit: '-',
        walletList: [],
        showWalletList: false,
      }
    },
    methods: {
      changeWallet() {
        this.showWalletList = true;

      },
      formatAddr(addr) {
        let s = addr.toString();
        return s.substring(0, 10) + "..." + s.substring(30, s.length)
      },
      getTokenImg(tokenAddress) {
        return getAddressImg(tokenAddress)
      },
      drawHanlde() {
        plus.nativeUI.showWaiting();
        request(TGCApiUrl.drawProfit, {walletAddress: this.drawAddress, profitValue: this.balanceProfit})
          .then(res => {
            openWebview({
              url: './wallet.transInfo.html',
              id: 'wallet.transInfo',
              title: '交易详情',
            }, {}, {
              tx: res
            }, () => {
              plus.nativeUI.closeWaiting();
            });

          })
      }
    },
    created() {
      let _this = this;

      let ws = plus.webview.currentWebview();
      this.balanceProfit = ws.balanceProfit;

      request(TGCApiUrl.walletList).then(res => {
        _this.walletList = res;
      });
    },
  }
</script>
<style scoped>
  .checkout-tip {
    margin-top: 10%;
    background-color: gainsboro;
    color: orangered;
  }

  .wallet-list {
    font-size: 16px;
    margin-left: 5%;
    color: #585858;
  }

  .wallet-list-label {
    margin-left: 5%;
  }
</style>
