<template>
  <div class="forest-body" ref="forestBody">
    <div class="container">
      <div class="blueSky" :style="{height:skyHeight}">
        <ul>
          <li v-for="(item,k) in cloudItems" :key="k"
              :is="item.component"
              :left="item.left"
              :top="item.top"
              :width="item.width"
          >
          </li>
        </ul>
        <div style="width: 70%">
          <ul>
            <li style="float: left" :is="item.component"
                v-for="(item,k) in items" :key="k"
                :weight="item.weight"
                :x="item.x"
                :y="item.y"
                :animationDelay="item.animationDelay"
                @reflash="reflash"
            >
            </li>
          </ul>
        </div>
      </div>
      <div class="grassLand">
        <div class="my-collection" v-intervalclick="{func:gotoMycollect}">
          <div style="color: #009e04;font-weight: bold">已收集：{{collectInfo.totalCollectTg}}Tg</div>
          <div style="color: #009e04;font-size: 11px">采集的能量将由区块链发放到钱包-{{walletName}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from "vue";
  import Paopao from "./Paopao";
  import ForestCloud from "./ForestCloud";
  import {Button} from 'vant';
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {openWebview, openWebviewFast} from "../../utils/webview";

  Vue.use(Button);

  export default {
    components: {
      ForestCloud
    },
    data() {
      return {
        items: [],
        clientHeight: '',
        skyHeight: '',
        cloudItems: [],
        totalEnergy: 0,
        collectInfo: {},
        walletName: plus.storage.getItem('walletName'),
      }
    },
    mounted() {
      // 获取浏览器可视区域高度
      this.clientHeight = `${document.documentElement.clientHeight}`          //document.body.clientWidth;
      window.onresize = function temp() {
        this.clientHeight = `${document.documentElement.clientHeight}`;
      };
      this.skyHeight = (this.clientHeight - 160) + 'px';
    },
    watch: {
      // 如果 `clientHeight` 发生改变，这个函数就会运行
      clientHeight: function () {
        // this.changeFixed(this.clientHeight)
      }
    },
    methods: {
      gotoMycollect() {
        openWebviewFast({
          url: './forest.mycollection.html',
          id: 'forest.mycollection',
          title: '收集记录'
        })
      },
      append() {
        //添加云
        for (let i = 0; i < 2; i++) {
          let left = Math.random() * 300;
          let top = Math.random() * 20;
          let width = Math.random() * 100;
          let height = Math.random() * 50;
          this.cloudItems.push({
            'component': ForestCloud,
            left: left + 'px',
            top: top + '%',
            width: width + 'px',
          });
        }

        //添加泡泡
        for (let i = 0; i < 5; i++) {
          let weight = 0.02;
          let xNum = Math.random() * 200;
          let x = xNum > 301 ? 151 : xNum + 'px';
          let yNum = Math.random() * 200;
          let y = (yNum > this.skyHeight ? this.skyHeight - 150 : yNum) + 'px';
          let animationDelay = Math.random();
          this.items.push({
            'component': Paopao,
            'weight': weight,
            'x': x,
            'y': y,
            'animationDelay': animationDelay + 's',
          });
        }
      },
      changeFixed(clientHeight) {
        this.$refs.homePage.style.height = clientHeight + 'px';
      },
      reflash() {
        let _t = this;
        request(TGCApiUrl.forestCollectInfo).then(res => {
          _t.collectInfo = res;
        })
      }
    },
    created() {
      this.append();
      this.reflash()
    }
  }
</script>

<style>
  .blueSky {
    width: 100%;
    background-image: -webkit-linear-gradient(top, rgb(196, 228, 253), rgb(255, 255, 255));
    position: relative;
  }

  .grassLand {
    width: 100%;
    height: 160px;
    background-image: -webkit-linear-gradient(top, rgb(255, 255, 255), rgb(148, 190, 89));
  }

  .container {
    overflow: hidden;
  }

  .my-collection {
    padding-top: 20%;
    margin-left: 15%;
    text-align: center;
  }

  .my-collection-button {
    background-color: #00b004;
    color: white;
  }
</style>
