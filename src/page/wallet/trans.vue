<template>
  <div>
    <div v-show="transList!==null && transList.length === 0">
      暂无交易记录
    </div>
    <van-cell-group v-show="tokenAddress!=='' && transList!==null && transList.length > 0">
      <van-cell v-for="(item,i) in transList" :key="i" :title="getTitle(item.from,item.to)"
                :label="item.timeStamp|timeToDate"
                class="cell"
                v-if="item.from!==item.to">

        <img v-if="item.to === walletAddress" slot="icon" src="@/assets/shouru.png" width="45">

        <img v-else slot="icon" src="@/assets/dingdan.png" width="45">

        <span v-if="item.to === walletAddress" style="color: orangered;font-weight: bold">
          {{getSy(item.from,item.to,item.value)}}{{unitAmount(item.value,item.tokenDecimal)}}
        </span>
        <span v-else class="from-to">
          {{getSy(item.from,item.to,item.value)}}{{unitAmount(item.value,item.tokenDecimal)}}
        </span>
        <span class="cellsymbol">{{item.tokenSymbol}}</span>
      </van-cell>
    </van-cell-group>
    <van-cell-group v-show="tokenAddress ==='' && transList!==null && transList.length > 0">
      <van-cell v-for="(item,i) in transList" :key="i" :title="getTitle(item.from,item.to,item.tokenValue)"
                :label="item.timeStamp|timeToDate"
                class="cell"
                v-if="item.from!==item.to">

        <img v-if="item.to === walletAddress" slot="icon" src="@/assets/shouru.png" width="45">

        <img v-else slot="icon" src="@/assets/dingdan.png" width="45">
        <span v-if="item.to === walletAddress" style="color: orangered;font-weight: bold">
          {{getSy(item.from,item.to,item.value)}}{{unitAmount(item.value)}}
        </span>
        <span v-else class="from-to">
          {{getSy(item.from,item.to,item.value)}}{{unitAmount(item.value)}}
        </span>
        <span class="cellsymbol">ETH</span>
      </van-cell>
    </van-cell-group>
    <van-pagination
      v-show="transList!==null && transList.length !== 0"
      v-model="page"
      :page-count="5"
      mode="simple"
      @change="pageChange"
    />
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
  import {Cell, CellGroup, Tabbar, TabbarItem, Pagination} from 'vant';
  import EtherscanHttpUtils from "@/utils/web3Util/etherscanHttpUtils";
  import {isNotEmpty} from "../../utils/globalFunc";
  import Web3Util from "../../utils/web3Util/Web3Util";

  Vue.use(Cell).use(CellGroup).use(Tabbar).use(TabbarItem).use(Pagination);

  export default {
    data() {
      return {
        tokenAddress: "",
        walletAddress: "",
        selected: 0,
        transList: null,
        operate: false,
        finished: false,
        loading: false,
        page: 1,
      }
    },
    created: function () {
      let _t = this;
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

      this.getData();
    },
    methods: {
      pageChange() {
        this.getData();
      },
      getData() {
        let _t = this;
        let data = null;
        if (isNotEmpty(_t.tokenAddress)) {
          data = {
            module: 'account',                 // 模块类别
            action: 'tokentx',                  // 请求接口
            address: _t.walletAddress,                       // 请求参数：钱包地址
            contractaddress: _t.tokenAddress,                // 请求参数：代币合约地址
            startblock: 0,                     // 请求参数：查询起始区块
            endblock: 999999999,               // 请求参数：查询结束区块
            page: _t.page,                           // 分页页码
            offset: 8,                       // 偏移量（每页数量）
            sort: 'desc',                      // 请求参数：排序类别
          };
        } else {
          data = {
            module: 'account',
            action: 'txlist',
            address: _t.walletAddress,
            startblock: 0,
            endblock: 999999999,
            page: _t.page,                           // 分页页码
            offset: 8,                       // 偏移量（每页数量）
            sort: 'desc',
          }
        }
        EtherscanHttpUtils.get(data).then((res) => {
          for (let i = 0; i < res.length; i++) {
            let decInput = Web3Util.abiDecoder().decodeMethod(res[i].input);

            let tokenValue = decInput.params[1].value;
            let tokenReceiveAddress = decInput.params[0].value;
            if (Number(tokenValue) !== 0) {
              res[i].to = tokenReceiveAddress;
            }
            res[i].tokenValue = _t.unitAmount(decInput.params[1].value, res[i].tokenDecimal);
            res[i].tokenReceiveAddress = decInput.params[0].value;
          }
          _t.transList = res;
        })
      },
      getTitle(fromAddress, toAddress, tokenValue) {
        let desc = "";
        let address = this.walletAddress;
        let showAddress = "";

        if (fromAddress === address) {
          desc = "转账";
          showAddress = this.subAddress(toAddress);
        } else {
          desc = "收款";
          showAddress = this.subAddress(fromAddress);
        }
        if (Number(tokenValue) !== 0) {
          desc = "合约交易";
        }

        return desc + showAddress;
      },
      getSy(fromAddress, toAddress, value) {
        if (Number(value) === 0) {
          return "";
        }
        if (fromAddress === this.walletAddress) {
          return "-";
        } else {
          return "+";
        }
      },
      getIcon(fromAddress, toAddress) {
        return fromAddress === this.walletAddress;
      },
      unitAmount: function (value, tokenDecimal = 0) {
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

  .cellsymbol {
    font-weight: bold;
    color: #ffc107;
    margin-left: 2%;
  }

  .from-to {
    color: black;
    font-weight: bold;
  }
</style>
