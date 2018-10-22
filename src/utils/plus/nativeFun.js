import MathUtil from "../MathUtil";
import Vue from "vue";
import {request} from "../request";
import TGCApiUrl from "../constants/TGCApiUrl";
import { Toast } from 'vant';

Vue.use(Toast);
let NativeFun = {
  checkUpdate(showVersion) {
    let version = plus.runtime.version;
    request(TGCApiUrl.getLastVersion).then(res => {
      if (MathUtil.Version(version, res) < 0) {
        plus.nativeUI.confirm("发现新版本，立即更新？", function (e) {
          if (Number(e.index) === 0) {
            plus.runtime.openURL("https://www.pgyer.com/daL4");
          }
        });
      } else {
        if (showVersion)
          Toast('当前已经是最新版本' + version);
      }
    });
  },
  isToday(theDate) {
    let date = (new Date());    //当前时间
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨

    return theDate.getTime() > today;
  },
  saveStepData(totalStep) {
    let _t = this;
    let todayStep = plus.Storage.getItem("todayStep");
    if (_t.isToday(new Date(plus.storage.getItem("lastStepTime")))) {
      todayStep = Number(todayStep) + (Number(totalStep) - Number(plus.storage.getItem("totalStep")));
    } else {
      //新的一天，步数置零
      todayStep = 0;
    }

    //判断是否第一次执行
    if (todayStep >= totalStep) {
      todayStep = 0;
    }

    plus.storage.setItem("todayStep", Number(todayStep));
    plus.storage.setItem("totalStep", Number(totalStep));
    plus.storage.setItem("lastStepTime", new Date());

  },
  saveDetectorStepData(value) {
    // TGCoinHttpUtils.post("/user/api/stepCount",{values:value})
  },
  initBroadcastReceiver() {
    let _t = this;
    let main = plus.android.runtimeMainActivity();

    let Intent = plus.android.importClass("android.content.Intent");

    let IntentFilter = plus.android.importClass("android.content.IntentFilter");

    let filter = new IntentFilter();

    // 屏幕灭屏广播
    filter.addAction(Intent.ACTION_SCREEN_OFF);
    //关机广播
    filter.addAction(Intent.ACTION_SHUTDOWN);
    // 屏幕解锁广播
    filter.addAction(Intent.ACTION_USER_PRESENT);
    // 当长按电源键弹出“关机”对话或者锁屏时系统会发出这个广播
    // example：有时候会用到系统对话框，权限可能很高，会覆盖在锁屏界面或者“关机”对话框之上，
    // 所以监听这个广播，当收到时就隐藏自己的对话，如点击pad右下角部分弹出的对话框
    filter.addAction(Intent.ACTION_CLOSE_SYSTEM_DIALOGS);
    //监听日期变化
    filter.addAction(Intent.ACTION_DATE_CHANGED);
    filter.addAction(Intent.ACTION_TIME_CHANGED);
    filter.addAction(Intent.ACTION_TIME_TICK);

    let mInfoReceiver = plus.android.implements("io.dcloud.feature.internal.reflect.BroadcastReceiver", {
      onReceive: function (context, intent) {
        {
          let action = intent.getAction();
          switch (action) {
            // 屏幕灭屏广播
            case Intent.ACTION_SCREEN_OFF:
              //屏幕熄灭改为10秒一存储
              // _t.saveStepData();
              break;
            //关机广播，保存好当前数据
            case Intent.ACTION_SHUTDOWN:
              // _t.saveStepData();
              break;
            // 屏幕解锁广播
            case Intent.ACTION_USER_PRESENT:
              _t.saveDetectorStepData(111);
              break;
            // 当长按电源键弹出“关机”对话或者锁屏时系统会发出这个广播
            // example：有时候会用到系统对话框，权限可能很高，会覆盖在锁屏界面或者“关机”对话框之上，
            // 所以监听这个广播，当收到时就隐藏自己的对话，如点击pad右下角部分弹出的对话框
            case Intent.ACTION_CLOSE_SYSTEM_DIALOGS:
              // _t.saveStepData();
              break;
            //监听日期变化
            case Intent.ACTION_DATE_CHANGED:
            case Intent.ACTION_TIME_CHANGED:
            case Intent.ACTION_TIME_TICK:
              // _t.saveStepData();
              break;
            default:
              break;
          }
        }
      }
    });
    main.registerReceiver(mInfoReceiver, filter);
  },
  initSensorEventListener() {
    let _t = this;

    //初始化步数
    if (plus.storage.getItem("totalStep") == null)
      plus.storage.setItem("totalStep", Number(0));
    if (plus.storage.getItem("todayStep") == null)
      plus.storage.setItem("todayStep", Number(0));
    if (plus.storage.getItem("lastStepTime") == null)
      plus.storage.setItem("lastStepTime", new Date());

    let SensorEventListener = plus.android.implements("android.hardware.SensorEventListener", {
      onSensorChanged: function (event) {
        let values = plus.android.getAttribute(event, "values");
        _t.saveStepData(parseInt(values[0]));
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
