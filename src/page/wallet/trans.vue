<template>
  <div>
    <van-cell-group>
      <van-cell v-for="(t,i) in transList" :key="i" :title="getTitle(t.from,t.to)" :label="t.timeStamp|timeToDate"
                class="cell"
                v-if="t.from!==t.to">

        <img v-if="t.to === walletAddress" slot="icon" src="@/assets/shouru.png" width="45">

        <img v-else slot="icon" src="@/assets/dingdan.png" width="45">

        <span v-if="t.to === walletAddress" style="color: orangered;font-weight: bold">
          {{getSy(t.from,t.to)}}{{unitAmount(t.value,t.tokenDecimal)}}
        </span>
        <span v-else style="color: black;font-weight: bold">
          {{getSy(t.from,t.to)}}{{unitAmount(t.value,t.tokenDecimal)}}
        </span>
        <span style="font-weight: bold;color: #ffc107;margin-left: 2%">{{t.tokenSymbol}}</span>
      </van-cell>
    </van-cell-group>

    <van-tabbar v-model="selected" fixed v-show="operate">
      <van-tabbar-item id="Receive">
        <img slot="icon" src="../../assets/logo.png">
        收款
      </van-tabbar-item>

      <van-tabbar-item id="Send">
        <img slot="icon" src="../../assets/logo.png">
        转账
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {Cell, CellGroup, Tabbar, TabbarItem} from 'vant';
  import EtherscanHttpUtils from "@/utils/web3Util/etherscanHttpUtils";
  import {isNotEmpty} from "../../utils/globalFunc";

  Vue.use(Cell).use(CellGroup).use(Tabbar).use(TabbarItem);

  export default {
    data() {
      return {
        tokenAddress: "",
        walletAddress: "",
        selected: 0,
        transList: [],
        operate: false
      }
    },
    created: function () {
      let ws = plus.webview.currentWebview();
      if (isNotEmpty(ws.walletAddress)) {
        this.walletAddress = ws.walletAddress;
      } else {
        this.walletAddress = plus.storage.getItem('walletAddress');
        this.operate = true;
      }
      if (isNotEmpty(ws.tokenAddress)) {
        this.tokenAddress = ws.tokenAddress;
      }
    },
    mounted() {
      let _t = this;
      if (isNotEmpty(this.tokenAddress)) {
        let data = {
          module: 'account',                 // 模块类别
          action: 'tokentx',                  // 请求接口
          address: _t.walletAddress,                       // 请求参数：钱包地址
          contractaddress: this.tokenAddress,                // 请求参数：代币合约地址
          startblock: 0,                     // 请求参数：查询起始区块
          endblock: 999999999,               // 请求参数：查询结束区块
          page: 1,                           // 分页页码
          offset: 10000,                       // 偏移量（每页数量）
          sort: 'desc',                      // 请求参数：排序类别
        };
        EtherscanHttpUtils.get(data).then((res) => {
          _t.transList = res;
        })
      }

    },
    methods: {
      getTitle(fromAddress, toAddress) {
        let address = this.walletAddress;
        let desc = "";
        if (fromAddress === address) {
          return this.subAddress(toAddress);
        } else {
          return this.subAddress(fromAddress);
        }
      },
      getSy(fromAddress, toAddress) {
        if (fromAddress === this.walletAddress) {
          return "-";
        } else {
          return "+";
        }
      },
      getIcon(fromAddress, toAddress) {
        return fromAddress === this.walletAddress;
      },
      unitAmount: function (value, tokenDecimal) {
        return value / Math.pow(10, tokenDecimal);
      },
      subAddress(address) {
        return address.substring(0, 16) + "...";
      }
    },
    filters: {
      capitalize: function (value) {
        return this.subAddress(value);
      },
      timeToDate: function (value) {
        let date = new Date(Number(value + "000"));
        return date.toLocaleDateString().replace(/\//g, "-") + " " + date.toTimeString().substr(0, 8);
      },
    }
  }
</script>
<style scoped>
  a:-webkit-any-link {
    color: #8c8c8c;
    cursor: pointer;
    text-decoration: none;
  }

  .mint-cell-title {
    -ms-flex: 1;
    flex: 1;
    margin-top: 5%;
  }

  .mint-cell img {
    vertical-align: top;
  }

  .cell {
    margin-top: 1%;
    padding-top: 2%;
  }
</style>
