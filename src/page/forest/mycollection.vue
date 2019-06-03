<template>
  <div>
    <van-cell-group>
      <van-cell v-for="(item,k) in collectList"
                :key="k"
                :title="item.collectTime"
                :value="0.02"
                :label="item.transHash.substring(0,20)+'...'"
                @click="transInfo(item.transHash)"
      />
    </van-cell-group>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Cell, CellGroup} from 'vant';
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {openWebview} from "../../utils/webview";

  Vue.use(Cell).use(CellGroup);

  export default {
    name: "mycollection",
    data() {
      return {
        collectList: [],
      }
    },
    created() {
      let _this = this;
      request(TGCApiUrl.forestCollectList).then(res => {
        _this.collectList = res;
      })
    },
    methods: {
      transInfo(hash) {
        openWebview({
          url: './wallet.transInfo.html',
          id: 'wallet.transInfo',
          title: '交易详情',
        }, {}, {
          tx: hash
        });
      }
    }
  }
</script>

<style scoped>

</style>
