<template>
  <div id="body">
    <div id="charitable">
      <van-swipe :autoplay="4000">
        <van-swipe-item><img src="../../assets/img/xiwangxiaoxue.jpg"/></van-swipe-item>
        <van-swipe-item><img src="../../assets/img/283f752e0292ed000fa654c4f9be774a.jpg"/></van-swipe-item>
        <van-swipe-item><img src="../../assets/img/guer20180822172931.png"/></van-swipe-item>
      </van-swipe>
    </div>
    <div id="charitable-middle">
      <div class="charitable-box charitable-box-1" v-intervalclick="{func:one2one}">
        <div class="charitable-box-inner">
          <img src="../../assets/zan.png" width="33"/>
          <div>
            一帮一
          </div>
        </div>
      </div>
      <div class="charitable-box charitable-box-1" v-intervalclick="{func:step}">
        <div class="charitable-box-inner">
          <img src="../../assets/walk.png" width="33"/>
          <div>
            感恩行
          </div>
        </div>
      </div>
      <div class="charitable-box" @click="disOpen">
        <div class="charitable-box-inner">
          <img src="../../assets/task.png" width="33"/>
          <div>
            月捐
          </div>
        </div>
      </div>
      <div class="charitable-box" @click="disOpen">
        <div class="charitable-box-inner">
          <img src="../../assets/time.png" width="33"/>
          <div>
            紧急捐助
          </div>
        </div>
      </div>
    </div>

    <div id="donation">
      <div id="donation-title">捐赠记录</div>
      <div id="donation-cell">
        <van-cell-group>
          <van-cell class="bl" v-for="(item,idx) in itemList"
                    :key="idx" :title="item.orderTitle"
                    is-link
                    @click="transInfo(item.blcokAddress)">
          </van-cell>
        </van-cell-group>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from "vue";
  import {Swipe, SwipeItem, Toast, Cell, CellGroup} from 'vant';
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {openWebview, openWebviewFast} from "../../utils/webview";

  Vue.use(Swipe).use(SwipeItem).use(Cell).use(CellGroup);

  export default {
    name: 'charitable',
    data() {
      return {
        itemList: []
      }
    },
    beforeMount() {
      let _this = this;
      request(TGCApiUrl.donationGetList, {donationType: 1, status: 200}).then(function (res) {
        _this.itemList = res;
      })
    },
    methods: {
      disOpen() {
        Toast("暂未开放")
      },
      step() {
        openWebview({
          url: "./charitable.step.html",
          id: "charitable.step",
          title: "感恩行"
        });
      },
      one2one() {
        openWebviewFast({
          url: './charitable.one2one.html',
          id: 'charitable.one2one',
          titleStyle: {
            titleText: "一帮一",
            titleColor: "#ffffff",
            backgroundColor: "#ffa500",
            splitLine: {color: "#ffa500"},
            autoBackButton: true,
            progress: {color: '#ff5c0a', height: "1%"},
          }
        });
      },
      transInfo(address) {
        openWebview({
          url: './wallet.transInfo.html',
          id: 'wallet.transInfo',
          title: '交易详情',
        }, {}, {
          tx: address
        })
      }
    }
    ,
  }
</script>
<style scoped>
  #body {
    background-color: #fafafadb;
    min-height: 812px;
  }

  #charitable-header {
    background-color: orange;
  }

  #charitable {
    width: 100%;
    height: 250px;
  }

  #charitable img {
    width: 100%;
    height: 250px;
  }

  #charitable-middle {
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
  }

  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: #F5F5F5;
  }

  .charitable-box {
    width: 78px;
    height: 70px;
    display: inline-block;
    margin-left: 2%;
    margin-top: 5%;
    background-color: #c9c9c9;
    border-radius: 4px;
  }

  .charitable-box-1 {
    background-color: #ffb2c1;
  }

  .charitable-box-inner {
    margin-top: 8px;
    display: inline;
    float: left;
    font-size: 14px;
    color: white;
    text-align: center;
    width: 75px;
  }

  .charitable-box-inner > a:link {
    color: #808080;
    text-decoration: none;
  }

  .charitable-box-inner > a:visited {
    color: #808080;
    text-decoration: none;
  }

  .charitable-box-inner > a:hover {
    color: #808080;
    text-decoration: underline;
  }

  #donation {
    text-align: left;
    margin-top: 5%;
    margin-left: 3%;
    color: #808080;
  }

  #donation-title {
    font-weight: bold;
    color: black;
  }

  #donation-cell {
    /*margin-top: 1%;*/
    height: 366px;
    overflow-y: scroll;
    color: #767676;
  }

  .see {
    color: #1d9dd2;
  }

</style>
