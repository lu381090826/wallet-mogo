<template>
  <div>
    <h2>已添加的钱包</h2>
    <van-radio-group v-model="radio">
      <van-cell-group>
        <van-cell v-for="(item,k) in walletList" :key="k" :title="item.walletName" clickable
                  @click="radio = item.walletAddress">
          <van-radio :name="item.walletAddress" :value="item.walletAddress"></van-radio>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {RadioGroup, Radio, Cell, CellGroup} from 'vant';

  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(Cell);
  Vue.use(CellGroup);
  export default {
    data() {
      return {
        walletList: [],
        walletAddress: plus.storage.getItem("walletAddress"),
        radio: plus.storage.getItem("walletAddress")
      }
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        let _this = this;
        request(TGCApiUrl.walletList).then(res => {
          _this.walletList = res;
        });
      },
    }
  }


</script>
<style scoped>
  .pull-refresh {
    background-color: orange;
    color: white;
    height: 100%;
  }

  .asset-header {
    width: 100%;
    background-color: #fafafa;
    height: 10%;
    min-height: 100px;
    background-image: -webkit-linear-gradient(top, orange, orange);
  }

  .asset-header-titile {
    font-weight: bold;
    font-size: 18px;
    color: white;
    margin-top: 15%;
    margin-bottom: 10%;
  }

  .titile-name {
    font-size: 13px;
  }

  .cell-group {
    min-height: 500px;
    background-color: white;
  }
</style>
