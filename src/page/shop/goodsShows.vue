<template>
  <div class="shop-body">
    <div class="tuijian">
      <div class="goods-title">
        <div class="goods-title-inner">
          <img src="@/assets/fengexian40.png" width="40">重磅优惠<img
          src="@/assets/fengexian40.png" width="40">
        </div>
      </div>
      <div class="goods-row goods-row-1">
        <van-row type="flex" justify="center">
          <van-col span="8" v-for="(item,k) in itemList1.slice(0, 3)" :key="k">
            <div class="img-box" v-intervalclick="{func:goodsDetail,skuNo:item.skuNo}">
              <img :src="item.img" width="100px"></div>
          </van-col>
        </van-row>
        <van-row type="flex" justify="center">
          <van-col span="8" v-for="(item,k) in itemList1.slice(0, 3)" :key="k">
            <div class="sku-name">{{item.skuName}}</div>
          </van-col>
        </van-row>
        <van-row type="flex" justify="center">
          <van-col span="8" v-for="(item,k) in itemList1.slice(0, 3)" :key="k">
            <div class="goods-row-1-price">
              <div>
                <span class="am">{{item.price}}</span><span class="tg-sym">{{item.units}} </span>
              </div>
              <div>
                <span class="tgtocn">≈{{tgToCN(item.price)}}</span>
              </div>
              <div>
                <span class="de"> {{item.originPriceCn}} ￥</span>
              </div>
            </div>
          </van-col>
        </van-row>
        <van-row type="flex" justify="center">
          <van-col span="8" v-for="(item,k) in itemList1.slice(0, 3)" :key="k">
            <span class="sl">已售{{item.sellNum}}件</span>
          </van-col>
        </van-row>
      </div>
      <div class="goods-row goods-row-1">
        <van-row type="flex" justify="center">
          <van-col span="8" v-for="(item,k) in itemList1.slice(3, 6)" :key="k">
            <div class="img-box" v-intervalclick="{func:goodsDetail,skuNo:item.skuNo}"><img :src="item.img"
                                                                                            width="100px"></div>
          </van-col>
        </van-row>
        <van-row type="flex" justify="center">
          <van-col span="8" v-for="(item,k) in itemList1.slice(3, 6)" :key="k">
            <div class="sku-name">{{item.skuName}}</div>
          </van-col>
        </van-row>
        <van-row type="flex" justify="center">
          <van-col span="8" v-for="(item,k) in itemList1.slice(3, 6)" :key="k">
            <div class="goods-row-1-price">
              <div>
                <span class="am">{{item.price}}</span><span class="tg-sym">{{item.units}} </span>
              </div>
              <div>
                <span class="tgtocn">≈{{tgToCN(item.price)}}</span>
              </div>
              <div>
                <span class="de"> {{item.originPriceCn}} ￥</span>
              </div>
            </div>
          </van-col>
        </van-row>
        <van-row type="flex" justify="center">
          <van-col span="8" v-for="(item,k) in itemList1.slice(0, 3)" :key="k">
            <span class="sl">已售{{item.sellNum}}件</span>
          </van-col>
        </van-row>
      </div>

    </div>

    <div class="blank-space"></div>

    <div class="half-sell half-sell-title">
      <img src="@/assets/fengexian40.png" width="40">
      限量超低折扣
      <img src="@/assets/fengexian40.png" width="40">
    </div>
    <div class="half-sell half-sell-con">
      <div class="goods-row goods-row-1 gun">
        <van-row type="flex" justify="space-around" gutter="5">
          <van-col span="4" v-for="(item,k) in itemList2" :key="k">
            <div class="half-sell-in">
              <div class="img-box" v-intervalclick="{func:goodsDetail,skuNo:item.skuNo}">
                <img :src="item.img" width="100px"></div>
              <div class="sku-name">{{item.skuName}}</div>
              <div class="goods-row-1-price">
                <div>
                  <span class="am">{{item.price}}</span><span class="tg-sym">{{item.units}} </span>
                </div>
                <div>
                  <span class="tgtocn">≈{{tgToCN(item.price)}}</span>
                </div>
                <div>
                  <span class="de"> {{item.originPriceCn}} ￥</span>
                </div>
              </div>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="blank-space"></div>
    <div class="shops-footer"></div>

  </div>
