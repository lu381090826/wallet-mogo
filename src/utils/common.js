/**
 * 该js为所有页面都必须加载的js
 * 可以用于全局添加某功能
 */
import FastClick from "fastclick";
import "./globalFunc";

// 去除300ms延迟

document.addEventListener(
  "DOMContentLoaded",
  function () {
    FastClick.attach(document.body);
  },
  false
);

document.addEventListener("plusready", plusReady, false);

// 自动关闭窗口 可根据具体逻辑自定义
function plusReady() {
  console.log("plus ready");

  plus.key.addEventListener(
    "backbutton",
    function () {
      var ws = plus.webview.currentWebview();
      if (ws.webviewPreload === true) {
        plus.webview.hide(ws, 'auto');
      } else {
        plus.webview.close(ws, 'auto');
      }
    },
    false
  );

  //仅支持竖屏显示
  plus.screen.lockOrientation("portrait-primary");

  //检查版本
}

