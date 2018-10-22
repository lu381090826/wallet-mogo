import Vue from "vue";
import {appPlusInit} from "@/utils/common";
import App from "./scan.vue";

new Vue({
  el: "#app",
  render: h => h(App)
});
appPlusInit();
