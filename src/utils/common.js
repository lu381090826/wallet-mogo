import Vue from 'vue';
// 去除300ms延迟
import FastClick from "fastclick";
import "./globalFunc";
import {Toast} from 'vant';

/**
 * 该js为所有页面都必须加载的js
 * 可以用于全局添加某功能
 */
Vue.use(Toast);

let firstExitApp = null;

export function appPlusInit() {
  function plusReady() {
    // 自动关闭窗口 可根据具体逻辑自定义
    plus.key.addEventListener(
      "backbutton",
      function () {
        let ws = plus.webview.currentWebview();
        if (ws.webviewPreload === true) {
          plus.webview.hide(ws, 'auto');
        } else {
          if (!firstExitApp) {
            firstExitApp = new Date().getTime();
            Toast({message: '再按一次退出应用', position: 'bottom'});
            setTimeout(function () {
              firstExitApp = null;
            }, 3000);
          } else {
            if (new Date().getTime() - firstExitApp < 3000) {
              plus.webview.close(ws, 'auto');
            }
          }
        }
      },
      false
    );

    //仅支持竖屏显示
    plus.screen.lockOrientation("portrait-primary");

  }

  document.addEventListener(
    "DOMContentLoaded",
    function () {
      FastClick.attach(document.body);
    },
    false
  );

  document.addEventListener("plusready", plusReady, false);

}
