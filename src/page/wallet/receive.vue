<template>
  <div style="padding-top: 30%">
    <van-row type="flex" justify="center">
      收款地址
    </van-row>
    <van-row type="flex" justify="center">
      <span style="font-size: 10px">{{walletAddress}}</span>
    </van-row>
    <van-row type="flex" justify="center">
      <van-button type="default" @click="doCopy">复制</van-button>
    </van-row>
    <van-row type="flex" justify="center">
      <van-col>
        <qrcode-vue :value="walletAddress" :size="150" style="margin-top: 10%" level="H"></qrcode-vue>
      </van-col>
    </van-row>
  </div>

</template>
<script>
  import Vue from 'vue'
  import QrcodeVue from 'qrcode.vue'
  import {Button, Toast} from 'vant'
  import {Row, Col} from 'vant';
  import VueClipboard from 'vue-clipboard2'

  Vue.use(Row).use(Col);
  Vue.use(Button);
  Vue.use(Toast);
  Vue.use(VueClipboard);
  export default {
    data() {
      return {
        tokenAddress: "",
        walletAddress: ""
      }
    },
    created() {
      if (!plus.storage.getItem("walletAddress")) {
        this.walletAddress = plus.storage.getItem("walletAddress");
      }
    },
    methods: {
      doCopy() {
        let _this = this;
        _this.$copyText(_this.walletAddress).then(function (e) {
          Toast({
            message: '复制成功',
            position: 'bottom',
          })
        }, function (e) {
        })
      },
      checkUpdate() {
        let _t = this;
      }
    },
    components: {
      QrcodeVue
    }
    ,
  }


</script>
<style>

</style>
