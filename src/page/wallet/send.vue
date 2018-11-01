<template>
  <div style="margin: 3%">
    <van-cell-group>
      <van-field label="金额" placeholder="" type='number'
                 v-model="sendAmount"
                 :error-message="sendAmountError"
                 @input="sendAmountError = ''">
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
      <van-field label="矿工费用" :readonly="true" disableClear v-model="gasValue"></van-field>
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
    Toast
  } from 'vant';
  import web3Util from "../../utils/web3Util/Web3Util";
  import tgcApiUrl from "../../utils/constants/TGCApiUrl";
  import {request} from "../../utils/request";
  import MathUtil from "../../utils/MathUtil";
  import {isEmpty} from "../../utils/globalFunc";
  import etherscanHttpUtils from "../../utils/web3Util/etherscanHttpUtils";

  Vue.use(Dialog);
  Vue.use(Actionsheet);
  Vue.use(Popup);
  Vue.use(Button);
  Vue.use(Field);
  Vue.use(Slider);
  Vue.use(Cell).use(CellGroup);

  export default {
    data() {
      return {
        sendAmount: "0.0001",
        receiveAddress: "0x66c5DFfb2Ab7F3149D8Fd1d78f3f525f8DeBe130",
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
        tokenAddress: "0xCc79Cb5023A4896547F4b00a2289d1ed4098Ce13",
        orderId: "",
        walletListActions: [
          {
            name: 'test1',
            value: '1',
          },
          {
            name: 'test2',
            value: '2',
          },
        ],
        walletOnSelect: "",
      }
    },
    created() {
      let t = this;
      let ws = plus.webview.currentWebview();

      if (ws.receiveAddress !== undefined) {
        this.receiveAddress = ws.receiveAddress;
      }
      if (ws.tokenAddress !== undefined) {
        this.tokenAddress = ws.tokenAddress;
      }

      if (ws.orderId !== undefined) {
        this.orderId = ws.orderId;
      }

      this.initSend();
    },
    methods: {
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
        // Toast.loading("查询中...");
        //
        // setTimeout(() => {
        //   web3Util.getBalance(_this.walletAddress).then(res => {
        //     this.walletBalance = res;
        //   });
        //
        //   if (!isEmpty(_this.tokenAddress)) {
        //     web3Util.getContractBalance(_this.tokenAddress, _this.walletAddress).then(res => {
        //       _this.tokenBalance = res;
        //     });
        //   }
        // }, 70)

      },
      send() {
        let _this = this;
        // let tokenBalance;
        // if (isEmpty(this.tokenAddress)) {
        //   tokenBalance = Number(this.walletBalance);
        // } else {
        //   tokenBalance = Number(this.tokenBalance);
        // }

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

        // if (sendAmount > tokenBalance) {
        //   Toast('余额不足');
        //   return;
        // }

        Dialog.confirm({
          title: '提示',
          message: '确认转账吗？（提交后不可撤回）'
        }).then(() => {
          console.log(11111);
          Toast.loading('处理中...');

          setTimeout(() => {
            let password = _this.walletPassword;
            let params = {
              password: password,
              tokenAddress: _this.tokenAddress,
              walletAddress: _this.walletAddress,
              receiveAddress: _this.receiveAddress,
              sendAmount: sendAmount,
              gasLimit: MathUtil.accMul((Number(this.rangeValue) / 100000).toFixed(7), 1000000000),
              gasPrice: _this.gasPrice,
              orderId: _this.orderId,
            };
            console.log(params);
            request(tgcApiUrl.sendTransaction, params).then((res) => {
              // _this.$router.push({path: "/PaySuccess", query: {blAddress: res, donationType: _this.donationType}});
              console.log("paysuccess:" + res);
              if (!isEmpty(res)) {
                Toast.success('交易成功');
              }
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

        // web3Util.getBalance(_this.walletAddress).then(res => {
        //   this.walletBalance = res;
        // });

        // if (!isEmpty(_this.tokenAddress)) {
        //   web3Util.getContractBalance(_this.tokenAddress, _this.walletAddress).then(res => {
        //     _this.tokenBalance = res;
        //     console.log(_this.tokenBalance);
        //   });
        // }

        web3Util.getGasPrice().then(res => {
          _this.gasPrice = res;
        });

        web3Util.getContractName(_this.tokenAddress).then(res => {
          _this.tokenName = res;
        });
        etherscanHttpUtils.get({
          module: 'proxy',
          action: 'eth_getTransactionByHash',
          txhash: '0x4746f9a13b15faa8004e34283b905332839170b086871017c698519e10cf3026'
        }).then(res => {
          console.log(1111)
          console.log(res);
        });

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
          return (Number(this.rangeValue) / 100000).toFixed(7) + "  ETH";
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
