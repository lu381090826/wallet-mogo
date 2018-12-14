<template>
  <div style="margin: 3%">
    <van-cell-group>
      <van-field label="金额" placeholder=""
                 v-model="sendAmount"
                 :error-message="sendAmountError"
                 @input="sendAmountError = ''"
                 :readonly="sendAmountReadOnly"
                 :disabled="sendAmountReadOnly"
                 type="number"
      >
        <van-icon slot="icon" name="more-o" @click="selectToken" v-show="showTokenSelect"/>
      </van-field>
      <van-field label="交易合约"
                 v-model="tokenAddress"
                 v-show="tokenAddress"
                 :readonly="tokenAddressReadOnly"
                 :disabled="tokenAddressReadOnly"
      >
        <van-icon slot="icon" name="close" @click="closeToken" v-show="!tokenAddressReadOnly"/>
      </van-field>
      <van-field label="合约名称"
                 v-model="tokenName"
                 v-show="tokenAddress"
                 :readonly="tokenAddressReadOnly"
                 :disabled="tokenAddressReadOnly"
      >
      </van-field>
      <van-field label="收款方"
                 v-model="receiveAddress"
                 placeholder="收款钱包地址"
                 :error-message="receiveAddressError"
                 @input="receiveAddressError = ''"
                 :clearable="true"
                 :readonly="receiveAddressReadOnly"
                 :disabled="receiveAddressReadOnly"
      >
        <van-icon slot="icon" name="contact" @click="contact"/>
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
      <van-field label="交易密码" v-model="walletPassword" type="password">
      </van-field>
      <van-button class="sendButton button-blue" type="primary" size="large" v-intervalclick="{func:send}">
        立即转账
      </van-button>
    </van-popup>

    <van-actionsheet
      cancel-text="取消"
      v-model="showWalletList"
      :actions="walletListActions"
      @select="onSelect"
      @cancel="onCancel"
    />
    <van-actionsheet
      cancel-text="取消"
      v-model="showTokenList"
      :actions="tokenListActions"
      @select="onSelect"
      @cancel="onCancel"
    />

    <van-button class="doNext button-blue" type="primary" size="large" v-intervalclick="{func:doNext}">
      确认转账
    </van-button>
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
  import OrderType from "../../utils/constants/OrderType";

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
        receiveAddressReadOnly: false,
        walletPassword: "",
        showWalletList: false,
        showTokenList: false,
        tokenName: "",
        tokenAddress: "",
        tokenAddressReadOnly: false,
        orderId: "",
        walletListActions: [],
        tokenListActions: [],
        walletOnSelect: "",
        orderType: "",
        showTokenSelect: true,
      }
    },
    beforeMount() {
      let t = this;
      let ws = plus.webview.currentWebview();

      if (isNotEmpty(ws.receiveAddress)) {
        this.receiveAddress = ws.receiveAddress;
        this.receiveAddressReadOnly = true;
      }

      if (isNotEmpty(ws.tokenAddress)) {
        this.tokenAddress = ws.tokenAddress;
        this.tokenAddressReadOnly = true;
      }

      if (isNotEmpty(ws.orderId)) {
        this.orderId = ws.orderId;
      }

      if (isNotEmpty(ws.sendAmount)) {
        this.sendAmount = ws.sendAmount;
        this.sendAmountReadOnly = true;
      }
      if (isNotEmpty(ws.orderType)) {
        this.orderType = ws.orderType
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
        if (isEmpty(item)) {
          return;
        }
        if (item.type === 'wallet') {
          this.showWalletList = false;
          _this.walletName = item.walletName;
          _this.walletAddress = item.walletAddress;
        } else {
          this.showTokenList = false;
          _this.tokenName = item.tokenName;
          _this.tokenAddress = item.tokenAddress;
        }
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
            request(tgcApiUrl.sendTransaction, params).then((res) => {
              if (!isEmpty(res)) {
                openWebview({
                  url: './wallet.transInfo.html',
                  id: 'wallet.transInfo',
                  title: '交易详情',
                }, {}, {
                  tx: res
                });

                //回传交易号
                setTimeout(() => {
                  request(tgcApiUrl.shopOrderUpdate, {orderId: params.orderId, transAddress: res});
                }, 10);
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
      closeToken() {
        this.tokenAddress = "";
        this.tokenName = "";
      },
      contact() {
      },
      selectToken() {
        let _this = this;
        if (_this.tokenListActions.length === 0) {
          Toast.loading();
          request(tgcApiUrl.walletTokenList).then(res => {
            if (isEmpty(res.length)) {
              Toast('出错了T_T');
              return false;
            }

            for (let i = 0; i < res.length; i++) {
              res[i].name = res[i].tokenName;
              res[i].subname = res[i].tokenAddress.substring(0, 10) + '...';
              res[i].type = 'token'
            }
            _this.tokenListActions = res;
            Toast.clear();
          });
        }
        this.showTokenList = !this.showTokenList;
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

        if (this.orderType === OrderType.shop) {
          request(tgcApiUrl.shopOrderGet, {orderId: this.orderId}).then(res => {
            this.sendAmount = res.totalAmount;
            this.receiveAddress = res.receiveAddress;
            this.receiveAddressReadOnly = true;
            this.showTokenSelect = false;
          })
        }

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
