<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div v-if="tx">
        <van-cell-group>
          <van-cell title="交易状态" :label="stateDesc"/>
          <van-cell title="交易失败原因" :label="errDescription" v-if="state==='1'"/>
          <van-cell title="交易哈希值" :label="transInfo.blockHash"/>
          <van-cell title="失败区块高度" :label="formatHexNumber(transInfo.blockNumber)"/>
          <van-cell title="发送方" :label="transInfo.from"/>
          <van-cell title="接收方" :label="transInfo.to"/>
          <van-cell title="实际支付的矿工费(ETH)" :label="formatHexNumber(gasUsed)"/>
          <van-cell title="随机数" :label="formatHexNumber(transInfo.nonce)"/>
          <!--<van-cell title="燃料限制" :value="transInfo.gas"/>-->
          <van-cell title="交易燃料费用(ETH)" :label="formatGas(transInfo.gasPrice)"/>
          <!--<van-cell title="交易状态" :value="transInfo.blockNumber"/>-->
        </van-cell-group>
      </div>
      <div v-else>无效 交易哈希值</div>
    </van-pull-refresh>
  </div>
</template>
<script>
  import Vue from 'vue';
  import etherscanHttpUtils from "@/utils/web3Util/etherscanHttpUtils";
  import {isEmpty, isNotEmpty} from "@/utils/globalFunc";
  import {Toast, Cell, CellGroup, PullRefresh} from "vant";
  import web3Util from "../../utils/web3Util/Web3Util";

  Vue.use(Cell).use(CellGroup).use(Toast).use(PullRefresh);
  export default {
    data() {
      return {
        tx: '',
        state: '',
        stateDesc: '',
        errDescription: '',
        isLoading: false,
        gasUsed: '0x',
        transInfo: {
          blockHash: "0x",
          blockNumber: "0x",
          from: "0x",
          gas: "0x",
          gasPrice: "0x",
          hash: "0x",
          input: "0x",
          nonce: "0x",
          to: "0x",
          transactionIndex: "0x",
          value: "0x",
          v: "0x",
          r: "0x",
          s: "0x",
        },
      }
    },
    methods: {
      onRefresh() {
        let _this = this;
        setTimeout(() => {
          _this.queryData();
          _this.isLoading = false;
        }, 500);
      },
      formatHexNumber(hex) {
        if (isNotEmpty(hex)) {
          return parseInt(hex.replace("0x", ""), 16) + ''
        }
        return hex;
      },
      formatGas(gas) {
        if (isNotEmpty(gas)) {
          return web3Util.instance.fromWei(this.formatHexNumber(gas), 'gwei') + ''
        }
        return gas;
      },
      queryReceipt() {
        let tx = this.tx;
        let _this = this;
        etherscanHttpUtils.get({
          module: 'proxy',
          action: 'eth_getTransactionReceipt',
          txhash: tx
        }, false).then(res => {
          if (isEmpty(res)) {
            setTimeout(() => {
              _this.queryReceipt();
            }, 500);
            return false;
          }
          _this.gasUsed = res.gasUsed
        });
      },
      queryGetstatus() {
        let tx = this.tx;
        let _this = this;

        etherscanHttpUtils.get({
          module: 'transaction',
          action: 'getstatus',
          txhash: tx
        }, false).then(res => {
          if (isEmpty(res)) {
            setTimeout(() => {
              _this.queryGetstatus();
            }, 500);
            return false;
          }
          if (isNotEmpty(res.isError)) {
            _this.state = res.isError;
            let state = Number(res.isError);
            if (state === 1) {
              _this.stateDesc = '交易失败';
              switch (res.errDescription) {
                case "out of gas":
                  _this.errDescription = '燃料费不足，请提高燃料费重试';
                  break;
                default:
                  _this.errDescription = res.errDescription;
                  break;
              }
            }
            else if (state === 0) {
              _this.stateDesc = '交易成功';
              _this.errDescription = res.errDescription;
            }
          }
        })
      },
      queryTrancaction() {
        let tx = this.tx;
        let _this = this;

        etherscanHttpUtils.get({
          module: 'proxy',
          action: 'eth_getTransactionByHash',
          txhash: tx
        }, false).then(res => {
          if (isEmpty(res)) {
            setTimeout(() => {
              _this.queryTrancaction();
            }, 500);
            return false;
          }
          _this.transInfo = res;
        });
      },
      queryData() {
        let tx = this.tx;
        let _this = this;

        _this.queryTrancaction();
        _this.queryGetstatus();
        _this.queryReceipt();


      }
    },
    created() {
      let _this = this;
      let ws = plus.webview.currentWebview();
      this.tx = ws.tx;
      Toast.loading({
        message: '查询中...',
        duration: 0
      });
      if (isNotEmpty(ws.tx)) {
        _this.queryData();

      }
    },
  }

</script>
<style scoped>

</style>
