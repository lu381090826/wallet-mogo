<template>
  <div class="myselfbody">
    <van-nav-bar title="感恩链">
    </van-nav-bar>

    <van-cell-group>
      <van-cell title="邀请好友" is-link icon="point-gift">
      </van-cell>

      <van-cell title="检查更新" is-link icon="upgrade" @click="checkUpdate()">
      </van-cell>
    </van-cell-group>

    <div class="sing-out">
      <van-button type="danger" @click="logout()" size="large">退出登录</van-button>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import { NavBar, Cell, CellGroup  } from 'vant';
  import NativeFun from "../utils/plus/nativeFun";

  Vue.use(NavBar);
  Vue.use(Cell).use(CellGroup);

  export default {
    data() {
      return {};
    }, methods: {
      checkUpdate() {
        NativeFun.checkUpdate(true)
      },
      logout() {
        let todayStep = localStorage.getItem("todayStep");
        let totalStep = localStorage.getItem("totalStep");
        let stepCountTime = localStorage.getItem("stepCountTime");
        let hasChange = localStorage.getItem("hasChange");

        localStorage.clear();

        localStorage.setItem("todayStep", parseInt(todayStep));
        localStorage.setItem("totalStep", parseInt(totalStep));
        localStorage.setItem("stepCountTime", stepCountTime);
        localStorage.setItem("hasChange", hasChange);

        // this.$router.push('/Login');
      }
    },
    created: function () {
    }
  }
</script>
<style scoped>
  .sing-out {
    position: fixed;
    bottom: 15%;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
  }

  .myselfbody {
    text-align: left;
    padding-top: 22px;
  }

  a:-webkit-any-link {
    color: gray;
    text-decoration: none;
  }
</style>
