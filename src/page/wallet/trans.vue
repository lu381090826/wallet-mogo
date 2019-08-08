<template>
  <div class="body">
    <div class="blank-space"></div>
    <div class="box" style="text-align: left">
      <div>
        钱包地址：<span class="address-font">{{walletAddress}}</span>
      </div>
      <div v-if="tokenAddress">
        <div>
          合约名称：<span class="address-font">{{tokenInfo.name}}{{tokenInfo.symbol}}</span>
        </div>
        <div>
          合约地址：<span class="address-font">{{tokenAddress}}</span>
        </div>
        <div>
          合约余额：<span>{{balance}}</span>
        </div>
      </div>
      <div v-else>
        Eth余额：<span>{{balance}}</span>
      </div>
    </div>

    <div class="box" v-show="transList==null || transList.length === 0">
      <div class="no-trans">
        <div>
          <van-icon name="info-o" size="50px"></van-icon>
        </div>
        暂无交易记录
      </div>
    </div>

    <div class="box" v-show="transList!=null && transList.length > 0">
      <van-tabs v-model="transActive">
        <van-tab title="转入">
          <van-panel v-for="(item,i) in transList"
                     v-if="item.to===walletAddress"
                     :key="i"
                     :title="transValue(item)"
                     :desc="formatAddress(item.transactionHash)"
                     :status="item.transactionHash===null?'处理中':'成功'"
                     @click="gotoTransInfo(item.transactionHash)"
          >
          </van-panel>
        </van-tab>

        <van-tab title="转出">
          <van-panel v-for="(item,i) in transList"
                     v-if="item.from===walletAddress"
                     :key="i"
                     :title="transValue(item)"
                     :desc="formatAddress(item.transactionHash)"
                     :status="item.transactionHash===null?'处理中':'成功'"
                     @click="gotoTransInfo(item.transactionHash)"
          >
          </van-panel>
        </van-tab>
      </van-tabs>

    </div>

    <div class="box">
      <div style="margin-top: 5%;margin-bottom: 5%">
        <van-button size="large" class="button-blue" v-intervalclick="{func:send}">
          转账
        </van-button>
      </div>
      <div style="margin-bottom: 5%">
        <van-button size="large">
          收款
        </van-button>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {isEmpty, isNotEmpty} from "@/utils/globalFunc";
  import Web3Util from "@/utils/web3Util/Web3Util";
  import {Toast, Cell, CellGroup, Pagination, Icon, Row, Col, Tabbar, TabbarItem, Switch, Button} from 'vant';
  import {openWebview} from "@/utils/webview";
  import {Tab, Tabs} from 'vant';
  import {Panel} from 'vant';
  import ethplorerUtils from "@/utils/web3Util/ethplorerUtils";

  Vue.use(Panel);
  Vue.use(Tab).use(Tabs);
  Vue.use(Cell)
    .use(CellGroup)
    .use(Icon)
    .use(Row)
    .use(Toast)
    .use(Col)
    .use(Tabbar)
    .use(TabbarItem)
    .use(Switch)
    .use(Button)
    .use(Pagination);

  export default {
    data() {
      return {
        tokenAddress: "",
        walletAddress: "",
        balance: "---",
        selected: 0,
        transList: [],
        page: 1,
        offset: 5,
        active: 1,
        transActive: 0,
        tokenInfo: 0,
      }
    },
    created: function () {
      let ws = plus.webview.currentWebview();
      if (isNotEmpty(ws.walletAddress)) {
        this.walletAddress = ws.walletAddress;
      } else {
        this.walletAddress = plus.storage.getItem('walletAddress');
      }
      if (isNotEmpty(ws.tokenAddress)) {
        this.tokenAddress = ws.tokenAddress;
      }
      this.getData();
    },
    methods: {
      transValue(obj) {
        let value = obj.value;

        if (isEmpty(obj.tokenInfo)) {
          return value + 'eth';
        }

        let decimals = obj.tokenInfo.decimals;

        return (Number(value) / Math.pow(10, decimals)).toFixed(4) + "   " + obj.tokenInfo.symbol;

      },
      gotoTransInfo(tx) {
        openWebview({
          url: './wallet.transInfo.html',
          id: 'wallet.transInfo',
          title: '交易详情',
        }, {}, {
          tx: tx
        });
      },
      formatAddress(address) {
        return address.toString().substring(0, 10) + '...';
      },
      fromHex(hex) {
        return Web3Util.instance.utils.hexToNumber(hex);
      },
      send() {
        let _this = this;
        openWebview({
          url: "./wallet.send.html",
          id: "wallet.send",
          titleStyle: {
            titleText: "转账",
            autoBackButton: true,
            progress: {color: '#ff5c0a', height: "1%"},
          }
        }, {}, {
          tokenAddress: _this.tokenAddress
        })
      },
      receive() {
        let _this = this;
        openWebview({
          url: "./wallet.receive.html",
          id: "wallet.receive",
          title: "收款"
        });
      },
      pageChange() {
        this.getData();
      },
      subAddress(address) {
        return address.substring(0, 16) + "...";
      },
      getData() {
        let _t = this;
        let walletAddress = plus.storage.getItem("walletAddress");
        let tokenAddress = _t.tokenAddress;

        Web3Util.getBalance(this.walletAddress).then(res => {
          _t.balance = res;
        });

        if (isNotEmpty(tokenAddress)) {
          ethplorerUtils.getTokenInfo(tokenAddress).then(res => {
            _t.tokenInfo = res;
          });

          ethplorerUtils.getAddressHistory(walletAddress, {token: tokenAddress, type: 'transfer'}).then(res => {
            _t.transList = res.operations;
          });
        } else {
          ethplorerUtils.getAddressHistory(walletAddress, {type: 'transfer'}).then(res => {
            console.log(JSON.stringify(res))
            _t.transList = res.operations;
          });
        }
      }
    }
  }
</script>
<style scoped>

  .trans-cell {
    position: relative;
    margin: 0 auto;
    width: 90%;
    background-color: white;
    border: 1px solid #eeeeee;
    box-shadow: #e9e9e9 0.1px 0.1px 0.1px 0.1px;
    border-radius: 5px;
    min-height: 530px;
    padding-left: 3%;
    padding-right: 3%;
    padding-bottom: 15%;
  }

  .trans-cell-row {
    border: 0 solid #e1e1e1;
    border-bottom-width: 1px;
    padding: 3%;
    margin-bottom: 1%;
  }

  .trans-cell-row-inner {
    padding: 1%;
    text-align: left;
  }

  .trans-cell-bottom {
    width: 100%;
    left: 0;
    bottom: 0;
    margin-top: 3%;
  }

  .no-trans {
    padding-top: 10%;
    padding-bottom: 10%;
    font-size: 20px;
    color: #979797;
  }

  .address-font {
    font-size: 9px;
  }

  .button-pan {
    text-align: right
  }
</style>
