/**
 * 该js为所有页面都必须加载的js
 * 可以用于全局添加某功能
 */
import Vue from 'vue'
import cons from "./constants/Cons";
import {openWebview} from "./webview";

// 防止多次点击的组件
(function () {
  let openDelay = false;
  Vue.directive('intervalclick', function (el, binding) {
    el.onclick = function (e) {
      if (openDelay) {
        return;
      }
      openDelay = !openDelay;
      if (!binding.value) {
        // plus.nativeUI.toast("未传入Value数据！");
        return;
      }
      let func = binding.value['func'];
      let time = binding.value['time'];
      if (typeof time !== 'number') {
        // alert("传入等待时间错误");
        time = 300;
      }
      let args = [];
      for (const key in binding.value) {
        if (binding.value.hasOwnProperty(key)) {
          if (key === 'func' || key === 'time') {
            continue;
          }
          args.push(binding.value[key])
        }
      }
      setTimeout(() => {
        openDelay = !openDelay;
      }, time);
      func(...args);
    }
  })
})();

export function isEmptyObject(obj) {
  return obj === null || obj === undefined || Object.keys(obj).length === 0 || typeof obj === "undefined" || obj === "" || obj === "null";
}

export function isNotEmptyObject(obj) {
  return !isEmptyObject(obj);
}

export function isEmpty(obj) {
  return typeof obj === "undefined" || obj === undefined || obj === null || obj === "" || obj === "null";
}

export function isNotEmpty(obj) {
  return !isEmpty(obj);
}

// 页面调试工具
export function print(json, options) {
  let reg = null,
    formatted = "",
    pad = 0,
    PADDING = "    ";
  options = options || {};
  options.newlineAfterColonIfBeforeBraceOrBracket =
    options.newlineAfterColonIfBeforeBraceOrBracket === true ? true : false;
  options.spaceAfterColon = options.spaceAfterColon === false ? false : true;
  if (typeof json !== "string") {
    json = JSON.stringify(json);
  } else {
    json = JSON.parse(json);
    json = JSON.stringify(json);
  }
  reg = /([\{\}])/g;
  json = json.replace(reg, "\r\n$1\r\n");
  reg = /([\[\]])/g;
  json = json.replace(reg, "\r\n$1\r\n");
  reg = /(\,)/g;
  json = json.replace(reg, "$1\r\n");
  reg = /(\r\n\r\n)/g;
  json = json.replace(reg, "\r\n");
  reg = /\r\n\,/g;
  json = json.replace(reg, ",");
  if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
    reg = /\:\r\n\{/g;
    json = json.replace(reg, ":{");
    reg = /\:\r\n\[/g;
    json = json.replace(reg, ":[");
  }
  if (options.spaceAfterColon) {
    reg = /\:/g;
    json = json.replace(reg, ":");
  }
  json.split("\r\n").forEach(function (node, index) {
    let i = 0,
      indent = 0,
      padding = "";

    if (node.match(/\{$/) || node.match(/\[$/)) {
      indent = 1;
    } else if (node.match(/\}/) || node.match(/\]/)) {
      if (pad !== 0) {
        pad -= 1;
      }
    } else {
      indent = 0;
    }

    for (i = 0; i < pad; i++) {
      padding += PADDING;
    }

    formatted += padding + node + "\r\n";
    pad += indent;
  });
};

export function loginOut() {
  openWebview({
    url: cons.loginViewUrl,
    id: cons.loginViewId,
    title: "",
    noTitle: true,
    needLoaded: true,
  }, {}, {}, () => {
    let wvs = plus.webview.all();
    for (let i = 0; i < wvs.length; i++) {
      if (wvs[i].id === cons.loginViewId) continue;
      wvs[i].close();
    }
  })
}
