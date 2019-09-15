<template>
  <div class="home">
    <div class="home-canvas">
      <canvas id="mycanvas" :width="size" :height="size"></canvas>

      <div style="text-align: center;" v-if="isShow">
        <van-button
          v-if="!canChange"
          class="juan-but"
          size="large"
          disabled
        >
          立即捐步
        </van-button>
        <van-button
          v-if="canChange"
          class="juan-but"
          size="large"
          v-intervalclick="{func:changeStep}"
        >
          立即捐步
        </van-button>
      </div>

      <div class="home-des" v-if="isShow">今日集满5000步可采1TG行走矿</div>

      <div class="home-bottom" v-if="isShow">
        <span class="home-bottom-btn home-bottom-btn-left" :style="donationListButton" @click="donationList">捐赠记录</span>
        <span class="home-bottom-btn home-bottom-btn-right" :style="stepListButton" @click="stepList">运动记录</span>
      </div>
    </div>

    <img src="../../../static/walk/timg.jpeg" id="img" style="position: absolute; transform: translateX(-99999px)"/>

    <div style="margin-top: 5%;">
      <div class="juanz" v-if="isShow">
        {{listTitle}}
      </div>

      <van-cell-group v-if="listTitle==='捐赠记录'">
        <van-cell v-if="orderLists.length > 0"
                  v-for="(item,k) in orderLists"
                  :key="k"
                  :title="item.orderTitle"
                  :label="item.modifyTime"
                  :value="item.amount+' TG'"
        >
        </van-cell>
        <van-cell v-if="orderLists.length === 0"
                  title="暂无捐赠记录"></van-cell>
      </van-cell-group>

      <van-cell-group v-if="listTitle==='运动记录'">
        <van-cell v-if="stepLists.length>0"
                  v-for="(row ,k) in stepLists"
                  :key="k"
                  :label="row.lastStepTime"
                  :title="row.todayStep +' 步'"></van-cell>
        <van-cell v-if="stepLists.length===0"
                  title="暂无运动记录"></van-cell>
      </van-cell-group>

    </div>

  </div>
</template>

