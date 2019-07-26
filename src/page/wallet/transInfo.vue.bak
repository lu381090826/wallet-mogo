<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div v-if="tx">
        <van-cell-group>
          <van-cell title="交易地址" :label="tx" :clickable="true" @click="doCopy"/>
          <van-cell title="交易状态" :label="stateDesc"/>
          <van-cell title="交易失败原因" :label="errDescription" v-if="state==='1'"/>
          <van-cell title="交易哈希值" :label="transInfo.blockHash"/>
          <van-cell title="区块高度" :label="formatHexNumber(transInfo.blockNumber)"/>
          <van-cell title="发送方" :label="transInfo.from"/>
          <van-cell title="接收方" :label="transInfo.to"/>
          <van-cell title="实际支付的矿工费(ETH)" :label="formatETH(gasUsed)"/>
          <van-cell title="随机数" :label="formatHexNumber(transInfo.nonce)"/>
          <!--<van-cell title="燃料限制" :value="transInfo.gas"/>-->
          <van-cell title="交易燃料费用(ETH)" :label="formatEther(transInfo.gasPrice)"/>
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
  import VueClipboard from 'vue-clipboard2'


  Vue.use(VueClipboard);
  Vue.use(Cell).use(CellGroup).use(Toast).use(PullRefresh);
  export default {
    data() {
      return {
        tx: '',
        state: '',
        stateDesc: '正在处理...',
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
      doCopy() {
        let _this = this;
        _this.$copyText(_this.tx).then(function (e) {
          Toast.success({
            message: '复制成功',
            position: 'bottom',
          })
        }, function (e) {
        })
      },
      onRefresh() {
        let _this = this;
        _this.queryData();
        _this.isLoading = true;
        setTimeout(() => {
          _this.isLoading = false;
        }, 1000);
      },
      formatHexNumber(hex) {
        if (isNotEmpty(hex)) {
          return web3Util.instance.utils.hexToNumberString(hex);
        }
        return hex;
      },
      formatETH(eth) {
        if (isNotEmpty(eth)) {
          return web3Util.instance.eth.utils.fromWei(this.formatHexNumber(eth), 'gwei') + ''
        }
        return gas;
      },
      formatEther(val) {
        if (isNotEmpty(val)) {
          return web3Util.instance.eth.utils.fromWei(this.formatHexNumber(val), 'ether') + ''
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
            _this.queryReceipt();
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
            _this.queryGetstatus();
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
            _this.queryTrancaction();
            return false;
          }
          _this.transInfo = res;
          // {"blockHash":"0xd3a2734c3f1f9bc2c33af344c5b9afc36fc3c2bdef383cba027c246a4d804a1c","blockNumber":"0x7d1bdb","from":"0x66c5dffb2ab7f3149d8fd1d78f3f525f8debe130","gas":"0x493e0","gasPrice":"0x59682f00","hash":"0xd594d35a5f7e32c23469038fa55f98b32793f2238c30da73438c8e7ac0764887","input":"0xa9059cbb0000000000000000000000003e32fe42434a039ad630c4cf67e5378a9aae6e3600000000000000000000000000000000000000000000000000000000000003e8","nonce":"0x21b","to":"0x95ff62d03d45e29b20e497d0fd526d8d2d387804","transactionIndex":"0x5e","value":"0x0","v":"0x1c","r":"0x2e1fc04225191c134536435698f84a9b886389578ec7874ddfb650f321573d66","s":"0x37824badea8fc894a360e482bc7acdfe52b77ccb51857366c09443c7e6d13ba7"}
        });
      },
      queryData() {
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
      if (isNotEmpty(ws.tx)) {
        _this.queryData();

      }
    },
  }

</script>
<style scoped>

</style>
