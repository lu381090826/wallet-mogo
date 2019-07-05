<template>
  <div>
    <div class="outside">
      <div>
        {{date}}
      </div>
      <div class="percent" :style="{width:width}">
        {{profit}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      date: {
        type: String,
        default: ""
      },
      percent: {
        type: Number,
        default: 0
      },
      profit: {
        type: Number,
        default: 0
      },
    },
    data() {
      return {
        width: this.percent + "%"
      }
    },
    created() {
    },
  }

</script>

<style scoped lang="less">
  .outside {
    width: 100%;
    background-color: lightgray;
    color: white;
    height: 20px;
  }

  .percent {
    background-color: #ff550d;
    height: 20px;
    margin-top: -19px;
    text-align: right;
  }
</style>