<script>
  import Vue from 'vue';
  import {Button} from 'vant';
  import {request} from "../../utils/request";
  import TGCApiUrl from "../../utils/constants/TGCApiUrl";
  import {Cell, CellGroup} from 'vant';

  Vue.use(Cell).use(CellGroup);
  Vue.use(Button);
  // @ is an alias to /src
  export default {
    name: 'home',
    data() {
      return {
        size: 240,
        rato: 10,
        i: 0,
        step: 0,
        path: require('../../../static/walk/default.jpeg'),
        myInfo: {},
        isShow: false,
        orderLists: [],
        stepLists: [],
        buttonStyle: {
          color: "#4ba8fa",
          backgroundColor: "white"
        },
        buttonStyleSelect: {
          color: "white",
          backgroundColor: "#4ba8fa"
        },
        donationListButton: null,
        stepListButton: null,
        listTitle: "捐赠记录",
      }
    },
    computed: {
      canChange() {
        return this.step >= 5000;
      }
    },
    async created() {
      this.donationListButton = this.buttonStyleSelect;
      this.stepListButton = this.buttonStyle;
      await this.getOrderLists();
      await this.getStepLists();
    },
    watch: {
      step(newVal, oldVal) {
        if (newVal !== 0) {
          this.rotateCircle()
        }
      }
    },
    methods: {
      changeStep() {
        let _this = this;
        request(TGCApiUrl.donationStepToTG, {receiveAddress: plus.storage.getItem("walletAddress")})
          .then(function (res) {
            Toast('兑换成功，请查收');
            localStorage.setItem("todayStep", 0);
            _this.canChange = false;
          })
      },
      onRefresh() {
        this.getOrderLists();
        this.getStepLists();
        this.step = Number(localStorage.getItem("todayStep"));
        let ws = plus.webview.currentWebview();
        setTimeout(() => {
          ws.endPullToRefresh();
        }, 1000)
      },
      donationList() {
        this.donationListButton = this.buttonStyleSelect;
        this.stepListButton = this.buttonStyle;
        this.listTitle = "捐赠记录";
      },
      stepList() {
        this.donationListButton = this.buttonStyle;
        this.stepListButton = this.buttonStyleSelect;
        this.listTitle = "运动记录";
      },
      getOrderLists() {
        let _this = this;
        request(TGCApiUrl.donationGetList).then(function (res) {
          setTimeout(() => {
            _this.orderLists = res;
          }, 1000)
        });
      },
      getStepLists() {
        let _this = this;
        request(TGCApiUrl.stepList).then(function (res) {
          setTimeout(() => {
            _this.stepLists = res;
          }, 1000)
        });
      },
      getData() {
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(1500)
          }, 1000)
        }).then(data => {
          let step = Number(localStorage.getItem("todayStep"));
          this.step = step === 0 ? 1 : step;
          this.isShow = true;
          this.rato = this.step > 5000 ? 5000 : this.step;
        })

      },
      drawCircle() {
        // 大圆框
        this.context.beginPath();
        this.context.arc(this.size / 2, this.size / 2, 104, 0, Math.PI * 2);
        // 小圆
        this.context.beginPath();
        this.context.arc(this.size / 2, this.size / 2, 95, 0, Math.PI * 2);
        this.context.fillStyle = "white";
        this.context.fill();

        this.context.beginPath();
        this.context.arc(this.size / 2, this.size / 2, 100, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 1);
        this.context.lineWidth = 6;
        this.context.lineCap = "round";
        this.context.strokeStyle = '#f1f1f1';
        this.context.stroke();
      },
      drawCircleColor(i = this.i) {
        this.drawCircle()
        // 大圆
        this.context.beginPath();
        let grd = this.context.createLinearGradient(0, 0, 0, 360);
        grd.addColorStop(0, "#4ba8fa");
        grd.addColorStop(0.5, "#69b2f4");
        grd.addColorStop(1, "#4ba8fa");
        this.context.arc(this.size / 2, this.size / 2, 100, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (i / 100));
        this.context.lineWidth = 10;
        this.context.lineCap = "round";
        this.context.strokeStyle = grd;
        this.context.stroke();
        if (this.step === 0) {
          this.drawImg()
        } else {
          clearInterval(this.timer)
          this.drawText()
        }

      },
      drawImg() {
        let img = document.getElementById('img')
        let index = 0;
        let _this = this;
        img.onload = function () {
          _this.context.drawImage(img, index * 85 + 10, 95, 90, 100, 85, 85, 70, 80);
        }
      },
      drawText() {
        // 字
        this.context.beginPath();
        this.context.textBaseline = "middle";
        this.context.textAlign = "center";
        this.context.fillStyle = "black";
        this.context.font = "13px Arial blod";
        this.context.fillText('今日步数', this.size / 2, this.size / 2 - 20);
        this.context.font = "45px Arial";
        this.context.fillStyle = "#a1a1a1";
        this.context.fillText(this.i * this.rato, this.size / 2, this.size / 2 + 20);
      },
      rotateCircle() {
        let progress = this.step / this.rato;
        if (this.i > progress) {
          return;
        }
        this.context = this.canvas.getContext('2d')

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCircleColor();
        if (progress - this.i > 30) {
          this.i += 2;
        } else {
          this.i += 1;
        }

        requestAnimationFrame(this.rotateCircle)
      },
    },
    async mounted() {
      this.canvas = document.getElementById("mycanvas");
      let width = this.canvas.width;
      let height = this.canvas.height;
      this.context = this.canvas.getContext("2d");
      if (window.devicePixelRatio) {
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.canvas.width = width * window.devicePixelRatio;
        this.canvas.height = height * window.devicePixelRatio;
        this.context.scale(window.devicePixelRatio, window.devicePixelRatio)
      }
      this.getData();
      this.drawCircleColor();

      let _t = this;
      let ws = plus.webview.currentWebview();
      ws.setPullToRefresh({support: true, style: 'circle', offset: '45px'}, _t.onRefresh);
    }
  }
