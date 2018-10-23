<template>
  <div class="palace-body">
    <div class="palaces-header" title="感恩链">
      <div class="palaces-head" v-intervalclick="{func:scan}">
        <img src="../assets/sao.png" width="33"/>
        <div>扫一扫</div>
      </div>
      <div class="palaces-head" v-intervalclick="{func:send}">
        <img src="../assets/转账白.png" width="38"/>
        <div>转账</div>
      </div>
      <div class="palaces-head" v-intervalclick="{func:receive}">
        <img src="../assets/收款白.png" width="38"/>
        <div>收款</div>
      </div>
      <div class="palaces-head">
        <img src="../assets/qianbao.png" width="38"/>
        <div>钱包</div>
      </div>
    </div>

    <div class="palaces-pl">
      <ul id="mainmenu">
        <li>
          <a>
            <b>
              <img src="../assets/cishan.png" width="38"/>
            </b><span>公益慈善</span>
          </a>
        </li>
        <li>
          <a>
            <b>
              <img src="../assets/walk.png" width="38"/>
            </b><span>感恩行</span>
          </a>
        </li>
        <li>
          <a>
            <b>
              <img src="../assets/shouyi.png" width="38"/>
            </b><span>持币矿</span>
          </a>
        </li>
        <li>
          <a>
            <b>
              <img src="../assets/shouyi.png" width="38"/>
            </b><span>持币矿</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {
    openWebview,
    openWebviewFast,
    preLoad,
    showWebviewById
  } from "../utils/webview";

  export default {
    data() {
      return {}
    },
    mounted() {
      let t = this;
      t.perLoad();
    },
    methods: {
      receive() {
        showWebviewById("wallet.receive");
      },
      send() {
        showWebviewById("wallet.send");
      },
      scan() {
        showWebviewById("wallet.scan");
      },
      perLoad() {
        //预加载窗口
        preLoad([{
          url: "./wallet.receive.html",
          id: "wallet.receive",
          title: "收款"
        }, {
          url: "./wallet.send.html",
          id: "wallet.send",
          title: "转账"
        }, {
          url: "./wallet.scan.html",
          id:
            "wallet.scan",
          title:
            "扫一扫",
          style: {
            titleNView: {
              backgroundColor: "#000000", // 导航栏背景色
              titleText: "扫一扫", // 导航栏标题
              titleColor: "#ffffff", // 文字颜色
              // type: "transparent", // 透明渐变样式
              autoBackButton: true, // 自动绘制返回箭头
              splitLine: {
                // 底部分割线
                color: "#000000"
              }
            },
            popGesture: "none"
          }
        }
        ])
      }
    }
  }
</script>
<style scoped>
  .palace-body {
    padding-top: 65px;
  }

  a:hover, a:visited, a:link, a:active {
    color: white;
    text-decoration: none;
  }

  .palaces-header {
    background-color: #417fcc;
    min-height: 90px;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    text-align: center;
    top: 0;
    right: 0;
    left: 0;
    position: fixed;
    z-index: 1;
    padding-top: 8%;
  }

  .palaces-head {
    display: inline-block;
    width: 15%;
    margin-top: 3%;
    margin-left: 3%;
    margin-right: 3%;
    color: white;
  }

  .palaces-swipe {
    margin-top: 8%;
    position: inherit;
    height: 80px;
  }

  .palaces-swipe div {
    border: 22px black;
  }

  img {
    border: 0;
  }

  #mainmenu {
    list-style: none outside none;
    margin: 0;
    padding: 0;
  }

  .palaces-pl {
    text-align: center;
    margin-top: 15%;
  }

  #mainmenu:after {
    clear: both;
    content: " ";
    display: block;
  }

  #mainmenu li {
    float: left;
    margin-left: 2.5%;
    margin-top: 2.5%;
    width: 22%;
    border-radius: 3px;
    overflow: hidden;
  }

  #mainmenu li a {
    display: block;
    color: #FFF;
    text-align: center
  }

  #mainmenu li a b {
    display: block;
    height: 60px;
  }

  #mainmenu li a img {
    margin: 15px auto 15px;
  }

  #mainmenu li a span {
    display: block;
    height: 30px;
    line-height: 30px;
    /*background-color: #FFF;*/
    color: #999;
    font-size: 14px;
  }
</style>
