<template>
  <div>
    <van-cell-group>
      <van-field
        v-model="username"
        required
        clearable
        label="用户名"
        icon="question"
        placeholder="请输入用户名"
      />

      <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        required
      />
      <van-button type="default">登录</van-button>
    </van-cell-group>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {Field} from 'vant';

  Vue.use(Field);

  export default {
    data() {
      return {
        username: "",
        password: "",
      };
    },
    created() {
      let t = this;

      function plusReady() {
        t.createBarcode();
      }

      if (window.plus) {
        plusReady();
      } else {
        document.addEventListener("plusready", plusReady, false);
      }

    },
    methods: {},
  }
</script>

<style scoped>

</style>
