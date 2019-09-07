<template>
  <div class="asset-body">
    <div class="asset-header-botton">
      <van-row>
        <van-col span="8" v-intervalclick="{func:scan}">
          <img src="../../assets/sa.png" width="40">
        </van-col>
        <van-col span="8" v-intervalclick="{func:send}">
          <img src="../../assets/sk.png" width="41">
        </van-col>
        <van-col span="8" v-intervalclick="{func:receive}">
          <img src="../../assets/zz.png" width="37">
        </van-col>
      </van-row>
    </div>
    <div class="asset-header-botton-text">
      <van-row>
        <van-col span="8">扫一扫</van-col>
        <van-col span="8">转出</van-col>
        <van-col span="8">转入</van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
  import {openWebview} from "../../utils/webview";

  export default {
    name: 'HeaderTool',
    props: {},
    methods: {
      receive() {
        openWebview({
          url: "./wallet.receive.html",
          id: "wallet.receive",
          title: "转入积分"
        }, {}, {
          needReLoad: true,
        });
      },
      scan() {
        openWebviewFast({
          url: "./wallet.scan.html",
          id:
            "wallet.scan",
          title:
            "扫一扫",
          titleStyle: {
            backgroundColor: "#000000", // 导航栏背景色
            titleText: "扫一扫", // 导航栏标题
            titleColor: "#ffffff", // 文字颜色
            autoBackButton: true, // 自动绘制返回箭头
            splitLine: {
              // 底部分割线
              color: "#000000"
            }
          },
        });
      },
      send() {
        openWebview({
          url: "./wallet.send.html",
          id: "wallet.send",
          titleStyle: {
            titleText: "转出积分",
            autoBackButton: true,
            progress: {color: '#ff5c0a', height: "1%"},
          }
        }, {}, {
          needReLoad: true,
        });
      },
    }
  }
</script>
<style scoped>

  .asset-body {
    background-color: white;
    padding-top: 5%;
    padding-bottom: 3%;
    text-align: center;
  }

  .asset-header-botton {
    color: #8e8e8e;
  }

  .asset-header-botton-text {
    color: #8e8e8e;
    font-size: 13px;
  }

  .gongyi-box > img {
    border-radius: 3px;
    width: 100%;
    height: 115px;
  }

</style>
