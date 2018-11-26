<template>
  <div class="body">
    <div class="box text-left">
      <div class="box">
        <van-cell-group>
          <van-cell title="合约名称" value="TG"/>
          <van-cell title="合约地址" :label="tokenAddress"/>
          <div style="text-align: center;padding-bottom: 8%">
            <div style="margin-top: 3%;font-weight: bold;">二维码</div>
            <qrcode-vue :value="tokenAddress" :size="150" style="margin-top: 3%" level="H"></qrcode-vue>
          </div>
        </van-cell-group>
      </div>
      <van-field placeholder="请输入要购入的数量"></van-field>
      <van-button class="button-orange" style="margin-top: 10%;margin-bottom: 10%" type="default" size="large">
        立即购买
      </van-button>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {Field, Button, CellGroup, Cell} from 'vant';
  import TGCConfig from "../../utils/constants/tgcConfig";
  import QrcodeVue from 'qrcode.vue'

  Vue.use(Field).use(Button).use(CellGroup).use(Cell);

  export default {
    data() {
      return {
        tokenAddress: TGCConfig.tokenAddress
      };
    },
    components: {QrcodeVue}
  }
</script>

<style scoped></style>
