/**
 * 打开一个webview窗口
 */
export function openWebview(config, style = {}, extras = {}) {
  if (plus === undefined) {
    return;
  }

  if (extras.webviewPreload === undefined || extras.webviewPreload === null) {
    extras.webviewPreload = true;
  }

  let wv = plus.webview.create(
    config.url,
    config.id,
    {
      titleNView: {
        backgroundColor: "#f7f7f7", // 导航栏背景色
        titleText: config.title, // 导航栏标题
        titleColor: "#666", // 文字颜色
        // type: "transparent", // 透明渐变样式
        autoBackButton: config.autoBackButton === undefined ? true : config.autoBackButton, // 自动绘制返回箭头
        splitLine: {
          // 底部分割线
          color: "#cccccc"
        }
      },
      popGesture: "none"
    }
    ,
    extras
  );
  let w = plus.nativeUI.showWaiting();
  // 监听窗口加载成功
  wv.addEventListener(
    "loaded",
    function () {
      wv.show("slide-in-right"); // 显示窗口
      w.close();
      // w = null;
    },
    false
  );
}

// webview.open  打开得很快 但是不能传参
export function openWebviewFast(url, id, title,) {
  if (plus === undefined) {
    return;
  }
  plus.nativeUI.showWaiting();
  plus.webview.open(
    url,
    id,
    {
      titleNView: {
        backgroundColor: "#f7f7f7", // 导航栏背景色
        titleText: title, // 导航栏标题
        titleColor: "#666", // 文字颜色
        // type: "transparent", // 透明渐变样式
        autoBackButton: true, // 自动绘制返回箭头
        splitLine: {
          // 底部分割线
          color: "#cccccc"
        }
      },
    },
    "slide-in-right",
    420,
    function () {
      plus.nativeUI.closeWaiting();
    }
  );
}

// 预加载页面 速度很快,但是不要加载超过10个
export function preLoad(webviews = []) {
  if (plus === undefined) {
    return;
  }

  webviews.map(webview => {

    let autoBackButton = webview.autoBackButton === undefined ? true : webview.autoBackButton;

    const fullExtras = {
      webviewPreload: true,
      ...webview.extras,
    };

    plus.webview.create(
      webview.url,
      webview.id,
      {
        titleNView: {
          backgroundColor: "#f7f7f7", // 导航栏背景色
          titleText: webview.title, // 导航栏标题
          titleColor: "#666", // 文字颜色
          // type: "transparent", // 透明渐变样式
          autoBackButton: autoBackButton, // 自动绘制返回箭头
          splitLine: {
            // 底部分割线
            color: "#cccccc"
          }
        },
        popGesture: "none",
        ...webview.style
      },
      fullExtras
    );
  });
}

export function showWebviewById(id) {
  if (plus === undefined) {
    return;
  }
  plus.nativeUI.showWaiting();
  plus.webview.show(id, "slide-in-right", 200);
  plus.nativeUI.closeWaiting();
}
