<template>
  <div>
    <div class="body">
      <div class="box text-left">
        <div class="box">
          <van-cell-group>
            <van-cell title="合约名称" value="TGCoin (TG)"/>
            <van-cell title="合约地址" :label="tokenAddress"/>
            <van-cell title="当前钱包" :label="walletAddress"/>
            <div style="text-align: center;padding-bottom: 8%">
              <div style="margin-top: 3%;font-weight: bold;">二维码</div>
              <qrcode-vue :value="tokenAddress" :size="150" style="margin-top: 3%" level="H"></qrcode-vue>
            </div>
          </van-cell-group>
        </div>
        <van-field placeholder="请输入要购入的数量" v-model="buyNum"></van-field>
        <van-button class="button-orange" style="margin-top: 10%;margin-bottom: 10%" type="default"
                    size="large" v-intervalclick="{func:gotoBuy}">
          立即购买
        </van-button>
      </div>
    </div>

  </div>
</template>
<script>
  import Vue from 'vue';
  import {Field, Button, CellGroup, Cell, NoticeBar, Toast} from 'vant';
  import TGCConfig from "../../utils/constants/tgcConfig";
  import QrcodeVue from 'qrcode.vue'
  import {openWebview, openWebviewFast} from "../../utils/webview";

  Vue.use(Field).use(Button).use(CellGroup).use(Cell).use(NoticeBar);

  export default {
    data() {
      return {
        tokenAddress: TGCConfig.tokenAddress,
        walletAddress: plus.storage.getItem('walletAddress'),
        buyNum: null,
      };
    },
    methods: {
      gotoBuy() {
        if (!this.buyNum || this.buyNum === 0) {
          Toast.fail("请输入正确的金额");
          return false;
        }
        let _t = this;
        openWebview({
          url: './common.bank.html',
          id: 'common.bank',
          title: '收银台',
        }, {}, {buyNum: _t.buyNum, walletAddress: _t.walletAddress})

      }
    },
    components: {QrcodeVue}
  }
</script>

<style scoped></style>
