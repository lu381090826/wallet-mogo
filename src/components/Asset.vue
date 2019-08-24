<template>
  <div>

    <div class="pull-refresh">
      <div class="asset-header">
        <van-row type="flex" justify="end" style="padding-top: 3%;margin-right: 5%">
          <van-col span="20">
            <div style="text-align: center">
              <span style="font-size: 20px;">{{walletName}}</span>
              <span style="font-size: 12px;">{{walletAddress|formatAddress}}</span>
              <van-icon name="qr" size="12px" @click="showWalletQcode"></van-icon>
            </div>
          </van-col>
          <van-col>
            <van-col span="4" v-intervalclick="{func:config}">
              <div>
                <van-icon name="wap-nav" size="20px"></van-icon>
              </div>
            </van-col>
          </van-col>
        </van-row>
        <van-row gutter="20" type="flex" justify="center">
          <van-col span="10">
            <div class="asset-header-titile" v-intervalclick="{func:trans}">
              <div class="titile-name">Eth资产</div>
              <div class="asset-number">
                {{walletBalance}}
              </div>
            </div>
          </van-col>
          <van-col span="10">
            <div class="asset-header-titile" v-intervalclick="{func:profit}">
              <div class="titile-name">累计收益(TG)</div>
              <div class="asset-number">
                {{totalProfit}}
              </div>
            </div>
          </van-col>
        </van-row>
        <div class="cell-group">
          <div>
            <van-row class="box token-row"
                     v-for="(item,k) in tokenList" :key="k"
                     v-intervalclick="{func:trans,tokenAddress:item.tokenAddress}">
              <van-col span="4">
                <img :src="getTokenImg(item.tokenAddress)" width="45px">
              </van-col>
              <van-col span="12">
                <div style="float: left;margin-bottom: 15px;">{{item.tokenName}}</div>
                <div style="font-size: 10px;">{{formatAddress(item.tokenAddress)}}</div>
              </van-col>
              <van-col span="8">{{item.balance}}</van-col>
            </van-row>
          </div>

        </div>
      </div>
    </div>

    <van-popup v-model="showWalletConfig" position="right">
      <div style="width: 200px;height: 1000px;">
        <div style="margin-top: 1%">
          <van-cell-group :border="false">
            <van-cell v-for="(item,k) in walletList" :key="k" :title="item.walletName" clickable
                      @click="set(item.walletAddress,item.walletName)" :label="subString(item.walletAddress)"
                      :style="{backgroundColor: getColor(item.walletAddress)}"
            >
            </van-cell>
          </van-cell-group>
        </div>
        <hr color='#AFAFAF'>
        <van-cell-group :border="false">
          <van-cell :border="false">
            <van-button type="default" size="large" v-intervalclick="{func:walletConfig}">积分管理</van-button>
          </van-cell>
          <van-cell :border="false">
            <van-button type="default" size="large" v-intervalclick="{func:addToken}">合约管理</van-button>
          </van-cell>
        </van-cell-group>
      </div>
    </van-popup>

    <van-popup v-model="walletQcode" class="box" style="width: 250px;text-align: center;">
      <qrcode-vue :value="walletAddress" :size="150" style="margin-top: 3%" level="H"></qrcode-vue>
      <div>
        <span style="font-size: 10px;">{{walletAddress}}</span>
      </div>
      <div style="margin-top: 5%;">
        <van-button size="large" @click="doCopy">复制</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'
  import Web3Util from "@/utils/web3Util/Web3Util";
  import {request} from "@/utils/request";
  import {Cell, CellGroup, PullRefresh, Row, Col, Icon, Popup, Button} from 'vant';
  import TGCApiUrl from "@/utils/constants/TGCApiUrl";
  import {Tabbar, TabbarItem} from 'vant';
  import {openWebview, preLoad, showWebviewById} from "@/utils/webview";
  import QrcodeVue from 'qrcode.vue'
  import {getAddressImg} from "../utils/web3Util/AddressImg";


  Vue.use(Tabbar).use(TabbarItem)
     .use(Row).use(Col)
     .use(PullRefresh)
     .use(Icon)
     .use(Popup)
     .use(Button)
     .use(Cell)
     .use(CellGroup);
  Vue.use(VueClipboard);
  export default {
    components: {
      QrcodeVue
    },
    data() {
      return {
        walletAddress: plus.storage.getItem("walletAddress"),
        walletName: plus.storage.getItem("walletName"),
        tokenList: [],
        walletBalance: "-",
        totalProfit: "-",
        walletList: null,
        showWalletConfig: false,
        walletQcode: false,
      }
    },
    mounted() {
      let _t = this;
      let ws = plus.webview.currentWebview();
      ws.setPullToRefresh({support: true, style: 'circle', offset: '45px'}, _t.onRefresh);
    },
    created() {
      let t = this;
      this.init();
      window.addEventListener("walletList", function (event) {
        //通过event.detail可获得传递过来的参数内容
        t.getWalletList();
      });
    },
    filters: {
      formatAddress(val) {
        return val.substring(0, 6) + '...' + val.substring(val.length - 6, val.length);
      }
    },
    methods: {
      async getBalance(tokenAddress) {
        return await Web3Util.getBalance(this.walletAddress, tokenAddress).then(res => {
          console.log("tokenAddress:" + tokenAddress);
          console.log(res);
          return res;
        });
      },
      formatAddress(tokenAddress) {
        return tokenAddress.substring(0, 10) + '...' + tokenAddress.substring(28, tokenAddress.length);
      },
      getTokenImg(tokenAddress) {
        return getAddressImg(tokenAddress)
      },
      showWalletQcode() {
        this.walletQcode = !this.walletQcode;
      },
      doCopy() {
        let _this = this;
        _this.$copyText(_this.walletAddress).then(function (e) {
          plus.nativeUI.toast('地址复制成功')
        })
      },
      set(walletAddress, walletName) {
        this.walletAddress = walletAddress;
        this.walletName = walletName;
        this.onRefresh();
      },
      getColor(walletAddress) {
        if (walletAddress === this.walletAddress) {
          return "#efefef";
        } else {
          return "white";
        }
      },
      walletConfig() {
        openWebview({
          url: "./wallet.walletConfig.html",
          id: "wallet.walletConfig",
          title: "地址设置",
        });
      },
      profit() {
        openWebview(
          {
            url: "./profit.index.html",
            id: "profit.index",
            needLoaded: true,
            titleStyle: {
              titleText: "持币矿",
              titleColor: "#ffffff",
              backgroundColor: "#fa5b21",
              autoBackButton: true,
              progress: {color: '#ff5c0a', height: "1%"},
            },
            style: {render: true}
          })
      },
      subString(value) {
        if (Number(value) === 0) {
          return value;
        }
        return value.toString().substring(0, 8) + "..";
      },
      trans(tokenAddress) {
        let _this = this;
        openWebview({
          url: './wallet.trans.html',
          id: "wallet.trans",
          titleStyle: {
            titleText: "交易详情",
            autoBackButton: true,
            progress: {color: '#3a90e0', height: "1%"},
          }
        }, {}, {
          walletAddress: _this.walletAddress,
          tokenAddress: tokenAddress,
        })
      },
      addToken() {
        openWebview({
          url: "./wallet.tokenAdd.html",
          id: "wallet.tokenAdd",
          title: "合约管理",
        })
      },
      send() {
        openWebview({
          url: "./wallet.send.html",
          id: "wallet.send",
          titleStyle: {
            titleText: "转出积分",
            autoBackButton: true,
            progress: {color: '#ff5c0a', height: "1%"},
          }
        });
      },
      receive() {
        openWebview({
          url: "./wallet.receive.html",
          id: "wallet.receive",
          title: "转入积分"
        });
      },
      config() {
        this.showWalletConfig = true;
      },
      onRefresh() {
        this.init();
        let ws = plus.webview.currentWebview();
        setTimeout(() => {
          ws.endPullToRefresh();
        }, 1000);
      },
      getWalletList() {
        let _this = this;
        request(TGCApiUrl.walletList).then(res => {
          _this.walletList = res;
        });
      },
      init() {
        let _this = this;

        _this.walletBalance = '-';

        _this.getWalletList();

        Web3Util.getBalance(_this.walletAddress).then(res => {
          _this.walletBalance = res;
        });

        request(TGCApiUrl.walletTokenList, {status: true}).then(res => {
          _this.tokenList = [];
          if (res.length != null) {
            let arr = [];

            for (let i = 0; i < res.length; i++) {
              let row = res[i];
              Web3Util.getBalance(_this.walletAddress, row.tokenAddress).then(res => {
                row.balance = res;
                _this.tokenList.push(row)
              })
            }
          }
        });

        request(TGCApiUrl.getProgitInfo, {walletAddress: _this.walletAddress}).then(function (res) {
          _this.totalProfit = res.totalProfit;
        });

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
    padding: 1%;
    min-height: 500px;
    background-color: white;
  }

  .asset-number {
    font-size: 11px;
  }

  .token-row {
    background-image: -webkit-linear-gradient(top, #3a90e0, #3a81d1);
    border: 1px solid #1d9dd2;
  }
</style>
