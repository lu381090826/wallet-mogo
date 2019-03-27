<template>
  <div>
    <div class="body">
      <div class="text-left">
        <div class="box">
          <div style="margin-left: 35%;margin-bottom: 3%">
            <img src="../../../static/gongyilanwordlogo.png">
          </div>
          <van-cell-group>
            <van-cell title="合约名称">TGCoin (TG)</van-cell>
            <van-cell title="发布数量">68亿</van-cell>
            <van-cell title="流通总量">68亿</van-cell>
            <van-cell title="官网">www.thanksgiving.cn</van-cell>
            <van-cell title="实时价格">1TG ≈ 1$ ≈ 6.7260￥</van-cell>
            <van-cell title="简介" label="感恩链（TG）公开透明的区块链公益平台"></van-cell>
            <van-cell title="合约地址（点击可查看二维码）" :label="tokenAddress" @click="showWalletQcode" clickable></van-cell>
          </van-cell-group>
        </div>
        <van-cell-group :border="false">
          <van-cell>
            <van-field placeholder="请输入要购入的数量" v-model="buyNum" type="number" label="购买数"></van-field>
          </van-cell>
          <van-cell>
            <van-field v-model="buyNum*6.7260" type="number" label="预计金额(￥)" :readonly="true" disable></van-field>
            <van-field v-model="buyNum*0.00732" type="number" label="预计金额(Eth)" :readonly="true" disable></van-field>
          </van-cell>
          <van-cell title="转入钱包(点击可更换)" :label="walletAddress" icon="cash-back-record" @click="selectWallet">
          </van-cell>
        </van-cell-group>

        <van-button class="button-orange" style="margin-top: 10%;" type="default"
                    size="large" v-intervalclick="{func:gotoBuy}">
          立即购买
        </van-button>
        <van-button style="margin-top: 5%;margin-bottom: 10%" type="default"
                    size="large" v-intervalclick="{func:gotoBuyTgOrder}">
          购买记录
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
    <van-popup v-model="walletQcode" class="box" style="width: 150px">
      <qrcode-vue :value="tokenAddress" :size="150" style="margin-top: 3%" level="H"></qrcode-vue>
    </van-popup>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {Field, Button, CellGroup, Cell, NoticeBar, Toast, Actionsheet, Popup} from 'vant';
  import TGCConfig from "../../utils/constants/tgcConfig";
  import QrcodeVue from 'qrcode.vue'
  import {openWebview, openWebviewFast} from "../../utils/webview";
  import tgcApiUrl from "../../utils/constants/TGCApiUrl";
  import {request} from "../../utils/request";
  import {isEmpty} from "../../utils/globalFunc";

  Vue.use(Field).use(Popup).use(Button).use(CellGroup).use(Cell).use(NoticeBar).use(Toast).use(Actionsheet);

  export default {
    data() {
      return {
        tokenAddress: TGCConfig.tokenAddress,
        walletAddress: plus.storage.getItem('walletAddress'),
        walletName: plus.storage.getItem('walletName'),
        buyNum: null,
        walletListActions: [],
        walletList: null,
        showWalletList: null,
        walletQcode: false,
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
      showWalletQcode() {
        this.walletQcode = !this.walletQcode;
      },
      gotoBuyTgOrder() {
        openWebviewFast({
          url: './wallet.buyTgOrder.html',
          id: 'wallet.buyTgOrder',
          title: 'Tg购买记录',
        })

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
