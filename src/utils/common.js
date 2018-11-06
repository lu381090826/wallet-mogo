import Vue from 'vue';
// 去除300ms延迟
import FastClick from "fastclick";
import "./globalFunc";
import {Toast} from 'vant';
import cons from './constants/Cons'
import webViews from './webviews'

/**
 * 该js为所有页面都必须加载的js
 * 可以用于全局添加某功能
 */
Vue.use(Toast);
Vue.use(webViews);

//测试环境代理
Vue.prototype.HOST = '/api';
// Vue.prototype.HOST = null;

let firstExitApp = false;

document.addEventListener(
  "DOMContentLoaded",
  function () {
    FastClick.attach(document.body);
  },
  false
);

function plusReady() {
  // 自动关闭窗口 可根据具体逻辑自定义
  plus.key.addEventListener(
    "backbutton",
    function () {
      let ws = plus.webview.currentWebview();
      if (cons.inLastWebViewIds(ws.id)) {
        //首页返回键
        ws.webviewLast = true;
      }

      if (ws.webviewLast === undefined) {
        ws.webviewLast = false;
      }

      if (ws.webviewPreload === undefined) {
        ws.webviewPreload = true;
      }

      if (ws.webviewPreload && !ws.webviewLast) {
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
            //最后一个窗口，直接退出
            if (ws.webviewLast) {
              let main = plus.android.runtimeMainActivity();
              main.finish();
            }
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

if (window.plus) {
  plusReady();
} else {
  document.addEventListener("plusready", plusReady, false);
}

