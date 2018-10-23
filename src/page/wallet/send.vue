<template>
  <div style="margin: 3%">
    <van-cell-group>
      <van-field label="金额" placeholder="" class="jine">
        <span style="color: dodgerblue;font-size: 16px">ETH</span>
      </van-field>
      <van-field label="收款方" v-model="receiveAddress" placeholder="收款钱包地址">
        <img slot="icon" src="../../assets/tx1.png" width="24"/>
      </van-field>
      <van-field label="矿工费用" readonly disableClear v-model="gasValue"></van-field>
      <van-slider v-model="rangeValue" :min="rangeMin" :max="rangeMax" :step="0.00001">
      </van-slider>
    </van-cell-group>
    <van-button class="doNext" type="primary" size="large" @click="doNext">确认转账</van-button>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {
    Button,
    Field,
    Cell,
    CellGroup,
    Slider
  } from 'vant';

  Vue.use(Button);
  Vue.use(Field);
  Vue.use(Slider);
  Vue.use(Cell).use(CellGroup);

  export default {
    data() {
      return {
        rangeMin: 3,
        rangeMax: 300,
        rangeValue: 3,
        popupVisible: false,
        selected: "",
        receiveAddress: ""
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
      doNext() {
        this.popupVisible = !this.popupVisible;
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

  .doSend {
    width: 100%;
    height: 300px;
    margin-bottom: 0;
  }
</style>
