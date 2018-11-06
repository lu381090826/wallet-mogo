<template>
  <div style="overflow-x: hidden">
    <div class="sum">
      <div class="toux">
        <img src="../../assets/User_performance.png" width="64">
        {{userName}}
      </div>
      <div>
        <div class="sum-box">
          捐助总额（TG）
          <div class="sum-box-num">{{totalAmount}}</div>
        </div>

        <div class="sum-box">
          爱心次数（笔）
          <div class="sum-box-num">{{totalNum}}</div>
        </div>
      </div>
    </div>

    <div class="order_list">
      <div class="order_list_title">我参与的公益</div>
      <div v-show="showOrderList">
        <van-cell v-for="(item,idx) in orderList" :key="idx" :title="item.orderTitle" is-link></van-cell>
      </div>
      <div class="never_donation" v-show="!showOrderList">暂未参与公益，
        <a>去看看</a>
        ？
      </div>
    </div>

  </div>
</template>

<script>
  import Vue from "vue";
  import {Cell} from 'vant'
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {request} from "../../utils/request";

  Vue.use(Cell);
  export default {
    name: "myCharitable",
    data() {
      return {
        userName: plus.storage.getItem("userName"),
        totalAmount: 0,
        totalNum: 0,
        orderList: [],
        showOrderList: true
      }
    },
    methods: {},
    created() {
      let _this = this;
      request(TGCApiUrl.donationGetTotalAmount, {}).then(function (res) {
        if (res !== null) {
          _this.totalAmount = res;
        }
      });
      request(TGCApiUrl.donationGetTotalNum, {}).then(function (res) {
        _this.totalNum = res;
      });
      request(TGCApiUrl.donationGetList, {
        uid: plus.storage.getItem("uid"),
      }).then(function (res) {
        _this.orderList = res;
        if (_this.orderList.length > 0) {
          _this.orderList.forEach(function (row) {
            row.orderTitle = row.orderTitle + row.amount + "TGC"
          })
        } else {
          _this.showOrderList = false;
        }

      });
    }
  }
</script>

<style scoped>
  #header {
    background-color: orange;
  }

  .toux {
    text-align: center;
    margin-left: -16%;
    margin-bottom: 1%;
  }

  .sum {
    width: 110%;
    margin-left: -5%;
    height: 120px;
    background-image: -webkit-linear-gradient(top, orange, red);
    text-align: left;
    padding: 10%;
  }

  .sum-box {
    width: 33.5%;
    background-color: white;
    float: left;
    margin-left: 2%;
    padding: 2%;
    font-size: 12px;
  }

  .sum-box-num {
    font-weight: bold;
    color: red;
    font-size: 21px;
  }

  .order_list {
    margin-top: 10%;
    text-align: left;
  }

  .order_list_title {
    font-weight: bold;
    font-size: 17px;
    margin-bottom: 5%;
  }

  .never_donation {
    color: #8c8c8c;
    margin-left: 10%;
  }

  .never_donation > a:-webkit-any-link {
    text-decoration: none;
    color: dodgerblue;
  }
</style>
