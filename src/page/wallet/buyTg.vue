<template>
  <div>
    <div class="body">
      <div class="box text-left">
        <div class="box">
          <van-cell-group>
            <van-cell title="合约名称" value="TGCoin (TG)"/>
            <van-cell title="合约地址" :label="tokenAddress"/>
            <van-cell title="转入钱包" :label="walletAddress" icon="cash-back-record" @click="selectWallet">
            </van-cell>
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
    <van-actionsheet
      cancel-text="取消"
      v-model="showWalletList"
      :actions="walletListActions"
      @select="onSelect"
      @cancel="onCancel"
    />
  </div>
</template>
<script>
  import Vue from 'vue';
  import {Field, Button, CellGroup, Cell, NoticeBar, Toast, Actionsheet} from 'vant';
  import TGCConfig from "../../utils/constants/tgcConfig";
  import QrcodeVue from 'qrcode.vue'
  import {openWebview, openWebviewFast} from "../../utils/webview";
  import tgcApiUrl from "../../utils/constants/TGCApiUrl";
  import {request} from "../../utils/request";
  import {isEmpty} from "../../utils/globalFunc";

  Vue.use(Field).use(Button).use(CellGroup).use(Cell).use(NoticeBar).use(Toast).use(Actionsheet);

  export default {
    data() {
      return {
        tokenAddress: TGCConfig.tokenAddress,
        walletAddress: plus.storage.getItem('walletAddress'),
        buyNum: null,
        walletListActions: [],
        walletList: null,
        showWalletList: null,
      };
    },
    methods: {
      selectWallet() {
        let _this = this;
        if (_this.walletListActions.length === 0) {
          Toast.loading();
          request(tgcApiUrl.walletList).then(res => {
            if (isEmpty(res.length)) {
              Toast('出错了T_T');
              return false;
            }

            for (let i = 0; i < res.length; i++) {
              res[i].name = res[i].walletName;
              res[i].subname = res[i].walletAddress.substring(0, 10) + '...';
              res[i].type = 'wallet'
            }
            _this.walletListActions = res;
            Toast.clear();
          });
        }
        this.showWalletList = !this.showWalletList;
      },
      onSelect(item) {
        let _this = this;
        if (isEmpty(item)) {
          return;
        }
        this.showWalletList = false;
        _this.walletName = item.walletName;
        _this.walletAddress = item.walletAddress;

      },
      onCancel() {
        this.showWalletList = false;
      },
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
