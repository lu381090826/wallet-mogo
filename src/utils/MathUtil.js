let MathUtil = {
//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
    accMul(arg1, arg2) {
      let m = 0, s1 = arg1.toString(), s2 = arg2.toString();

      try {
        m += s1.split(".")[1].length
      } catch (e) {
      }
      try {
        m += s2.split(".")[1].length
      } catch (e) {
      }
      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    },
    // 除数，被除数， 保留的小数点后的位数
    numberDiv (arg1, arg2, digit) {
      var t1 = 0, t2 = 0, r1, r2;
      try {
        t1 = arg1.toString().split(".")[1].length
      } catch (e) {
      }
      try {
        t2 = arg2.toString().split(".")[1].length
      } catch (e) {
      }
      r1 = Number(arg1.toString().replace(".", ""))
      r2 = Number(arg2.toString().replace(".", ""))
      //获取小数点后的计算值
      var result = ((r1 / r2) * Math.pow(10, t2 - t1)).toString()
      var result2 = result.split(".")[1];
      result2 = result2.substring(0, digit > result2.length ? result2.length : digit);

      return Number(result.split(".")[0] + "." + result2);
    },
    /**
     * @return {number}
     */
    Version(curV, reqV) {
      let arr1 = curV.split('.');
      let arr2 = reqV.split('.');
      //将两个版本号拆成数字
      let minL = Math.min(arr1.length, arr2.length);
      let pos = 0;        //当前比较位
      let diff = 0;        //当前为位比较是否相等

      //逐个比较如果当前位相等则继续比较下一位
      while (pos < minL) {
        diff = parseInt(arr1[pos]) - parseInt(arr2[pos]);
        if (diff !== 0) {
          break;
        }
        pos++;
      }

      if (diff > 0) {
        //新版本
        return 1;
      } else if (diff === 0) {
        //稳定版本
        return 0;
      } else {
        //旧版本
        return -1;
      }
    }
  }
;
export default MathUtil;
