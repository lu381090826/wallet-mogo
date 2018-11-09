import {openWebview, openWebviewFast} from "./webview";
//全局窗口控制
export default function (Vue, options) {
  Vue.prototype.myCharitableWebView = function () {
    openWebview({
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
