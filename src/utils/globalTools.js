import cons from "./constants/Cons";
import {openWebview} from "./webview";

export function isToday(theDate) {
  let date = (new Date());    //当前时间
  let today = Number(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()); //今天凌晨
  let theDateNum = Number(theDate);
  if (theDateNum > 0) {
    return theDateNum > today;
  } else {
    return true;
  }
}

export function saveStepData(totalStep) {

  let todayStep = localStorage.getItem("todayStep");
  let lastTime = localStorage.getItem("lastStepTime");
  if (isToday(lastTime)) {
    todayStep = Number(todayStep) + (Number(totalStep) - Number(localStorage.getItem("totalStep")));
  } else {
    //新的一天，步数置零
    todayStep = 0;
  }

  //判断是否第一次执行
  if (todayStep >= totalStep) {
    todayStep = 0;
  }
  localStorage.setItem("todayStep", Number(todayStep));
  localStorage.setItem("totalStep", Number(totalStep));
  let time = new Date().getTime();
  localStorage.setItem("lastStepTime", time);

}
