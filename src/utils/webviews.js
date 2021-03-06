import Vue from 'vue'
import {openWebview, openWebviewFast} from "./webview";
import {isNotEmpty} from "./globalFunc";

//全局窗口控制
Vue.prototype.webview = {
  webviewId: null,
  getWebview() {
    return plus.webview.getWebviewById(this.webviewId);
  },
  closeWebview() {
    if (isNotEmpty(this.webviewId)) {
      let ws = plus.webview.getWebviewById(this.webviewId);
      ws.close();
    }
  }
};

Vue.prototype.toDonation = function (donationId) {
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
    }
  }, {statusbar: {background: '#ffa500'}}, {
    donationId: donationId
  });
};
Vue.prototype.myCharitableWebView = function () {
  openWebviewFast({
    url: './charitable.myCharitable.html',
    id: 'charitable.myCharitable',
    title: '我的捐助',
    titleStyle: {
      titleText: "我的捐助",
      titleColor: "#ffffff",
      backgroundColor: "#ffa500",
      splitLine: {color: "#ffa500"},
      autoBackButton: true,
    }
  })
};
