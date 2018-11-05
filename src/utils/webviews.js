import Vue from "vue";
import {openWebviewFast} from "./webview";

export default function (Vue, options) {
  Vue.prototype.myCharitableWebView = function () {
    openWebviewFast({
      url: './charitable.myCharitable.html',
      id: 'charitable.myCharitable',
      title: '我的捐助',
      showWaiting: true,
      titleStyle: {
        titleText: "我的捐助",
        titleColor: "#ffffff",
        backgroundColor: "#ffa500",
        splitLine: {color: "#ffa500"},
        autoBackButton: true,
        progress: {color: '#ff5c0a', height: "1%"}
      }
    })
  };
};
