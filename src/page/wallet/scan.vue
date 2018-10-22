<template>
  <div class="body">
    <div id="bcid" :style="{height:height}"></div>
  </div>
</template>
<script>
  import {
    openWebview,
    openWebviewFast,
    preLoad,
    showWebviewById
  } from "@/utils/webview";

  let scan = null;
  export default {
    data() {
      return {
        bcidShow: true,
        sendAmount: "",
        walletAddress: "",
        height: document.documentElement.clientHeight + "px"
      }
        ;
    },
    created() {
      let t = this;

      function plusReady() {
        t.createBarcode();
      }

      if (window.plus) {
        plusReady();
      } else {
        document.addEventListener("plusready", plusReady, false);
      }

    },
    methods: {
      // 扫码成功回调
      onmarked(type, result) {
        console.log(result);
        scan.close();
      },
      // 创建Barcode扫码控件
      createBarcode() {
        setTimeout(() => {
          scan = new plus.barcode.Barcode('bcid', [plus.barcode.QR], {
            top: "100px",
            scanbarColor: "#069bff",
            frameColor: "#0083ff",
          });
          scan.onmarked = this.onmarked;
          scan.start()
        }, 200)
      },
      gotoSend(walletAddress) {
        let t = this;
        //预加载窗口
        preLoad([{
          url: "./wallet.send.html",
          id: "wallet.send",
          title: "转账",
          style: {
            titleNView: {
              backgroundColor: "#f7f7f7", // 导航栏背景色
              titleText: "转账", // 导航栏标题
              titleColor: "#666", // 文字颜色
              type: "transparent", // 透明渐变样式
              autoBackButton: true, // 自动绘制返回箭头
              splitLine: {
                // 底部分割线
                color: "#cccccc"
              }
            },
            popGesture: "none"
          },
          extras: {
            receiveAddress: walletAddress,
            tokenAddress: "",
            sendAmount: ""
          }
        }]);

        showWebviewById("wallet.send");
      }
    },
    destroyed: function () {
      if (scan)
        scan.close()
    },
  }
</script>

<style scoped>
  * {
    -webkit-user-select: none;
  }

  #bcid {
    background: #000000;
    width: 100%;
    top: 0;
    left: 0;
  }
</style>
