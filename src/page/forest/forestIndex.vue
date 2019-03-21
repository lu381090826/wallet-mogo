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
    >
    </li>
  </ul>
</div>

      </div>
      <div class="grassLand"></div>
    </div>
  </div>
</template>

<script>
  import Paopao from "./Paopao";
  import ForestCloud from "./ForestCloud";

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
      }
    },
    mounted() {
      // 获取浏览器可视区域高度
      this.clientHeight = `${document.documentElement.clientHeight}`          //document.body.clientWidth;
      //console.log(self.clientHeight);
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
          let weight = Math.ceil(Math.random() * 10) * 100;
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
    },
    created() {
      this.append();
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
</style>
