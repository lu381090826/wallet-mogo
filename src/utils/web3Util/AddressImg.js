import crypto from 'crypto'
import Identicon from 'identicon.js'

export function getAddressImg(tokenAddress) {
  let hash = crypto.createHash('md5');
  hash.update(tokenAddress); // 传入用户名
  let imgData = new Identicon(hash.digest('hex')).toString();
  return 'data:image/png;base64,' + imgData // 这就是头像的base64码
}


