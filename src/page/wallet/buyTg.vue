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
            <van-field placeholder="请输入要购入的数量"
                       v-model="buyNum"
                       type="number" label="购买数"
                       @keyup="checkGive"
                       @input="calculate()"></van-field>
          </van-cell>
          <van-cell>
            <van-field v-model="dollarAmount" label="预计金额(￥)" :readonly="true" disable></van-field>
            <van-field v-model="ethAmount"
                       label="预计金额(Eth)"
                       :readonly="true"
                       @click="reflashRate"
                       disable>
            </van-field>
            <van-field v-model="giveAmount" label="活动赠送(Eth)"
                       v-show="giveAmountShow"
                       :readonly="true"
                       :disabled="true"
                       disable></van-field>
          </van-cell>
          <van-cell title="转入地址(点击可更换)" :label="walletAddress" icon="cash-back-record" @click="selectWallet">
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
    <van-action-sheet
      cancel-text="取消"
      v-model="showWalletList"
      :actions="walletListActions"
      @select="onSelect"
      @cancel="onCancel"
    ></van-action-sheet>
    <van-popup v-model="walletQcode" class="box" style="width: 150px">
      <qrcode-vue :value="tokenAddress" :size="150" style="margin-top: 3%" level="H"></qrcode-vue>
    </van-popup>

    <van-popup v-model="activitiesShow">
      <img src="../../../static/activities/huodong736.png" width="266">
    </van-popup>

  </div>
</template>
<script>
  import Vue from 'vue';
  import {ActionSheet, Button, Cell, CellGroup, Field, NoticeBar, Popup, Slider, Toast, Dialog} from 'vant';
  import TGCConfig from "../../utils/constants/tgcConfig";
  import QrcodeVue from 'qrcode.vue'
  import {openWebview} from "../../utils/webview";
  import tgcApiUrl from "../../utils/constants/TGCApiUrl";
  import {request} from "../../utils/request";
  import {isEmpty} from "../../utils/globalFunc";
  import MathUtil from "../../utils/MathUtil";
  import RateUtil from "../../utils/web3Util/RateUtil";

  Vue.use(Field).use(Popup).use(Button).use(CellGroup).use(Cell).use(NoticeBar).use(Toast).use(ActionSheet).use(Slider)
    .use(Dialog);

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
        activitiesShow: false,
        giveAmountShow: false,
        giveAmount: null,
      };
    },
    created() {
      this.reflashRate();
      let _t = this;
      setTimeout(() => {
        _t.activitiesShow = true;
      }, 300)
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
        Toast.loading('查询中...');
        request(tgcApiUrl.buyTgDollarRate).then(res => {
          _t.dollarRate = Number(res);
        });
        // etherscanHttpUtils.get({module: "stats", action: 'ethprice'}).then(res => {
        //   _t.ethRate = res.ethusd;
        // });
        RateUtil.ethToUSD(1).then(res=>{
          _t.ethRate = res;
        })
      },
      calculate() {
        this.dollarAmount = MathUtil.accMul(this.buyNum, this.dollarRate);
        if (isEmpty(this.ethRate)) {
          this.ethAmount = '查询异常，点击刷新重试'
        } else {
          this.ethAmount = MathUtil.accMul(this.buyNum, 1 / this.ethRate).toFixed(6);
        }
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
        openWebview({
          url: './wallet.buyTgOrder.html',
          id: 'wallet.buyTgOrder',
          title: 'Tg购买记录',
        }, {}, {isnew: true})
      },
      checkGive() {
        if (Number(this.buyNum) >= 28) {
          this.giveAmount = Number(100 / this.ethRate).toFixed(2);
          this.giveAmountShow = true;
        } else {
          this.giveAmountShow = false;
        }
      },
      gotoBuy() {
        request(tgcApiUrl.buyTgBeforeCheck, {buyNum: this.buyNum}).then(res => {
          if (res === 101) {
            Dialog.confirm({
              message: "需要进行身份验证才可以认购，现在去认证？"
            }).then(() => {
              openWebview({
                url: './verify.idcard.html',
                id: 'verify.idcard',
                title: '认证中心',
              })
            });
            return false;
          }
          else if (res === 102) {
            Dialog.confirm({
              message: "尊敬的客户，您认购的数量较大，需进行人工审核，现在提交审核吗？",
              confirmButtonText: '去提交'
            }).then(() => {
              openWebview({
                url: './verify.buyTgAudit.html',
                id: 'verify.buyTgAudit',
                title: '认购审核',
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
          return (Number(this.rangeValue) / 10000).toFixed(7);
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
