<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div v-if="tx">
        <van-cell-group>
          <van-cell title="交易地址" :label="tx" :clickable="true" @click="doCopy"/>
          <van-cell title="交易状态" :label="transInfo.stateDesc"/>
          <!--<van-cell title="交易失败原因" :label="errDescription" v-if="state==='1'"/>-->
          <van-cell title="交易时间" :label="transInfo.time"/>
          <van-cell title="区块高度" :label="transInfo.blockNumber"/>
          <van-cell title="发送方" :label="transInfo.from"/>
          <van-cell title="接收方" :label="transInfo.to"/>
          <van-cell title="Eth交易数" :label="transInfo.value"/>
          <div v-if="tokenInfo">
            <van-cell title="积分名称" :label="tokenInfo.name"/>
            <van-cell title="交易积分个数" :label="operations.value/Math.pow(10,tokenInfo.decimals)"/>
          </div>
          <van-cell title="实际支付的矿工费(ETH)" :label="formatETH(transInfo.gasUsed)"/>
          <van-cell title="燃料限制" :label="formatETH(transInfo.gasLimit)"/>
        </van-cell-group>
      </div>
      <div v-else>无效 交易哈希值</div>
    </van-pull-refresh>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {isEmpty, isNotEmpty} from "@/utils/globalFunc";
  import {Toast, Cell, CellGroup, PullRefresh} from "vant";
  import web3Util from "../../utils/web3Util/Web3Util";
  import VueClipboard from 'vue-clipboard2'
  import ethplorerUtils from "../../utils/web3Util/ethplorerUtils";
  import {timestampToDate} from "../../utils/tools";


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
          stateDesc: '',
        },
        tokenInfo: null,
        operations: null,
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
          return web3Util.instance.eth.utils.fromWei(web3Util.instance.utils.toBN(eth), 'gwei') + ''
        }
        return 0;
      },
      queryData() {
        let tx = this.tx;
        let _this = this;

        ethplorerUtils.get('/getTxInfo/' + tx).then(res => {
          if (isNotEmpty(res.error)) {
            if (isNotEmpty(res.error.code) && res.error.code === 404) {
              _this.stateDesc = '暂未查到交易，请稍后再次查询。'
            }
          }
          _this.transInfo = res;
          if (res.success === null) {
            _this.transInfo.stateDesc = '交易还在处理中...';
          } else {
            _this.transInfo.stateDesc = (res.success === true ? '成功' : '失败');
          }
          _this.transInfo.time = timestampToDate(res.timestamp);
          if (isNotEmpty(_this.transInfo.operations)) {
            let operations =_this.transInfo.operations[0];
            _this.tokenInfo = operations.tokenInfo;
            _this.operations = operations;
            _this.transInfo.to = operations.to;
            _this.transInfo.from = operations.from;
          }
        });
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
