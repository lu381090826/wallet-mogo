// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
// import hotfix from 'h5plus-hotfix';
import "@/utils/common";
import App from "./App";

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  components: {App},
  template: "<App/>"
});
