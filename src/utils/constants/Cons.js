const cons = {
  baseWebViewId: 'HBuilder',
  baseWebViewURL: './index.html',
  homeViewId: 'common.index',
  homeViewUrl: './common.index.html',
  loginViewId: 'common.login',
  loginViewUrl: './common.login.html',
  inLastWebViewIds: function contains(val) {
    let arr = ['HBuilder', 'common.login', 'common.index'];
    let i = arr.length;
    while (i--) {
      if (arr[i] === val) {
        return true;
      }
    }
    return false;
  },
};
export default cons;
