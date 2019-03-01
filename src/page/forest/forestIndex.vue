<template>
  <div class="forest-body">
    <div class="container">
      <ul>
        <li style="float: left" :is="item.component"
            v-for="(item,k) in items" :key="k"
            :weight="item.weight"
            :x="item.x"
            :y="item.y">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Paopao from "./Paopao";
  import Vue from "vue";

  export default {
    components: {
      Paopao
    },
    data() {
      return {
        items: []
      }
    },
    methods: {
      append() {
        for (let i = 0; i < 5; i++) {
          let weight = Math.ceil(Math.random() * 10) * 100;
          let xNum = Math.random() * 200;
          let x = xNum > 300 ? 201 : yNum + 'px';
          let yNum = Math.random() * 200;
          let y = yNum > 300 ? 201 : yNum + 'px';
          this.items.push({
            'component': Paopao,
            'weight': weight,
            'x': x,
            'y': y,
          });
        }

      }
    },
    created() {
      this.append();
    }
  }
</script>

<style>
  .forest-body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    width: 600px;
  }

  .container {
    width: 100%;
    height: 100%;
    background: yellow;
    position: absolute;
    background-size: 100% 100%;
    background: url("../../../static/forest/image/bg.jpg") no-repeat;
    -moz-background-size: 100% 100%;
    background-size: contain;
    overflow: hidden;
  }

</style>
