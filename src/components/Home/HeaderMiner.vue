<template>
  <div>
    <div class="area-title">
      <div class="area-tag"></div>
      挖矿项目
    </div>
    <div class="area">
      <van-swipe :autoplay="8000" indicator-color="black">
        <van-swipe-item @click="profit">
          <van-row style="height: 80px">
            <van-col span="14">
              <div class="zhuant-title">持币矿</div>
              <div class="zhuant-desc">持有TG涨收益</div>
            </van-col>
            <van-col span="8">
              <div>
                <img src="../../../static/shouyi.png" style="width: 48px;">
              </div>
            </van-col>
          </van-row>
        </van-swipe-item>

        <van-swipe-item @click="step">
          <van-row style="height: 80px">
            <van-col span="14">
              <div class="zhuant-title">行走矿</div>
              <div class="zhuant-desc">行走步数换TG</div>
            </van-col>
            <van-col span="8">
              <div>
                <img src="../../../static/walk.png" style="width: 48px;">
              </div>
            </van-col>
          </van-row>
        </van-swipe-item>

        <van-swipe-item @click="forest">
          <van-row style="height: 80px" >
            <van-col span="14">
              <div class="zhuant-title">采集能量攒TG</div>
              <div class="zhuant-desc">采集能量攒TG</div>
            </van-col>
            <van-col span="8">
              <div>
                <img src="../../../static/forest/image/qiu.png" style="width: 48px;">
                <div style="margin-top: -38px;margin-left:10px;color: #008002">TG能量</div>
              </div>
            </van-col>
          </van-row>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>
<script>
  import {openWebview, openWebviewFast} from "../../utils/webview";

  export default {
    name: 'HeaderMiner',
    props: {},
    methods: {
      forest() {
        openWebviewFast({
          url: './forest.forestIndex.html',
          id: "forest.forestIndex",
          title: "TG森林",
        })
      },
      profit() {
        openWebview(
          {
            url: "./profit.index.html",
            id: "profit.index",
            needLoaded: true,
            titleStyle: {
              titleText: "持币矿",
              titleColor: "#ffffff",
              backgroundColor: "#fa5b21",
              autoBackButton: true,
            },
            style: {render: true}
          })
      },
      step() {
        openWebviewFast({
          url: "./charitable.step.html",
          id: "charitable.step",
          titleStyle: {
            titleText: "行走矿",
          }
        }, {}, {none: true});
      },
    }
  }
</script>
<style scoped>

  .area {
    padding-top: 3%;
    padding-bottom: 3%;
    width: 100%;
    color: black;
    text-align: center;
    background-color: white;
  }

  .gongyi-box > img {
    border-radius: 3px;
    width: 100%;
    height: 115px;
  }

  .area-title {
    background-color: white;
    border-bottom: 1px solid #fafafa;
    color: black;
    font-size: 13px;
    padding-left: 15px;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .area-tag {
    margin-top: 2px;
    width: 4px;
    height: 14px;
    background-color: #3a81d1;
    float: left;
    border-radius: 1px;
    margin-right: 5px;
  }

  .zhuant-title {
    font-weight: bold;
    margin-top: 5%;
    margin-left: 28%;
  }

  .zhuant-desc {
    color: #8e8e8e;
    font-size: 12px;
    margin-left: 28%;
  }

</style>
