<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="pull-refresh">
        <div class="asset-header">
          <van-row type="flex" justify="center">
            <div>{{walletName}}</div>
            <div style="font-size: 10px">{{walletAddress}}</div>
          </van-row>
          <van-row gutter="20" type="flex" justify="center">
            <van-col span="10">
              <div class="asset-header-titile">
                <div class="titile-name">Eth资产</div>
                <div>
                  {{walletBalance}}
                </div>
              </div>
            </van-col>
            <van-col span="10">
              <div class="asset-header-titile">
                <div class="titile-name">昨日收益(TGC)</div>
                <div>
                  {{walletBalance}}
                </div>
              </div>
            </van-col>
          </van-row>
          <van-cell-group class="cell-group">
            <van-cell v-for="(i,item) in wallet" :key="item" :title="item.tokenName"
                      :label="item.address" is-link/>
          </van-cell-group>
        </div>
      </div>
    </van-pull-refresh>
    <van-tabbar>
      <van-tabbar-item icon="exchange-record" v-intervalclick="{func:send}">转账</van-tabbar-item>
      <van-tabbar-item icon="cash-back-record" v-intervalclick="{func:receive}">收款</van-tabbar-item>
      <van-tabbar-item icon="edit" v-intervalclick="{func:config}">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Web3Util from "../../utils/web3Util/Web3Util";
  import {request} from "../../utils/request";
  import {Cell, CellGroup, PullRefresh, Row, Col, Toast} from 'vant';
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {Tabbar, TabbarItem} from 'vant';
  import {preLoad, showWebviewById} from "../../utils/webview";

  Vue.use(Tabbar).use(TabbarItem)
    .use(Row).use(Col)
    .use(PullRefresh)
    .use(Cell)
    .use(Toast)
    .use(CellGroup);
  export default {
    data() {
      return {
        walletAddress: plus.storage.getItem("walletAddress"),
        walletName: plus.storage.getItem("walletAddress"),
        wallet: [],
        walletBalance: "---",
        isLoading: false,
      }
    },
    created() {
      preLoad([{
        url: "./wallet.walletConfig.html",
        id: "wallet.walletConfig",
        title: "钱包设置",
      }]);
      this.init();
    },
    methods: {
      send() {
        showWebviewById("wallet.send");
      },
      receive() {
        showWebviewById("wallet.receive");
      },
      config() {
        showWebviewById("wallet.walletConfig");
      },
      onRefresh() {
        let _t = this;
        setTimeout(() => {
          _t.isLoading = false;
          _t.$toast('刷新成功');
          _t.init();
        }, 500);
      },
      init() {
        let _this = this;
        Web3Util.getBalance().then(res => {
          _this.walletBalance = res;
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
