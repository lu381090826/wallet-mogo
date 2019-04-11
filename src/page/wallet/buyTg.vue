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
            <van-cell title="实时价格" @click="reflashRate" is-link>1TG ≈ 1$ ≈ {{dollarRate}}￥</van-cell>
            <van-cell title="简介" label="感恩链（TG）公开透明的区块链公益平台"></van-cell>
            <van-cell title="合约地址（点击可查看二维码）" :label="tokenAddress" @click="showWalletQcode" clickable></van-cell>
          </van-cell-group>
        </div>
        <van-cell-group :border="false">
          <van-cell>
            <van-field placeholder="请输入要购入的数量" v-model="buyNum" type="number" label="购买数"
                       @input="calculate()"></van-field>
          </van-cell>
          <van-cell>
            <van-field v-model="dollarAmount" label="预计金额(￥)" :readonly="true" disable></van-field>
            <van-field v-model="ethAmount" label="预计金额(Eth)" :readonly="true" disable></van-field>
          </van-cell>
          <van-cell title="转入钱包(点击可更换)" :label="walletAddress" icon="cash-back-record" @click="selectWallet">
          </van-cell>
          <van-cell title="燃料费(ETH)" :readonly="true" disableClear :label="gasValue + ' ≈ ' +gasValueAmount + '￥'"
                    icon="question-o"
                    @click="gasQuestion">
          </van-cell>
          <van-slider v-model="rangeValue" :min="rangeMin" :max="rangeMax" :step="0.00001">
          </van-slider>

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
  import {Actionsheet, Button, Cell, CellGroup, Field, NoticeBar, Popup, Slider, Toast, Dialog} from 'vant';
  import TGCConfig from "../../utils/constants/tgcConfig";
  import QrcodeVue from 'qrcode.vue'
  import {openWebview, openWebviewFast} from "../../utils/webview";
  import tgcApiUrl from "../../utils/constants/TGCApiUrl";
  import {request} from "../../utils/request";
  import {isEmpty} from "../../utils/globalFunc";
  import MathUtil from "../../utils/MathUtil";
  import etherscanHttpUtils from "../../utils/web3Util/etherscanHttpUtils";

  Vue.use(Field).use(Popup).use(Button).use(CellGroup).use(Cell).use(NoticeBar).use(Toast).use(Actionsheet).use(Slider).use(Dialog);

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
        dollarRate: null,
        ethRate: null,
        dollarAmount: null,
        ethAmount: null,
        rangeMin: 3,
        rangeMax: 300,
        rangeValue: 3,
      };
    },
    created() {
      this.reflashRate();
    },
    methods: {
      gasQuestion() {
        Dialog.alert({
          title: '什么是燃料费？',
          message: '燃料费（Gas）是给矿工的佣金，并以 ETH 支付，无论是交易、执行智能合约并启动 DApps，还是支付数据存储费用，都需要用到燃料费。燃料费价格高低会影响交易的确认速度。',
          confirmButtonText: '好的'
        }).then(() => {
          // on close
        });
      },
      reflashRate() {
        let _t = this;
        Toast.loading({mask: true, message: '查询最新价格...'});
        let finishDollar = false;
        let finishEth = false;
        request(tgcApiUrl.getDollarRate).then(res => {
          _t.dollarRate = Number(res);
          finishDollar = true;
          if (finishDollar && finishEth) {
            Toast.clear();
          }
        });
        etherscanHttpUtils.get({module: "stats", action: 'ethprice'}).then(res => {
          _t.ethRate = res.ethusd;
          finishEth = true;
          if (finishDollar && finishEth) {
            Toast.clear();
          }
        })
      },
      calculate() {
        this.dollarAmount = MathUtil.accMul(this.buyNum, this.dollarRate);
        this.ethAmount = MathUtil.accMul(this.buyNum, 1 / this.ethRate).toFixed(6);
      },
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
        request(tgcApiUrl.verifyIsChecked).then(res => {
          console.log("::::::::::::::::" + res);
          if (res === 0) {
            Dialog.alert({
              message: "需要进行身份验证才可以认购，现在去认证？"
            })
              .then(() => {
                openWebview({
                  url: './verify.idcard.html',
                  id: 'verify.idcard',
                  title: '认证中心',
                })
              });
            return false;
          }

          if (!this.buyNum || this.buyNum === 0) {
            Toast.fail("请输入正确的金额");
            return false;
          }
          let _t = this;
          openWebview({
            url: './common.bank.html',
            id: 'common.bank',
            title: '收银台',
          }, {}, {
            buyNum: _t.buyNum,
            walletAddress: _t.walletAddress,
            dollarAmount: _t.dollarAmount,
            ethAmount: _t.ethAmount,
            gasValue: _t.gasValue,
            gasValueAmount: _t.gasValueAmount,
          })
        });
      }
    },
    computed: {
      gasValue: {
        get: function () {
          return (Number(this.rangeValue) / 10000).toFixed(7);
        },
        set: function () {
        }
      },
      gasValueAmount: {
        get: function () {
          let amount = this.gasValue * this.ethRate * this.dollarRate;
          return (Math.ceil(amount * 100) / 100);
        },
        set: function () {
        }
      },
    },
    components: {QrcodeVue}
  }
</script>

<style scoped></style>
