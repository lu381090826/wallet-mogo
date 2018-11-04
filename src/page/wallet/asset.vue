<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="pull-refresh">
        <div class="asset-header">
          <van-row type="flex" justify="center" style="padding-top: 3%">
            <div style="font-size: 20px">{{walletName}}</div>
          </van-row>
          <van-row type="flex" justify="center" style="margin-top: 3%">
            <div style="font-size: 10px">{{walletAddress}}</div>
          </van-row>
          <van-row gutter="20" type="flex" justify="center">
            <van-col span="10">
              <div class="asset-header-titile" v-intervalclick="{func:trans}">
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
                  {{walletProfit}}
                </div>
              </div>
            </van-col>
          </van-row>
          <div class="cell-group">
            <van-cell-group>
              <van-cell v-for="(item,k) in tokenList" :key="k"
                        :title="item.tokenName"
                        :value="item.tokenBalance"
                        :label="item.tokenAddressShow" is-link @click="trans(item.tokenAddress)"/>
            </van-cell-group>

            <van-cell-group>
              <van-cell title="添加资产">
                <van-icon slot="right-icon" name="add-o" v-intervalclick="{func:addToken}"/>
              </van-cell>
            </van-cell-group>
          </div>
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
  import {Cell, CellGroup, PullRefresh, Row, Col, Toast, Icon} from 'vant';
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {Tabbar, TabbarItem} from 'vant';
  import {openWebview, preLoad, showWebviewById} from "../../utils/webview";

  Vue.use(Tabbar).use(TabbarItem)
    .use(Row).use(Col)
    .use(PullRefresh)
    .use(Cell)
    .use(Toast)
    .use(Icon)
    .use(CellGroup);
  export default {
    data() {
      return {
        walletAddress: plus.storage.getItem("walletAddress"),
        walletName: plus.storage.getItem("walletName"),
        tokenList: [],
        walletBalance: "---",
        isLoading: false,
        walletProfit: "---"
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
      trans(tokenAddress) {
        let _this = this;
        openWebview({
          url: './wallet.trans.html',
          id: "wallet.trans",
          title: "交易详情",
        }, {}, {
          walletAddress: _this.walletAddress,
          tokenAddress: tokenAddress,
        })
      },
      addToken() {
        showWebviewById("wallet.tokenAdd")
      },
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
        preLoad([{
          url: "./wallet.tokenAdd.html",
          id: "wallet.tokenAdd",
          title: "添加资产",
        }]);
        Web3Util.getBalance().then(res => {
          _this.walletBalance = res;
        });
        request(TGCApiUrl.walletTokenList).then(res => {
          _this.tokenList = [];
          if (res.length != null) {
            let arr = [];
            for (let i = 0; i < res.length; i++) {
              Web3Util.getContractBalance(res[i].tokenAddress).then(contractBalance => {
                res[i].tokenBalance = contractBalance;
                res[i].tokenAddressShow = res[i].tokenAddress.substring(0, 10) + "...";
                _this.tokenList.push(res[i])
              });
            }
          }
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