</template>

<script>
  import Vue from "vue";
  import {Row, Col} from 'vant';
  import {openWebview} from "@/utils/webview";
  import {request} from "@/utils/request";
  import TGCApiUrl from "@/utils/constants/TGCApiUrl";
  import {isNotEmptyObject} from "../../utils/globalFunc";
  import MathUtil from "../../utils/MathUtil";

  Vue.use(Row).use(Col);
  export default {
    data() {
      return {
        itemList1: [],
        itemList2: [],
        itemList3: [],
        rate: 1,
      }
    },
    created() {
      let _this = this;
      plus.key.addEventListener('backbutton', function () {
        let parent = plus.webview.currentWebview().parent();
        if (isNotEmptyObject(parent)) {
          parent.close();
        }
      });

      request(TGCApiUrl.buyTgDollarRate).then(res => {
        _this.rate = res;
      });

      request(TGCApiUrl.goodsHome).then(res => {
        _this.itemList1 = res[0];
        _this.itemList2 = res[1];
        _this.itemList3 = res[2];
      });
    },
    methods: {
      goodsDetail(skuNo) {
        openWebview({
          url: "./shop.detail.html",
          id: "shop.detail",
          needLoaded: true,
          titleStyle: {
            backgroundColor: "#f7f7f7", // 导航栏背景色
            titleText: "商品详情", // 导航栏标题
            titleColor: "#666", // 文字颜色
            type: "transparent", // 透明渐变样式
            autoBackButton: true, // 自动绘制返回箭头
            splitLine: {
              // 底部分割线
              color: "#cccccc"
            },
          }
        }, {}, {skuNo: skuNo});
      },
      tgToCN(tgPrice) {
        return MathUtil.accMul(this.rate, tgPrice).toFixed(2) + "￥"
      }
    }
  }
</script>

<style scoped>
  .goods-row {
    padding: 3% 3%;
    text-align: left;
  }

  .goods-row-1-price {
    font-size: 14px;
    color: #ed292f;
  }

  .am {
  }

  .de {
    color: #939393;
    font-size: 10px;
  }

  .tg-sym {
    font-size: 10px;
  }

  .sl {
    font-size: 10px;
    color: #939393;
  }

  .goods-title {
    text-align: center;
    width: 100%;
  }

  .goods-title-inner {
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    width: 50%;
    font-size: 18px;
    padding-top: 1%;
    padding-bottom: 1%;
    margin: 5% auto;
  }

  .half-sell-con {
    padding: 3% auto;
    overflow-x: scroll;
    white-space: nowrap;
  }

  .shop-body {
    white-space: normal;
  }

  .gun {
    display: inline-block;
  }

  .half-sell {
    background: #fbdc3f;
    background: -webkit-linear-gradient(left, #fbdc3f, #f9c53e);
    background: -o-linear-gradient(right, #fbdc3f, #f9c53e);
    background: -moz-linear-gradient(right, #fbdc3f, #f9c53e);
    background: linear-gradient(to right, #fbdc3f, #f9c53e);
  }

  .half-sell-title {
    width: 100%;
    font-size: 18px;
    padding-top: 3%;
    text-align: center;

    color: orangered;
    font-weight: bold;
  }

  .half-sell-in {
    background-color: white;
    padding: 3%;
    height: 180px;
  }

  .shops-footer {
    height: 48px;
  }

  .img-box {
    width: 100px;
    height: 110px;
  }

  .sku-name {
    overflow-x: hidden;
    font-size: 11px;
  }

  .tgtocn {
    color: #939393;
    font-size: 10px;
  }

</style>
