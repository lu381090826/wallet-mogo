# 更新日志

![GitHub tag](https://img.shields.io/github/tag/tyaqing/mogo-h5plus.svg)

### 1.3.0 [20180727]

#### [新增]

1.  增加`热更新/迭代`集成,具体文档查看[热更新/迭代](../practice/hotfix.md)
2.  增加自定义返回实现,返回按钮可以[自定义返回按钮事件](./qa.html#自定义返回按钮事件)
3.  增加"商品加入购物车"功能实例演示页面间通讯
4.  新增 VConsole 以 webpack 插件的形式加载,`run build`会自动去掉

#### [修复]

1.  修复了超多页面下调试慢的问题,使用`html-webpack-plugin-for-multihtml`解决
2.  修改了版本文档

#### [升级指导]

1.  将 VConsole 在 common.js 中删掉,因为已经以 webpack 插件形式加载
2.  `utils` 是我们会经常修改的, 如果有自己的工具库,请另建文件夹

### 1.2.0 [20180719]

#### [新增]

- 增加预加载窗口打开方式,根据不同场景使用不同的打开方式,可以大大提高 webview 的打开速度,首页已加入使用案例
- 由于 VConsole 并不能解决全部调试问题,增加一个`print`方法,用于在 Hbuilder 上打印对象

#### [速度优化方案]

最近许多反映脚手架很慢的可以参考一下优化方案,可以大大提高调试/打包速度.

1.2 的版本中移除了一些不必要的插件,应该会快那么一点吧.追求速度的继续往下看.

由于 demo 需要展示各种 ui,加载了各种的 ui 的 loader,所以如果开发者用不到可以将其移除.

##### 1.如果不使用 VUX

注释掉 `vux-loader` 即可,在`webpack.base.conf.js`中,修改以下代码

```
const vuxLoader = require("vux-loader");

module.exports = vuxLoader.merge(webpackConfig, {
  plugins: ["vux-ui"]
});
```

修改后

```
module.exports = webpackConfig;
```

##### 2.如果不使用 vant

移除掉`.babalrc`中以下代码

```
    [
      "import",
      {
        "libraryName": "vant",
        "libraryDirectory": "es",
        "style": true
      }
    ]
```

##### 3.优化建议

对于一些简单的页面其实可以不用 ui 框架,加载的时候会很快
使用 ui 框架大概也只会增加 100-200ms 的 js 运行时间,窗口过渡 200ms 的话,基本上不会影响用户体验
如果使用大量组件,增加的时间可能会比较大,这个时候可以考虑预加载这个窗口了.

参考:http://ask.dcloud.net.cn/article/25

#### [升级方案]

几乎每个版本都是兼容的,所以只要将`src`中的文件转移到新版本就 ok 啦!

#### [终极解决:webpack4]

由于官方的 `webpack3` 脚手架速度也提升不了多少了,所以 `1.2` 之后的 `1.x` 版本之后可能几乎不会对脚手架做修改了,只会增加很多实用的使用案例和工具方法

不过现在已经开始对 `webpack4` 开始研究了 webpack4 `2.0`版本见啦

### 1.1.0 [20180706]

#### [新增]

- `page.json`可以配置是否加载 mui 或者是否使用 plusready
- 增加`fire`页面传值函数,详情可见商品详情页和首页的自定义事件

#### [修复]

- 修复了资源路径加载问题(需修改`page.json`配置)
- 修复了 mui 加载不灵活的问题,减少打包的体积
- 修复了 mui 字体文件加载失败的问题

#### 1.0.x 到 1.1.x

由于之前资源路径的问题,目前的解决方案是修改`page.json`的配置,将原来的以路径作为键`mui/index`写成`mui.index`即可,如下

如果要使用 mui 就加入 `|mui`, 如果要使用 mui 就加入 `|plusReady`,不用则不加.

> plusReady 在安卓手机上提前载入可能会影响页面打开速度,解决方法有两种:1 不提前使 plus 生效 2.预加载 plus

```json
{
  "mui.index|mui|plusReady": "./src/page/mui/index.js"
}
```

#### 注意事项

请在`created`生命周期里面接收事件,否则会因为视图刷新多次执行.

### 1.0.1 [20180704]

- 修复了 background 图片路径打包后不正确的问题

### 1.0.0 [20180630]

- 使用 vue 官方脚手架作为基层,健壮性得到`史诗级`提升
- 添加了 vux 的支持
- 修改的 mui 的加载方式
- 配置方面有部分变化,详情请看文档
- 升级了安卓 app

### 0.3.0 [20180628]

- 解决了因为新增/删除页面导致的 webpack 错误
- 添加了 openWebview 的 extras 参数

### 0.2.0 [20180623]

- 添加了对 mui 样式和 js 的支持
