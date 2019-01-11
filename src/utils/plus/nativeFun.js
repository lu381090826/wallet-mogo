import MathUtil from "../MathUtil";
import Vue from "vue";
import {request} from "../request";
import TGCApiUrl from "../constants/TGCApiUrl";
import {Toast} from 'vant';
import {saveStepData} from "../globalTools";
import {isEmpty} from "../globalFunc";

Vue.use(Toast);
let NativeFun = {
  checkUpdate(showVersion) {
    let version = plus.runtime.version;
    request(TGCApiUrl.getLastVersion).then(res => {
      if (MathUtil.Version(version, res) < 0) {
        plus.nativeUI.confirm("发现新版本，立即更新？", function (e) {
          if (Number(e.index) === 0) {
            plus.runtime.openURL("http://120.79.191.116/");
          }
        });
      } else {
        if (showVersion) {
          Toast('当前已经是最新版本' + version);
        }
      }
    });
  },
  //监听步数
  initSensorEventListener() {
    console.log("开始计算步数");
    //初始化步数
    if (isEmpty(localStorage.getItem("totalStep"))) {
      localStorage.setItem("totalStep", Number(0));
    }
    if (isEmpty(localStorage.getItem("todayStep"))) {
      localStorage.setItem("todayStep", Number(0));
    }
    if (isEmpty(localStorage.getItem("lastStepTime"))) {
      let time = new Date().getTime();
      localStorage.setItem("lastStepTime", time);
    }

    let SensorEventListener = plus.android.implements("android.hardware.SensorEventListener", {
      onSensorChanged: function (event) {
        let values = plus.android.getAttribute(event, "values");
        saveStepData(parseInt(values[0]));
      },
      onAccuracyChanged: function (sensor, accuracy) {
      }
    });

    // 在这里真正注册Service服务
    let main = plus.android.runtimeMainActivity();
    let SensorManager = plus.android.importClass("android.hardware.SensorManager");
    let sM = main.getSystemService(main.SENSOR_SERVICE);
    let Sensor = plus.android.importClass("android.hardware.Sensor");
    let countSensor = sM.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
    let detectorSensor = sM.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR);
    let stepSensor;
    if (countSensor != null) {
      stepSensor = 0;
      sM.registerListener(SensorEventListener, countSensor, SensorManager.SENSOR_DELAY_FASTEST);
    } else if (detectorSensor != null) {
      stepSensor = 1;
      sM.registerListener(SensorEventListener, detectorSensor, SensorManager.SENSOR_DELAY_FASTEST);
    }
  }
};


export default NativeFun;