</script>
<style lang="less" scoped>
  @baseFontSize: 75; //基于视觉稿横屏尺寸/100得出的基准font-size
  .px2rem(@name, @px) {
      @{name}: @px / @baseFontSize * 1rem;
  }

  .home {
    width: 100%;
    min-height: 680px;
    background: #f5f5f5;
    // overflow: auto;
    overflow-y: hidden;
  }

  .home-title {
    width: 100%;
    .px2rem(height, 90);
    .px2rem(padding-top, 10);
    .px2rem(padding-bottom, 10);
    .px2rem(padding-left, 30);
    .px2rem(padding-right, 30);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .home-name {
    background: #fff;
    display: flex;
    align-items: center;
    .px2rem(height, 70);
    .px2rem(border-radius, 70);
    .px2rem(padding, 10);
  }

  .home-name-val {
    .px2rem(margin-left, 10);
  }

  .home-name-img {
    .px2rem(width, 50);
    .px2rem(height, 50);
    .px2rem(border-radius, 50);
    object-fit: cover;

  }

  .home-name-val {

  }

  .home-right {
    background: #fff;
    .px2rem(height, 70);
    .px2rem(line-height, 70);
    .px2rem(width, 120);
    .px2rem(border-radius, 70);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .home-right-val {
    background: #4ba8fa;
    .px2rem(height, 50);
    .px2rem(line-height, 50);
    .px2rem(width, 100);
    .px2rem(border-radius, 50);
    .px2rem(font-size, 28);
    color: #fff;
    text-align: center;
  }

  .home-des {
    text-align: center;
    color: #a5a5a5;
    .px2rem(margin-top, 80);
    .px2rem(margin-bottom, 80);
  }

  .home-canvas {
    .px2rem(width, 720);
    .px2rem(padding-top, 20);
    // .px2rem(padding-bottom, 20);
    .px2rem(border-radius, 8);
    margin: 0 auto;
    background: #fff;
    width: 96%;
  }

  #mycanvas {
    display: block;
    margin: 0 auto;
  }

  .home-bottom {
    display: flex;
    border-top: 1px solid #f5f5f5;
  }

  .home-bottom-btn {
    flex: 1;
    .px2rem(padding-top, 80);
    .px2rem(padding-bottom, 80);
    text-align: center;
    border-right: 1px solid #f5f5f5;
  }

  .home-bottom-btn-left {
    border-bottom-left-radius: 5px;
  }

  .home-bottom-btn-right {
    border-bottom-right-radius: 5px;
  }

  .home-bottom-btn:nth-of-type(2n) {
    border-right: none;
  }

  .home-today {
    .px2rem(margin-top, 60);
    .px2rem(margin-bottom, 20);
    background: #fff;
    display: flex;
    flex-direction: column;
  }

  .home-today-val {
    .px2rem(padding-top, 20);
    .px2rem(padding-bottom, 20);
    .px2rem(padding-left, 20);
    color: #000;
    .px2rem(font-size, 30);
    font-weight: 700;
    border-bottom: 1px solid #f5f5f5;
  }

  .home-today-bottom {
    display: flex;
    .px2rem(padding-left, 100);
    .px2rem(padding-right, 30);
    .px2rem(padding-top, 20);
    .px2rem(padding-bottom, 20);
    align-items: center;
  }

  .home-today-left {
    display: flex;
    flex: 1;
    .px2rem(padding-right, 30);
    justify-content: space-between;
    align-items: center;
  }

  .home-today-info {
    display: flex;
    align-items: center;
  }

  .home-today-my-img {
    .px2rem(width, 80);
    .px2rem(height, 80);
    .px2rem(border-radius, 80);
    .px2rem(margin-right, 20);
    border: 2px solid #f60;
    object-fit: cover;

  }

  .home-today-right {
    .px2rem(width, 30);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .home-today-my {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .home-today-my-name {
    .px2rem(font-size, 28);
    color: #000;
  }

  .home-today-my-count {
    .px2rem(font-size, 24);
    color: #a5a5a5;
  }

  .home-today-count {
    color: #f60;
    .px2rem(font-size, 44);
  }

  .home-today-count.active {
    color: #4ba8fa;
  }

  .home-today-right-count {
    .px2rem(font-size, 24);
    color: #a5a5a5;
  }

  .home-today-right-count.active {
    color: #f60;
  }

  .home-today-right-icon {
    .px2rem(width, 30);
    .px2rem(height, 30);
  }

  .home-list {
    background: #fff;
    display: flex;
    align-items: center;
    .px2rem(padding-top, 20);
    .px2rem(padding-bottom, 20);
    border-bottom: 1px solid #f5f5f5;
    .home-list-count {
      .px2rem(width, 40);
    }
    .home-today-my-img {
      border: none;
    }
    .home-today-right {
      .px2rem(margin-right, 30);
    }
  }

  .home-list.active {
    background: #f1f1f1;
  }

  .home-list:last-child {
    border: none;
  }

  .home-list-count {
    .px2rem(margin-left, 30);
    .px2rem(margin-right, 30);
    .px2rem(font-size, 40);
    color: #a1a1a1;

  }

  .home-bottom-des {
    .px2rem(font-size, 24);
    text-align: center;
    color: #a1a1a1;
    .px2rem(line-height, 60);
  }

  .juan-but {
    background: linear-gradient(to right, #69b2f4 0%, #4ba8fa 100%);
    color: white;
    width: 80%;
    border-radius: 25px;
  }

  .juanz {
    background-color: white;
    border-bottom: 1px solid lightgrey;
    padding: 3%;
    font-weight: bold;
  }
</style>
