import Vue from 'vue'
import {Toast} from "vant";
import {isEmpty, isNotEmpty, isNotEmptyObject} from "./globalFunc";
import './webviews'

Vue.use(Toast);

function getTitleStyle(config) {
  let titelStyle = {};
  if (isNotEmpty(config.noTitle) && config.noTitle) {
    titelStyle = {
      backgroundColor: "#ffffff", // 导航栏背景色
      titleText: "", // 导航栏标题
      titleColor: "#ffffff", // 文字颜色
      // type: "transparent", // 透明渐变样式
      autoBackButton: false, // 自动绘制返回箭头
      splitLine: {
        // 底部分割线
        color: "#ffffff"
      }
    };
  } else {
    titelStyle = {
      backgroundColor: "#f7f7f7", // 导航栏背景色
      titleText: config.title, // 导航栏标题
      titleColor: "#666", // 文字颜色
      // type: "transparent", // 透明渐变样式
      autoBackButton: config.autoBackButton === undefined ? true : config.autoBackButton, // 自动绘制返回箭头
      splitLine: {
        // 底部分割线
        color: "#cccccc"
      }
    };
  }
  return titelStyle;
}

/**
 * 打开一个webview窗口
 */
export function openWebview(config, style = {}, extras = {}) {
  if (typeof(plus) === "undefined") {
    return;
  }

  let webView = plus.webview.getWebviewById(config.id);
  //有参数传入都以新窗口打开
  if (isEmpty(webView) || isNotEmptyObject(extras)) {

    let titelStyle;
    if (config.titleStyle) {
      titelStyle = config.titleStyle
    } else {
      titelStyle = getTitleStyle(config);
    }

    let wload = plus.webview.create(
      config.url,
      config.id,
      {
        titleNView: titelStyle,
        popGesture: "none",
        scrollIndicator: 'none',
        ...style
      }
      ,
      extras
    );

    //需要加载完再打开
    if (isNotEmpty(config.needLoaded) && config.needLoaded) {
      let w = plus.nativeUI.showWaiting();
      // 监听窗口加载成功
      wload.addEventListener(
        "loaded",
        function () {
          wload.show("pop-in"); // 显示窗口
          w.close();
          // w = null;
        },
        false
      );
    } else {
      wload.show("pop-in");
    }
  } else {
    webView.show("pop-in");
  }


}

// webview.open  打开得很快 但是不能传参
export function openWebviewFast(config) {
  if (typeof(plus) === "undefined") {
    return;
  }

  let nws = plus.webview.getWebviewById(config.id);
  if (isNotEmptyObject(nws)) {
    nws.close();
  }

  //默认样式
  let navStyle;
  if (config.noTitle) {
    navStyle = null;
  } else if (config.titleStyle) {
    navStyle = config.titleStyle;
  } else {
    navStyle = {
      backgroundColor: "#f7f7f7", // 导航栏背景色
      titleText: config.title, // 导航栏标题
      titleColor: "#666", // 文字颜色
      // type: "transparent", // 透明渐变样式
      autoBackButton: true, // 自动绘制返回箭头
      splitLine: {
        // 底部分割线
        color: "#cccccc"
      },
    };
  }
  navStyle.buttons = [{
    type: 'back', float: 'left', onclick: () => {
      let ns = plus.webview.getWebviewById(config.id);
      ns.close();
    }
  }];
  navStyle.autoBackButton = false;


  let w;
  if (config.showWaiting) {
    w = plus.nativeUI.showWaiting();
  }
  plus.webview.open(
    config.url,
    config.id,
    {
      titleNView: navStyle,
      scrollIndicator: 'none',
      backButtonAutoControl: 'close',
    },
    "pop-in",
    200,
    function () {
      if (w) {
        w.close();
      }
    }
  );
}

// 预加载页面 速度很快,但是不要加载超过10个
export function preLoad(webviews = []) {
  if (typeof(plus) === "undefined") {
    return;
  }

  webviews.map(webview => {
    let titleStyle;
    if (webview.noTitle) {
      titleStyle = null;
    } else if (webview.titleStyle) {
      titleStyle = webview.titleStyle;
    } else {
      let autoBackButton = webview.autoBackButton === undefined ? true : webview.autoBackButton;
      let backgroundColor = webview.backgroundColor === undefined ? "#f7f7f7" : webview.backgroundColor;
      let titleColor = webview.titleColor === undefined ? "#666" : webview.titleColor;
      let title = webview.title === undefined ? "" : webview.title;
      let splitLine = webview.splitLine === undefined ? "#cccccc" : webview.splitLine;

      titleStyle = {
        backgroundColor: backgroundColor, // 导航栏背景色
        titleText: title, // 导航栏标题
        titleColor: titleColor, // 文字颜色
        // type: "transparent", // 透明渐变样式
        autoBackButton: autoBackButton, // 自动绘制返回箭头
        splitLine: {
          // 底部分割线
          color: splitLine
        }
      }
    }

    const fullExtras = {
      ...webview.extras,
    };

    plus.webview.create(
      webview.url,
      webview.id,
      {
        titleNView: titleStyle,
        popGesture: "none",
        ...webview.style
      },
      fullExtras
    );
  });
}

export function showWebviewById(id) {
  if (typeof(plus) === "undefined") {
    return;
  }
  plus.webview.show(id, "pop-in");
}
