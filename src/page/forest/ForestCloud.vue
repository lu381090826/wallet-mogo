<template>
  <div class="cloud1" :style="{left: left,top:top,width:width}"></div>
</template>
<script>
  export default {
    name: 'Forest-Cloud',
    props: {
      left: String,
      top: String,
      width: String,
    }
  }
</script>
<style>

  .cloud1 {
    /*width: 103px;*/
    height: 30px;
    background-color: #fff;
    border: 1px solid #fff;
    border-radius: 50%;
    position: absolute;
  }

  .cloud1:after {
    content: "";
    height: 29px;
    width: 46px;
    background-color: #fff;
    border: 1px solid #fff;
    border-radius: 50%;
    display: block;
    position: absolute;
    top: -8px;
    left: 48px;

  }

  .cloud1:before {
    content: "";
    height: 36px;
    width: 46px;
    background-color: #fff;
    border: 1px solid #fff;
    border-radius: 50%;
    display: block;
    position: absolute;
    top: -5px;
    left: 13px;
  }

</style>
