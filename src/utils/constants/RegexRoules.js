const regexRoules = {
  username: /^[a-zA-Z0-9]{11}$/,
  phone: /^[0-9]{11,20}$/,
  verifyCode: /^[0-9]{6}$/,
  password: /^[a-zA-Z0-9]{6,20}$/,
  captcha: /^[0-9]{6}$/,
  walletName: /^[a-zA-Z0-9\u4E00-\u9FA5]{1,20}$/,
  passwordAgain: /^[0-9]{6,20}$/,
  desc: {
    username: "账号",
    phone: "手机号",
    password: "密码",
    captcha: "验证码",
    walletName: "地址名称",
    passwordAgain: "再次输入的密码",
  },
  errorMessage: {
    username: "请输入正确的格式，6-20个有效字符",
    phone: "请输入正确的手机号",
    password: "请输入正确的格式，6-20个有效字符",
    captcha: "请输入6位的数字验证码",
    walletName: "请输入正确的格式，6-20个有效字符",
    passwordAgain: "再次输入的密码不正确",
  }
};
export default regexRoules;
