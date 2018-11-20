<template>
  <div>
    <div class="top">我的财富</div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="pull-refresh">
        <div class="asset-header">
          <van-row type="flex" justify="center" style="padding-top: 3%">
            <div style="font-size: 20px">钱包-{{walletName}}</div>
          </van-row>
          <van-row type="flex" justify="center" style="margin-top: 3%">
            <div style="font-size: 10px">地址-{{walletAddress}}</div>
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
              <div class="asset-header-titile" v-intervalclick="{func:profit}">
                <div class="titile-name">累计收益(TG)</div>
                <div>
                  {{totalProfit}}
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
  </div>
</template>
<script>
  import Vue from 'vue'
  import Web3Util from "@/utils/web3Util/Web3Util";
  import {request} from "@/utils/request";
  import {Cell, CellGroup, PullRefresh, Row, Col, Toast, Icon} from 'vant';
  import TGCApiUrl from "@/utils/constants/TGCApiUrl";
  import {Tabbar, TabbarItem} from 'vant';
  import {openWebview, preLoad, showWebviewById} from "@/utils/webview";

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
        walletAddress: "",
        walletName: "",
        tokenList: [],
        walletBalance: "---",
        isLoading: false,
        totalProfit: "---",
      }
    },
    created() {
      this.init();
    },
    methods: {
      profit() {
        openWebview(
          {
            url: "./profit.index.html",
            id: "profit.index",
            showWaiting: true,
            titleStyle: {
              titleText: "持币矿",
              titleColor: "#ffffff",
              backgroundColor: "#ffd81d",
              splitLine: {color: "#ffd81d"},
              autoBackButton: true,
              progress: {color: '#ff5c0a', height: "1%"},
            },
            style: {render: true}
          })
      },
      trans(tokenAddress) {
        let _this = this;
        openWebview({
          url: './wallet.trans.html',
          id: "wallet.trans",
          title: "交易详情",
          needLoaded: true,
        }, {}, {
          walletAddress: _this.walletAddress,
          tokenAddress: tokenAddress,
        })
      },
      addToken() {
        openWebview({
          url: "./wallet.tokenAdd.html",
          id: "wallet.tokenAdd",
          title: "添加资产",
        })
      },
      send() {
        openWebview({
          url: "./wallet.send.html",
          id: "wallet.send",
          titleStyle: {
            titleText: "转账",
            autoBackButton: true,
            progress: {color: '#ff5c0a', height: "1%"},
          }
        });
      },
      receive() {
        openWebview({
          url: "./wallet.receive.html",
          id: "wallet.receive",
          title: "收款"
        });
      },
      config() {
        showWebviewById({
          url: "./wallet.walletConfig.html",
          id: "wallet.walletConfig",
          title: "钱包设置",
        });
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
        _this.walletAddress = plus.storage.getItem("walletAddress");
        _this.walletName = plus.storage.getItem("walletName");

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
        request(TGCApiUrl.getProgitInfo, {walletAddress: plus.storage.getItem("walletAddress")}).then(function (res) {
          _this.totalProfit = res.totalProfit;
        })
      },
    }
  }


</script>
<style scoped>
  .top {
    width: 100%;
    padding-top: 10%;
    background-color: #3a90e0;
    text-align: center;
    color: white;
    padding-bottom: 1%;
  }

  .pull-refresh {
    background-color: #3a90e0;
    color: white;
    height: 100%;
  }

  .asset-header {
    width: 100%;
    background-color: #fafafa;
    height: 10%;
    min-height: 100px;
    background-image: -webkit-linear-gradient(top, #3a90e0, #3a81d1);
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
