<template>
  <div>
    <div id="bcid">
    </div>
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
        scan: null,
        bcidShow: true,
        sendAmount: "",
        walletAddress: "",
      };
    },
    created() {
      this.startRecognize();
    },
    methods: {
      onmarked(type, result) {
        let text = '未知: ';
        switch (type) {
          case plus.barcode.QR:
            text = 'QR: ';
            break;
          case plus.barcode.EAN13:
            text = 'EAN13: ';
            break;
          case plus.barcode.EAN8:
            text = 'EAN8: ';
            break;
        }
        scan.close();
        print(result);
        //跳转转账页面
        this.gotoSend(result);
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
              // type: "transparent", // 透明渐变样式
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
      },
      startRecognize() {
        setTimeout(() => {
          scan = new plus.barcode.Barcode('bcid', [plus.barcode.QR]);
          scan.onmarked = this.onmarked;
          this.startScan()
        }, 200)
      },
      startScan() {
        scan.start();
      },
    },
    components: {},
    destroyed: function () {
      if (scan)
        scan.close()
    },
  }
</script>

<style scoped>
  #bcid {
    width: 96%;
    height: 92%;
    position: absolute;
    background: #000000;
    margin-left: 2%;
  }
</style>
