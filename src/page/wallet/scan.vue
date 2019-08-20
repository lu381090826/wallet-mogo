<template>
  <div class="body scan-body">
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
      setTimeout(()=>{
        t.createBarcode();
      },10)
    },
    methods: {
      // 扫码成功回调
      onmarked(type, result) {
        this.gotoSend(result);
      },
      // 创建Barcode扫码控件
      createBarcode() {
        scan = new plus.barcode.Barcode('bcid', [plus.barcode.QR], {
          scanbarColor: "#069bff",
          frameColor: "#0083ff",
        });
        scan.onmarked = this.onmarked;
        scan.start()
      },
      gotoSend(walletAddress) {
        //预加载窗口
        openWebview({
            url: "./wallet.send.html",
            id: "wallet.send",
            titleStyle: {
              titleText: "转出积分",
              autoBackButton: true,
              progress: {color: '#ff5c0a', height: "1%"},
            }
          }
          , {}, {
            receiveAddress: walletAddress,
            tokenAddress: "",
            sendAmount: ""
          });
      }
    },
    destroyed: function () {
      if (scan) {
        scan.close()
      }
    },
  }
</script>

<style scoped>
  * {
    -webkit-user-select: none;
  }

  .scan-body {
    background-color: black;
  }

  #bcid {
    background: #000000;
    width: 100%;
    top: 0;
    left: 0;
  }
</style>
