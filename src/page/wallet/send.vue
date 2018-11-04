<template>
  <div style="margin: 3%">
    <van-cell-group>
      <van-field label="金额" placeholder="" type='number'
                 v-model="sendAmount"
                 :error-message="sendAmountError"
                 @input="sendAmountError = ''"
                 :readonly="sendAmountReadOnly"
                 :disabled="sendAmountReadOnly"
      >
      </van-field>
      <van-field label="交易合约"
                 v-model="tokenAddress"
                 v-show="tokenAddress"
      >
      </van-field>
      <van-field label="合约名称"
                 v-model="tokenName"
                 v-show="tokenAddress"
      >
      </van-field>
      <van-field label="收款方"
                 v-model="receiveAddress"
                 placeholder="收款钱包地址"
                 :error-message="receiveAddressError"
                 @input="receiveAddressError = ''"
      >
        <img slot="icon" src="../../assets/tx1.png" width="24"/>
      </van-field>
      <van-field label="燃料费(ETH)" :readonly="true" disableClear v-model="gasValue">
        <van-icon name="question" slot="icon" @click="gasQuestion"/>
      </van-field>
      <van-slider v-model="rangeValue" :min="rangeMin" :max="rangeMax" :step="0.00001">
      </van-slider>
    </van-cell-group>

    <van-popup v-model="showConfirm" class="confirm">
      <van-field label="金额" v-model="sendAmount" :readonly="true" :disabled="true">
        <span style="color: dodgerblue;font-size: 16px">ETH</span>
      </van-field>
      <van-field label="钱包" v-model="walletName" is-link :readonly="true" @click="selectWallet">
      </van-field>
      <!--<van-field label="ETH余额" v-model="walletBalance" :readonly="true">-->
      <!--</van-field>-->
      <!--<van-field label="合约余额" v-model="tokenBalance" :readonly="true" v-show="tokenAddress">-->
      <!--</van-field>-->
      <van-field label="交易密码" v-model="walletPassword" type="password">
      </van-field>
      <van-button class="sendButton" type="primary" size="large" v-intervalclick="{func:send}">立即转账</van-button>
    </van-popup>

    <van-actionsheet
      cancel-text="取消"
      v-model="showWalletList"
      :actions="walletListActions"
      @select="onSelect"
      @cancel="onCancel"
    />

    <van-button class="doNext" type="primary" size="large" v-intervalclick="{func:doNext}">确认转账</van-button>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {
    Button,
    Field,
    Cell,
    CellGroup,
    Slider,
    Actionsheet,
    Popup,
    Dialog,
    Icon,
    Toast
  } from 'vant';
  import web3Util from "../../utils/web3Util/Web3Util";
  import tgcApiUrl from "../../utils/constants/TGCApiUrl";
  import {request} from "../../utils/request";
  import MathUtil from "../../utils/MathUtil";
  import {isEmpty, isNotEmpty} from "../../utils/globalFunc";
  import {openWebview, openWebviewFast} from "../../utils/webview";

  Vue.use(Dialog);
  Vue.use(Actionsheet);
  Vue.use(Popup);
  Vue.use(Button);
  Vue.use(Field);
  Vue.use(Slider);
  Vue.use(Cell).use(CellGroup).use(Icon);

  export default {
    data() {
      return {
        sendAmount: "",
        sendAmountReadOnly: false,
        receiveAddress: "",
        rangeMin: 3,
        rangeMax: 300,
        rangeValue: 3,
        popupVisible: false,
        selected: "",
        showConfirm: false,
        walletName: plus.storage.getItem('walletName'),
        walletAddress: plus.storage.getItem('walletAddress'),
        sendAmountError: "",
        receiveAddressError: "",
        walletPassword: "",
        showWalletList: false,
        // walletBalance: "",
        // tokenBalance: "",
        tokenName: "",
        tokenAddress: "",
        orderId: "",
        walletListActions: [],
        walletOnSelect: "",
      }
    },
    created() {
      let t = this;
      let ws = plus.webview.currentWebview();

      if (isNotEmpty(ws.receiveAddress)) {
        this.receiveAddress = ws.receiveAddress;
      }
      if (isNotEmpty(ws.tokenAddress)) {
        this.tokenAddress = ws.tokenAddress;
      }

      if (isNotEmpty(ws.orderId)) {
        this.orderId = ws.orderId;
      }

      if (isNotEmpty(ws.sendAmount)) {
        this.sendAmount = ws.sendAmount;
        this.sendAmountReadOnly = true;
      }

      this.initSend();
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
      onCancel() {
        this.showWalletList = false;
      },
      onSelect(item) {
        let _this = this;
        this.showWalletList = false;

        if (!item) {
          return;
        }
        _this.walletName = item.walletName;
        _this.walletAddress = item.walletAddress;
      },
      send() {
        let _this = this;

        let sendAmount = Number(this.sendAmount);

        if (isEmpty(this.receiveAddress)) {
          Toast('请输入收款地址');
          return;
        }
        if (isEmpty(this.walletPassword)) {
          Toast('请输入钱包密码');
          return;
        }
        if (isEmpty(sendAmount) || sendAmount === 0) {
          Toast('请输入金额');
          return;
        }

        Dialog.confirm({
          title: '提示',
          message: '确认转账吗？（提交后不可撤回）'
        }).then(() => {
          Toast.loading({
            duration: 0,       // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            loadingType: 'spinner',
            message: '处理中...'
          });

          setTimeout(() => {
            let password = _this.walletPassword;
            let params = {
              password: password,
              tokenAddress: _this.tokenAddress,
              walletAddress: _this.walletAddress,
              receiveAddress: _this.receiveAddress,
              sendAmount: sendAmount,
              gasLimit: MathUtil.accMul(_this.gasValue, 10000000000),
              gasPrice: _this.gasPrice,
              orderId: _this.orderId,
            };
            console.log(params);
            request(tgcApiUrl.sendTransaction, params).then((res) => {
              if (!isEmpty(res)) {
                openWebview({
                  url: './wallet.transInfo.html',
                  id: 'wallet.transInfo',
                  title: '交易详情',
                }, {}, {
                  tx: res
                });
              }
              setTimeout(() => {
                Toast.clear();
              }, 2000);
            });
          }, 1000);

        }).catch(() => {
          // on cancel
        });

      },
      selectWallet() {
        this.showWalletList = !this.showWalletList;
      },
      doNext() {
        if (Number(this.sendAmount) === Number(0)) {
          this.sendAmountError = "请输入正确的金额";
          return false;
        }
        if (this.receiveAddress === "") {
          this.receiveAddressError = "请输入正确的收款地址";
          return false;
        }
        this.showConfirm = !this.showConfirm;
      },
      initSend() {
        let _this = this;

        web3Util.getGasPrice().then(res => {
          _this.gasPrice = res;
        });

        if (isNotEmpty(_this.tokenAddress)) {
          web3Util.getContractName(_this.tokenAddress).then(res => {
            _this.tokenName = res;
          });
        }

        request(tgcApiUrl.walletList).then(res => {
          if (res.length === undefined) {
            Toast('出错了T_T');
            return false;
          }

          for (let i = 0; i < res.length; i++) {
            res[i].name = res[i].walletName;
            res[i].subname = res[i].walletAddress.substring(0, 10) + '...';
          }
          _this.walletListActions = res;
        });


      },
    },
    computed: {
      gasValue: {
        get: function () {
          return (Number(this.rangeValue) / 100000).toFixed(7);
        },
        set: function () {
        }
      },
    },
    components: {
      Field
    }
  }
</script>
<style scoped>
  .body {
    width: 100%;
  }

  .header {
    background-color: white;
    color: black;
    box-shadow: #d4d4d4 0 0 1px 1px;
  }

  .header >>> .mint-header-title {
    font-weight: bold;
    line-height: 2;
    overflow: auto;
  }

  .doNext {
    margin-top: 40%;
    background-color: orange;
    border-color: #e59400;
  }

  .sendButton {
    margin-top: 10%;
    background-color: orange;
    border-color: #e59400;
  }

  .confirm {
    width: 80%;
    padding: 3%;
    height: 220px;
    margin-bottom: 0;
  }
</style>
