<template>
  <div class="body">
    <div class="box">
      <van-row type="flex" justify="center">
        积分转入地址
      </van-row>
      <van-row type="flex" justify="center" class='address'>
        <span style="font-size: 10px">{{walletAddress}}</span>
      </van-row>
      <van-row type="flex" justify="center">
        <van-col>
          <qrcode-vue :value="walletAddress" :size="150" style="margin-top: 10%" level="H"></qrcode-vue>
        </van-col>
      </van-row>
      <van-row type="flex" justify="center" class="button">
        <van-button type="default" @click="doCopy">
          <van-icon name="pending-orders" size="20px"/>
          复制地址
        </van-button>
      </van-row>
    </div>
  </div>

</template>
<script>
  import Vue from 'vue'

  import QrcodeVue from 'qrcode.vue'
  import {Button, Toast} from 'vant'
  import {Row, Col, Icon} from 'vant';
  import VueClipboard from 'vue-clipboard2'

  Vue.use(Icon);
  Vue.use(Row).use(Col);
  Vue.use(Button);
  Vue.use(Toast);
  Vue.use(VueClipboard);
  export default {
    data() {
      return {
        tokenAddress: "",
        walletAddress: plus.storage.getItem("walletAddress")
      }
    },
    methods: {
      doCopy() {
        let _this = this;
        _this.$copyText(_this.walletAddress).then(function (e) {
          Toast.success({
            message: '复制成功',
            position: 'bottom',
          })
        }, function (e) {
        })
      }
    },
    components: {
      QrcodeVue
    }
    ,
  }


</script>
<style>
  .button {
    margin-top: 10%;
  }

  .address {
    margin-top: 10%;
    margin-bottom: 10%;
  }
</style>
