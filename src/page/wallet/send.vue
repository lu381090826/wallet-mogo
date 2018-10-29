<template>
  <div style="margin: 3%">
    <van-cell-group>
      <van-field label="金额" placeholder="" type='number'
                 v-model="sendAmount"
                 :error-message="sendAmountError"
                 @input="sendAmountError = ''">
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
      <van-field label="钱包余额" v-model="walletBalance" :readonly="true">
      </van-field>
      <van-field label="交易密码" v-model="walletPassword" type="password">
      </van-field>
      <van-button class="sendButton" type="primary" size="large" v-intervalclick="{func:send}">立即转账</van-button>
    </van-popup>

    <van-actionsheet
      v-model="showWalletList"
      :actions="walletListActions"
      @select="walletOnSelect"
      cancel-text="取消"
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
    Popup
  } from 'vant';

  Vue.use(Actionsheet);
  Vue.use(Popup);
  Vue.use(Button);
  Vue.use(Field);
  Vue.use(Slider);
  Vue.use(Cell).use(CellGroup);

  export default {
    data() {
      return {
        sendAmount: "1",
        receiveAddress: "11",
        rangeMin: 3,
        rangeMax: 300,
        rangeValue: 3,
        popupVisible: false,
        selected: "",
        showConfirm: false,
        walletName: plus.storage.getItem('walletName'),
        sendAmountError: "",
        receiveAddressError: "",
        walletPassword: "",
        showWalletList: false,
        walletBalance: "",
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

      function plusReady() {
        t.construct();
      }

      if (window.plus) {
        plusReady();
      } else {
        document.addEventListener("plusready", plusReady, false);
      }
    },
    methods: {
      walletOnSelect() {
        console.log(this.walletOnSelect)
      },
      send() {
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
      construct() {
        let ws = plus.webview.currentWebview();
        if (ws.receiveAddress !== undefined) {
          this.receiveAddress = ws.receiveAddress;
        }
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
    margin-top: 22%;
  }

  .confirm {
    width: 80%;
    padding: 3%;
    height: 300px;
    margin-bottom: 0;
  }
</style>
