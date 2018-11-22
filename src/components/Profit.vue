<template>
  <div style="overflow-x: hidden">
    <div class="profit-head">
      <van-row type="flex" justify="center" class="profit-head-row">
        <van-col>
          <div><span style="font-size: 14px;color: #fea879">昨日收益(TG)</span></div>
          <div><span style="font-size: 35px;color: #fbfbfc">{{yestadayProfit}}</span></div>
          <div><span style="font-size: 15px;color: #f1c7ae">总TG{{totalTGBalance}}</span></div>
        </van-col>
      </van-row>
      <van-row type="flex" justify="center" class="profit-head-row">
        <van-col span="8">
          <div class="profit-head-title">累计收益（TG）</div>
          <div>{{totalProfit}}</div>
        </van-col>
        <van-col span="8">
          <div class="profit-head-title">万份收益（TG）</div>
          <div>{{tenthousandProfit}}</div>
        </van-col>
        <van-col span="8">
          <div class="profit-head-title">七日年化（%）</div>
          <div>{{sevenDayProfit}}</div>
        </van-col>
      </van-row>
    </div>

    <div style="margin-left: 5%;margin-right: 5%">
      <h3 v-if="profitList.length>0">收益记录</h3>
      <h3 v-if="profitList.length===0">暂无收益记录</h3>

      <Progress class="progress"
                v-for=" (i , k) in profitList"
                :key="k"
                :date="i.finishTime"
                :percent="getProgressValue(i.profitValue)"
                :profit="i.profitValue">

      </Progress>
    </div>

  </div>
</template>

<script>
  import Vue from "vue";
  import {Toast, Row, Col} from 'vant';
  import MathUtil from "@/utils/MathUtil";
  import Web3Util from "@/utils/web3Util/Web3Util";
  import TGCConfig from "@/utils/constants/tgcConfig";
  import {request} from "@/utils/request";
  import TGCApiUrl from "@/utils/constants/TGCApiUrl";
  import Progress from "@/components/Progress";

  Vue.use(Row)
    .use(Col)
    .use(Toast);

  export default {
    data() {
      return {
        userName: plus.storage.getItem("userName"),
        totalProfit: "---",
        yestadayProfit: "---",
        tenthousandProfit: "---",
        sevenDayProfit: "---",
        totalTGBalance: "---",
        profitList: [],
        minProfit: "",
        maxProfit: "",
      }
    },
    methods: {
      getProgressValue(value) {
        return MathUtil.accMul((Number(value) / Number(MathUtil.accMul(this.maxProfit, 1.3))), 100);
      }
    },
    beforeMount() {
      let t = this;
      Web3Util.getContractBalance(TGCConfig.tokenAddress).then(res => {
        t.totalTGBalance = res;
      });
      request(TGCApiUrl.getProgitInfo, {walletAddress: plus.storage.getItem("walletAddress")}).then(function (res) {
        t.tenthousandProfit = res.tenthousandProfit;
        t.sevenDayProfit = res.sevenDayProfit;
        t.totalProfit = res.totalProfit;
        t.yestadayProfit = res.yestadayProfit;
        t.profitList = res.profitList;
        t.minProfit = res.minProfit;
        t.maxProfit = res.maxProfit;
      });
    },
    components: {
      Progress
    }
  }
</script>
<style scoped>
  .profit-head {
    width: 100%;
    background-image: -webkit-linear-gradient(top, #fa5b21, #fa5b21);
    color: white;
    text-align: center;
  }

  .never_donation > a:-webkit-any-link {
    text-decoration: none;
    color: dodgerblue;
  }

  a:-webkit-any-link {
    cursor: pointer;
    text-decoration: none;
  }

  .tabbar >>> .mint-tab-item-label {
    font-size: 19px;
    line-height: 38px;
    height: 30px;
  }

  .tabbar >>> .mint-tab-item.is-selected {
    color: dodgerblue;
  }

  .progress {
    margin-top: 5%;
  }

  .profit-head-title {
    font-size: 12px;
    color: #f79e61;
  }

  .profit-head-row {
    padding-top: 3%;
    padding-bottom: 3%;
  }
</style>
