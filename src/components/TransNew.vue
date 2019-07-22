<template>
  <div class="body">
    <div class="blank-space"></div>
    <div class="box" style="text-align: left">
      <div>
        钱包地址：<span class="address-font">{{walletAddress}}</span>
      </div>
      <div>
        合约地址：<span class="address-font">{{tokenAddress}}</span>
      </div>
      <div>
        合约余额：<span>{{balance}}</span>
      </div>
    </div>
    <div class="box" v-show="transList !==null && transList.length === 0">
      <div class="no-trans">
        <div>
          <van-icon name="info-o" size="50px"></van-icon>
        </div>
        暂无交易记录
      </div>
    </div>

    <div>
      <van-tabs v-model="transActive">
        <van-tab title="转入">
          <van-panel v-for="(item,i) in transFromList"
                     :key="i"
                     :title="formatAddress(item.returnValues[0])"
                     :desc="fromHex(item.returnValues[2]._hex)"
                     status="状态"
          >
          </van-panel>
        </van-tab>

        <van-tab title="转出">
          <van-panel title="标题" desc="描述信息" status="状态">
            <div slot="footer" class="button-pan">
              <van-button size="small">按钮</van-button>
              <van-button size="small" type="danger">按钮</van-button>
            </div>
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
  // import etherscanHttpUtils from "../utils/web3Util/etherscanHttpUtils";
  import {isEmpty, isNotEmpty} from "../utils/globalFunc";
  import Web3Util from "../utils/web3Util/Web3Util";
  import {Toast, Cell, CellGroup, Pagination, Icon, Row, Col, Tabbar, TabbarItem, Switch, Button} from 'vant';
  import {openWebview} from "../utils/webview";
  import {Tab, Tabs} from 'vant';
  import {Panel} from 'vant';

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
        transList: null,
        page: 1,
        offset: 5,
        active: 1,
        transFromList: [],
        transActive: 1,
      }
    },
    created: function () {
      let ws = plus.webview.currentWebview();
      let t = this;
      if (isNotEmpty(ws.walletAddress)) {
        this.walletAddress = ws.walletAddress;
      } else {
        this.walletAddress = plus.storage.getItem('walletAddress');
      }
      if (isNotEmpty(ws.tokenAddress)) {
        this.tokenAddress = ws.tokenAddress;
      }
      setTimeout(() => {
        Web3Util.getBalance(this.walletAddress).then(res => {
          t.balance = res;
        });
        this.getData();
      }, 200);
    },
    methods: {
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
      getDesc(isContract, fromAddress, toAddress, tokenValue) {
        if (isContract) {
          return "[合约交易]"
        } else {
          let address = this.walletAddress;
          if (fromAddress === address) {
            return "[转入]";
          } else {
            return "[转出]";
          }
        }
      },
      getTitle(fromAddress, toAddress) {
        let address = this.walletAddress;
        let showAddress = "";
        if (fromAddress === address) {
          showAddress = this.subAddress(toAddress);
        } else {
          showAddress = this.subAddress(fromAddress);
        }
        return showAddress;
      },
      unitAmount: function (value, tokenDecimal = 0) {
        return value / Math.pow(10, tokenDecimal);
      },
      getData() {
        let _t = this;
        if (isNotEmpty(_t.tokenAddress)) {
          Web3Util.getContract(_t.tokenAddress).getPastEvents('Transfer', {
            fromBlock: 0,
            toBlock: 'latest',
            filter: {
              _from: '0x6cc5f688a315f3dc28a7781717a9a798a59fda7b'
            }
          }).then((res) => {
            _t.transFromList = res;
            console.log(JSON.stringify(res[res.length - 1]))
          })
        }


        // let data = null;
        //
        //
        // if (isNotEmpty(_t.tokenAddress)) {
        //   data = {
        //     module: 'account',                 // 模块类别
        //     action: 'tokentx',                  // 请求接口
        //     address: _t.walletAddress,                       // 请求参数：钱包地址
        //     contractaddress: _t.tokenAddress,                // 请求参数：代币合约地址
        //     startblock: 0,                     // 请求参数：查询起始区块
        //     endblock: 999999999,               // 请求参数：查询结束区块
        //     page: _t.page,                           // 分页页码
        //     offset: _t.offset,                       // 偏移量（每页数量）
        //     sort: 'desc',                      // 请求参数：排序类别
        //   };
        // } else {
        //   data = {
        //     module: 'account',
        //     action: 'txlist',
        //     address: _t.walletAddress,
        //     startblock: 0,
        //     endblock: 999999999,
        //     page: _t.page,                           // 分页页码
        //     offset: _t.offset,                       // 偏移量（每页数量）
        //     sort: 'desc',
        //   }
        // }
        // Toast.loading("查询中...");
        // setTimeout(() => {
        //
        //
        //   etherscanHttpUtils.get(data).then((res) => {
        //     console.log(JSON.stringify(res));
        //     for (let i = 0; i < res.length; i++) {
        //
        //       if (isNotEmpty(res[i].tokenDecimal)) {
        //         res[i].value = _t.unitAmount(res[i].value, Number(res[i].tokenDecimal));
        //       } else {
        //         res[i].value = _t.unitAmount(res[i].value);
        //       }
        //       if (isEmpty(res[i].tokenSymbol)) {
        //         res[i].tokenSymbol = "Eth";
        //       }
        //
        //       let date = new Date(Number(res[i].timeStamp + "000"));
        //       res[i].date = date.toLocaleDateString().replace(/\//g, "-") + " " + date.toTimeString().substr(0, 8);
        //       res[i].desc = _t.getDesc(res[i].isContract, res[i].from, res[i].to);
        //       res[i].gasUsed = Web3Util.instance.fromWei(res[i].gasUsed, "gwei");
        //
        //       res[i].isContract = Web3Util.isContract(res[i].to);
        //       if (res[i].isContract) {
        //         let decInput = Web3Util.abiDecoder().decodeMethod(res[i].input);
        //         res[i].tokenValue = _t.unitAmount(decInput.params[1].value, res[i].tokenDecimal);
        //         res[i].tokenReceiveAddress = decInput.params[0].value;
        //         res[i].to = decInput.params[0].value;
        //       }
        //
        //       res[i].desc = _t.getDesc(res[i].isContract, res[i].from, res[i].to);
        //       res[i].title = _t.getTitle(res[i].from, res[i].to);
        //
        //     }
        //     _t.transList = res;
        //
        //     Toast.clear();
        //   });
        // }, 100);
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
