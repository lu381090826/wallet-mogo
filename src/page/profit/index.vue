<template>
  <div style="overflow-x: hidden">
    <div class="sum">
      <div class="toux">
        <div style="font-size: 10px;color: white">
          昨日收益（TG）
        </div>
        <div style="font-size: 32px;color: white;font-weight: bold">
          {{yestadayProfit}}
        </div>
        <div>
          总TG {{totalTGBalance}}
        </div>
      </div>
      <div class="sum-box-coll">
        <div class="sum-box">
          累计收益（TG）
          <div class="sum-box-num">{{totalProfit}}</div>
        </div>

        <div class="sum-box">
          万份收益（TG）
          <div class="sum-box-num">{{tenthousandProfit}}</div>
        </div>

        <div class="sum-box">
          七日年化（%）
          <div class="sum-box-num">{{sevenDayProfit}}</div>
        </div>
      </div>
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
  import {Toast} from 'vant';
  import MathUtil from "../../utils/MathUtil";
  import Web3Util from "../../utils/web3Util/Web3Util";
  import TGCConfig from "../../utils/constants/tgcConfig";
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import Progress from "../../components/Progress";

  Vue.use(Toast);

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
  #header {
    background-color: #ffcd20;
    z-index: 1000;
  }

  .toux {
    text-align: center;
    margin-left: -16%;
    margin-bottom: 5%;
    color: white;
  }

  .sum {
    width: 110%;
    margin-left: -5%;
    height: 120px;
    background-image: -webkit-linear-gradient(top, #ffd81d, #ff5404);
    /*margin-top: -10%;*/
    text-align: center;
    padding: 10%;
  }

  .sum-box-coll {
    margin-top: 7%;
    margin-left: -7%;
    left: 0;
    right: 0;
    width: 111%;
  }

  .sum-box {
    width: 26%;
    background-color: #ff7c0c;
    float: left;
    padding: 2%;
    font-size: 12px;
    color: #f5f5f5;
  }

  .sum-box-num {
    color: white;
    font-size: 19px;
    margin-top: 5%;
    margin-bottom: -3%;
  }

  .never_donation > a:-webkit-any-link {
    text-decoration: none;
    color: dodgerblue;
  }

  a:-webkit-any-link {
    cursor: pointer;
    text-decoration: none;
  }

  .tabbar {
    height: 50px;
    border-top: 0.5px solid #eeeeee;
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


</style>
