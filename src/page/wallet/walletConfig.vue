<template>
  <div class="body">
    <div class="box text-left">
      <h2>选择当前钱包</h2>
      <van-cell-group>
        <van-cell v-for="(item,k) in walletList" :key="k" :title="item.walletName">
        </van-cell>
      </van-cell-group>

      <van-button class="gotoImport button-blue" type="primary" size="large" v-intervalclick="{func:gotoImport}">导入钱包</van-button>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {request} from "@/utils/request";
  import TGCApiUrl from "@/utils/constants/TGCApiUrl";
  import {RadioGroup, Radio, Cell, CellGroup, Button, Toast} from 'vant';
  import cons from "@/utils/constants/Cons";
  import {preLoad, showWebviewById} from "@/utils/webview";
  import {openWebview} from "../../utils/webview";

  Vue.use(RadioGroup);
  Vue.use(Button);
  Vue.use(Radio);
  Vue.use(Cell);
  Vue.use(Toast);
  Vue.use(CellGroup);

  export default {
    data() {
      return {
        walletList: [],
        walletAddress: plus.storage.getItem("walletAddress"),
        walletName: plus.storage.getItem("walletName"),
        radio: plus.storage.getItem("walletAddress"),
        originWalletAddress: plus.storage.getItem("walletAddress"),
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
      reloadWebview() {
        let wa = plus.nativeUI.showWaiting();
        setTimeout(() => {
          let ws = plus.webview.getWebviewById(cons.baseWebViewId);
          ws.reload();
          wa.close();
        });
      },
      gotoImport() {
        openWebview({
          url: "./wallet.import.html",
          id: "wallet.import",
          title: "钱包导入"
        });
      }
    },
    watch: {
      radio() {
        if (this.radio !== plus.storage.getItem("walletAddress")) {
          plus.storage.setItem('walletAddress', this.walletAddress);
          plus.storage.setItem('walletName', this.walletName);
        }
      }
    }
  }


</script>
<style scoped>
  .gotoImport {
    margin-top: 30%;
    width: 94%;
    margin-left: 3%;
    margin-bottom: 5%;
    color: white;
  }

</style>
