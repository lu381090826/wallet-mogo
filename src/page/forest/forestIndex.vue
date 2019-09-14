<template>
  <div class="home">
    <ul class="coin-list">
      <li class="coin-list-item" @click="collect(index)"
          v-for="(item,index) in list"
          :key="index">
        <div class="coin-list-item-animate">
          <p class="coin-list-item-img">{{item.number}}</p>
          <p class="coin-list-item-name">{{item.title}}</p>
        </div>
      </li>
    </ul>
    <div class="tree-box">
      <img src="../../../static/forest/tree.png" class="tree-img"/>
    </div>
    <div class="grassLand">
      <div class="my-collection" v-intervalclick="{func:gotoMycollect}">
        <div style="color: white;font-weight: bold;font-size: 18px">已收集：{{collectInfo.totalCollectTg}}Tg</div>
        <div style="color: white;font-size: 13px">采集的能量将发送到区块链地址：{{walletName}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {isEmpty} from "../../utils/globalFunc";
  import {openWebview} from "../../utils/webview";

  export default {
    data() {
      return {
        list: [
          {id: 0, title: "", number: "0.02TG"},
          {id: 1, title: "", number: "0.02TG"},
          {id: 2, title: "", number: "0.02TG"},
          {id: 3, title: "", number: "0.02TG"},
          {id: 4, title: "", number: "0.02TG"}
        ],
        collectInfo: {},
        walletName: plus.storage.getItem('walletName'),
      };
    },
    methods: {
      gotoMycollect() {
        openWebview(
          {
            url: "./profit.index.html",
            id: "profit.index",
            needLoaded: true,
            titleStyle: {
              titleText: "持币矿",
              titleColor: "#ffffff",
              backgroundColor: "#fa5b21",
              autoBackButton: true,
            },
            style: {render: true}
          })
      },
      async collect(val) {
        let _this = this;
        request(TGCApiUrl.forestCollect, {
          energy: 0.02,
          walletAddress: plus.storage.getItem("walletAddress")
        })
          .then(res => {
            console.log(res);
            if (!isEmpty(res)) {
              let dom = document.querySelectorAll(".coin-list-item")[val];
              let tree = document.querySelector(".tree-img");
              let left = tree.offsetLeft - dom.offsetLeft + tree.width / 2;
              let top = tree.offsetTop - dom.offsetTop + tree.height / 2;
              dom.style.animationIterationCount = "1";
              let docEl = document.documentElement;
              let clientWidth = docEl.clientWidth > 750 ? 750 : docEl.clientWidth;
              let size = 100 * (clientWidth / 750);
              dom.style.top = top / size + "rem";
              dom.style.left = left / size + "rem";
              dom.style.transform = "scale(0,0)";
              dom.style.transitionDuration = "1.5s";
              tree.classList.add("animate");
              _this.collectInfo.totalCollectTg = Number(_this.collectInfo.totalCollectTg) + Number(0.02);

              setTimeout(() => {
                setTimeout(() => {
                  tree.classList.remove("animate");
                }, 500);
              }, 1000);
            }
          })
      }
    },
    async created() {
      let _t = this;
      await request(TGCApiUrl.forestCollectInfo).then(res => {
        _t.collectInfo = res;
      })
    }
  };
</script>
<style lang="less" scoped>
  @baseFontSize: 75; //基于视觉稿横屏尺寸/100得出的基准font-size
  .px2rem(@name, @px) {
      @{name}: @px / @baseFontSize * 1rem;
  }

  .home {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: url("../../../static/forest/back.png") no-repeat left top / 100% 100%;
    .coin-list {
      display: flex;
      justify-content: space-between;
      color: green;
      margin: 3rem 0.8rem 0.8rem;
      list-style-type: none;
      &-item {
        margin-top: 30%;
        position: relative;
        z-index: 1;
        &-animate {
          animation: updown 3.5s linear infinite alternate;
        }
        &-img {
          line-height: 1rem;
          text-align: center;
          .px2rem(width, 200);
          .px2rem(height, 200);
          background: url("../../../static/forest/coin-1.png") no-repeat left top / 100% 100%;
        }
        &-name {
          text-align: center;
          font-size: 0.26rem;
          margin: 0.1rem 0;
        }
      }
      &-item:nth-child(1) {
        left: 0;
        top: 0;
        .coin-list-item-animate {
          animation-delay: 0.5s;
        }
      }
      &-item:nth-child(2) {
        top: -1rem;
        .coin-list-item-animate {
          animation-delay: 1s;
        }
      }
      &-item:nth-child(3) {
        top: -1rem;
        .coin-list-item-animate {
          animation-delay: 1.5s;
        }
      }
      &-item:nth-child(4) {
        top: -1rem;
        .coin-list-item-animate {
          animation-delay: 2s;
        }
      }
      &-item:nth-child(5) {
        top: 0;
        .coin-list-item-animate {
          animation-delay: 2.5s;
        }
      }
    }
    .tree-box {
      text-align: center;
      .tree-img {
        .px2rem(width, 650);
        .px2rem(width, 1050);
        animation: updown 3.5s linear infinite alternate;
        margin-top: 10%;
      }
      .animate {
        animation: updown2 0.5s linear 1;
      }
    }
  }

  .grassLand {
    text-align: center;
  }

  @keyframes updown {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(0.2rem);
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes updown2 {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(0.4rem);
    }
    100% {
      transform: translateY(0);
    }
  }
</style>
