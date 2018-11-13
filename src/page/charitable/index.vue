<template>
  <div id="body">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div id="charitable">
        <van-swipe :autoplay="4000">
          <van-swipe-item v-intervalclick="{func:toDonation,donationId:1}">
            <img src="@/assets/img/guer20180822172931.png"/>
          </van-swipe-item>

          <van-swipe-item v-intervalclick="{func:toDonation,donationId:2}">
            <img src="@/assets/img/283f752e0292ed000fa654c4f9be774a.jpg"/>
          </van-swipe-item>
        </van-swipe>
      </div>

      <div style="margin-top: 4%">
        <van-row type="flex" justify="center">
          <van-col span="6">
            <div class="charitable-box-inner" v-intervalclick="{func:one2one}">
              <img src="../../assets/zan.png" width="33"/>
              <div>
                一帮一
              </div>
            </div>
          </van-col>
          <van-col span="6">
            <div class="charitable-box-inner" v-intervalclick="{func:step}">
              <img src="../../assets/walk.png" width="33"/>
              <div>
                感恩行
              </div>
            </div>
          </van-col>
          <van-col span="6">
            <div class="charitable-box-inner" @click="disOpen">
              <img src="../../assets/task.png" width="33"/>
              <div>
                月捐
              </div>
            </div>
          </van-col>
          <van-col span="6">
            <div class="charitable-box-inner" @click="disOpen">
              <img src="../../assets/time.png" width="33"/>
              <div>
                紧急捐助
              </div>
            </div>
          </van-col>
        </van-row>
      </div>

      <div id="donation">
        <div id="donation-title">近期捐赠</div>
        <div id="donation-cell" style="margin-top: 2%">
          <van-cell-group>
            <van-cell class="bl" v-for="(item,idx) in itemList"
                      :key="idx" :title="item.orderTitle"
                      is-link
                      @click="transInfo(item.orderBladdress)"
                      :label="item.label"
            >
            </van-cell>
          </van-cell-group>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
  import Vue from "vue";
  import {Swipe, SwipeItem, Toast, Cell, CellGroup, PullRefresh, Row, Col} from 'vant';
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {openWebview, openWebviewFast} from "../../utils/webview";

  Vue.use(Swipe).use(SwipeItem).use(Cell)
    .use(CellGroup).use(PullRefresh)
    .use(Row).use(Col);

  export default {
    name: 'charitable',
    data() {
      return {
        itemList: [],
        isLoading: false,
      }
    },
    created() {
      let _this = this;
      _this.getData();
    },
    methods: {
      onRefresh() {
        this.getData();
        setTimeout(() => {
          Toast('刷新成功');
          this.isLoading = false;
        }, 500);
      },
      getData() {
        let _this = this;
        request(TGCApiUrl.donationGetList, {donationType: 1, status: 200}).then(function (res) {
          _this.itemList = res;
          if (_this.itemList.length > 0) {
            _this.itemList.forEach(function (row) {
              row.orderTitle = row.orderTitle + row.amount + "TG";
              row.label = row.createTime.substring(0, 10) + "   捐款区块：" + row.orderBladdress.substring(0, 10) + "..."
            })
          } else {
            _this.showOrderList = false;
          }
        });
      },
      toDonation(donationId) {
        openWebview({
          url: './charitable.one2oneDonation.html',
          id: 'charitable.one2oneDonation',
          needLoaded: true,
          titleStyle: {
            type: "transparent",
            titleText: "一帮一捐助",
            titleColor: "#ffffff",
            backgroundColor: "#ffa500",
            splitLine: {color: "#ffa500"},
            autoBackButton: true,
            buttons: [{type: 'share', float: 'right'}]
          }
        }, {}, {
          donationId: donationId
        });
      },
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
    background-color: white;
  }

  #charitable {
    width: 100%;
    height: 250px;
  }

  #charitable img {
    width: 100%;
    height: 250px;
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
    color: #767676;
  }

  .see {
    color: #1d9dd2;
  }

  .charitable-box-inner {
    text-align: center;
    padding: 8px;
    color: #6f6f6f;
  }

  .charitable-box-inner:active {
    border-radius: 5px;
    background-color: #eeeeee;
  }
</style>
