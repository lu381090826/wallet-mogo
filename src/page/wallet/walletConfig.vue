<template>
  <div>
    <h2>已添加的钱包</h2>
    <van-radio-group v-model="radio">
      <van-cell-group>
        <van-cell v-for="(item,k) in walletList" :key="k" :title="item.walletName" clickable
                  @click="set(item.walletAddress,item.walletName)">
          <van-radio :name="item.walletAddress" :value="item.walletAddress"></van-radio>
        </van-cell>
      </van-cell-group>
    </van-radio-group>

    <van-button class="gotoImport" type="primary" size="large" v-intervalclick="{func:gotoImport}">导入钱包</van-button>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {request} from "@/utils/request";
  import TGCApiUrl from "@/utils/constants/TGCApiUrl";
  import {RadioGroup, Radio, Cell, CellGroup, Button, Toast} from 'vant';
  import cons from "@/utils/constants/Cons";
  import {preLoad, showWebviewById} from "@/utils/webview";

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

        let nw = plus.webview.currentWebview();
        nw.addEventListener('hide', function (e) {
          let wait = plus.nativeUI.showWaiting("钱包切换中，请等待...");
          setTimeout(() => {
            if (_this.walletAddress !== _this.originWalletAddress) {
              _this.reloadWebview();
            }
            wait.close();
          }, 50);
        }, false);

        preLoad([
          {
            url: "./wallet.import.html",
            id: "wallet.import",
            title: "钱包导入"
          }
        ])
      },
      set(walletAddress, walletName) {
        this.radio = walletAddress;
        this.walletAddress = walletAddress;
        this.walletName = walletName;
      },
      reloadWebview() {
        let ws = plus.webview.all();
        for (let i = 0; i < ws.length; i++) {
          if (!cons.inLastWebViewIds(ws[i].id)) {
            ws[i].reload();
          }
        }
      },
      gotoImport() {
        showWebviewById('wallet.import');
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

  .gotoImport {
    margin-top: 30%;
    width: 94%;
    margin-left: 3%;
  }
</style>
