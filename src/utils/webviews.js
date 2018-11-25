import {openWebview, openWebviewFast} from "./webview";
//全局窗口控制
export default function (Vue, options) {
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
        buttons: [{type: 'share', float: 'right'}]
      }
    }, {}, {
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
        progress: {color: '#ff5c0a', height: "1%"}
      }
    })
  };
};
