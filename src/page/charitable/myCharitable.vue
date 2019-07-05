<template>
  <div style="overflow-x: hidden">
    <div class="sum">
      <van-row type="flex" justify="center">
        <van-col span="12">
          <div class="sum-box sum-box-left">捐助总额（TG）
            <div class="sum-box-num">{{totalAmount}}</div>
          </div>
        </van-col>
        <van-col span="12">
          <div class="sum-box sum-box-right">爱心次数（笔）
            <div class="sum-box-num">{{totalNum}}</div>
          </div>
        </van-col>
      </van-row>
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
  import {Cell, Row, Col} from 'vant'
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {request} from "../../utils/request";

  Vue.use(Cell).use(Row).use(Col);
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
            row.orderTitle = row.orderTitle + row.amount + "TG"
          })
        } else {
          _this.showOrderList = false;
        }

      });
    }
  }
</script>

<style scoped>
  .sum {
    height: 60px;
    background-image: -webkit-linear-gradient(top, #ff6507, orange);
    text-align: center;
    padding: 10% 5%;
  }

  .sum-box {
    width: 100%;
    font-size: 16px;
    float: left;
    padding-top: 8%;
    padding-bottom: 8%;
    background-color: white;
  }

  .sum-box-num {
    font-weight: bold;
    color: red;
    font-size: 28px;
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

  .sum-box-left {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  .sum-box-right {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
</style>
